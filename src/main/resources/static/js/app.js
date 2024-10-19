'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
var userList = document.querySelector('#userList')

let stompClient = null;
let username = null;
let selectedUser = null;
const connectedUserList = new Set();
const onlyChatMessage = true;


var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim();
    console.log("Connected user: "  + username);

    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/chat', onMessageReceived);
    stompClient.subscribe('/queue/' + username + '/private/message', onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat/addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
    fetchAndDisplayConnectedUsers();
}

async function fetchAndDisplayConnectedUsers() {
    const connectedUserResponse = await fetch('/api/user');
    let users = await connectedUserResponse.json();
    addAllUsers(users);
}

function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    if(selectedUser == null || selectedUser === "ALL"){
        sendPublicMessage(event);
    } else {
        sendPrivateMessage(event);
    }
}

function sendPublicMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            receiver: selectedUser,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat/public/sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function sendPrivateMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            receiver: selectedUser,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat/private/sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
        addUser(message.sender);
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
        removeUser(message.sender);
    } else if (message.type === 'CHAT'){
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    } else {
        alert(message.type + " is an unsupported message type")
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    if(!onlyChatMessage || message.type === 'CHAT') {
        messageArea.appendChild(messageElement);
        messageArea.scrollTop = messageArea.scrollHeight;
    }
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

function addAllUsers(users) {
    while (userList.firstChild) {
        userList.removeChild(userList.firstChild);
    }

    let buttonElement = document.createElement('button')
    buttonElement.id = 'ALL';
    buttonElement.innerHTML = 'ALL';
    buttonElement.addEventListener('click', selectUser, true)
    userList.appendChild(buttonElement);

    for(let user of users){
        connectedUserList.add(user)
        let buttonElement = document.createElement('button')
        buttonElement.id = user;
        buttonElement.innerHTML = user;
        buttonElement.addEventListener('click', selectUser, true)
        userList.appendChild(buttonElement);
    }
    console.log("Adding all users ", users);
}

function addUser(user) {
    if (!connectedUserList.has(user)){
        connectedUserList.add(user);
        let buttonElement = document.createElement('button');
        buttonElement.id = user;
        buttonElement.innerHTML = user;
        buttonElement.addEventListener('click', selectUser, true);
        userList.appendChild(buttonElement);
        console.log("Adding user ", user);
    }
}

function removeUser(user) {
    const element = document.getElementById(user);
    userList.removeChild(element.remove());
    console.log("Removing user ", user);
}

function selectUser(event) {
    selectedUser = event.target.id;
    console.log('User ' + selectedUser + ' is selected.');
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)

