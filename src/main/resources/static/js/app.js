'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var publicMessageForm = document.querySelector('#publicMessageForm');
var privateMessageForm = document.querySelector('#privateMessageForm');
var meMessageForm = document.querySelector('#meMessageForm');
var publicMessageInput = document.querySelector('#publicMessage');
var privateReceiverInput = document.querySelector('#privateReceiver');
var privateMessageInput = document.querySelector('#privateMessage');
var meMessageInput = document.querySelector('#meMessage');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

const chats = new Map();
let receiver = "Ricardo";

class Chat {

    constructor(name, messages) {
        this.online = true;
        this.lastSeen = new Date();
        this.messages = messages;
        this.name = name;
    }

    addMessage(message){
        this.messages.push(message);
        this.update();
    }

    addAllMessages(messages) {
        messages.foreach((message) => this.messages.push(message));
        update();
    }

    update() {
        this.lastSeen = new Date();
    }

    getName() {
        return this.name;
    }

    isOnline() {
        return this.online;
    }

    setOffline() {
        this.online = false;
    }

    setOnline() {
        this.online = true;
        this.update();
    }
}

function connect(event) {
    username = document.querySelector('#name').value.trim();

    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


function onConnected() {
    // Subscribe to the Public Topic
    const publicQueue = '/topic/chat';
    let privateQueue = '/user/queue/chat';
    stompClient.subscribe(publicQueue, onMessageReceived);
    stompClient.subscribe(privateQueue, onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat/addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMeMessage(event) {
    var messageContent = meMessageInput.value.trim();
    if(messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            receiver: receiver,
            content: messageContent,
            type: 'CHAT'
        };
        stompClient.send("/app/chat/me/sendMessage", {}, JSON.stringify(chatMessage));
        meMessageInput.value = '';
    }
    event.preventDefault();
}

function sendPrivateMessage(event) {
    var messageContent = privateMessageInput.value.trim();
    var privateReceiver = privateReceiverInput.value.trim();
    if(messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            receiver: privateReceiver,
            content: messageContent,
            type: 'CHAT'
        };
        stompClient.send("/app/chat/private/sendMessage", {}, JSON.stringify(chatMessage));
        privateMessageInput.value = '';
    }
    event.preventDefault();
}

function sendPublicMessage(event) {
    var messageContent = publicMessageInput.value.trim();
    if(messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            receiver: receiver,
            content: messageContent,
            type: 'CHAT'
        };
        stompClient.send("/app/chat/public/sendMessage", {}, JSON.stringify(chatMessage));
        publicMessageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    let chat;
    let message = JSON.parse(payload.body)

    if(message.type === 'JOIN') {
        createOrUpdateChatWithName(message.sender)
        drawConnectionNotification(message.sender, 'joined!')
    } else if (message.type === 'LEAVE') {
        chat = chats.get(message.sender);
        chat.setOffline();
        drawConnectionNotification(message.sender, 'left!')
    } else if (message.type === 'CHAT') {
        createOrUpdateChatWithMessage(message);
        drawMessage(message);
    }
}

function createOrUpdateChatWithName(name) {
    let chat = chats.get(name);
    if (chat == undefined) {
        chat = new Chat(name, [])
        chats.set(chat.getName(), chat)
    } else {
        chat.setOnline();
    }
}

function createOrUpdateChatWithMessage(message) {
    let chat = chats.get(message.sender);
    if (chat == undefined) {
        chat = new Chat(message.sender, [message])
        chats.set(chat.getName(), chat)
    } else {
        chat.addMessage(message);
    }
}

function drawConnectionNotification(name, notification) {
    let messageElement = document.createElement('li');
    messageElement.classList.add('event-message');
    commonDrawMessage(name + ' ' + notification, messageElement);
}

function drawMessage(message) {
    let messageElement = document.createElement('li');
    let avatarElement = document.createElement('i');
    let avatarText = document.createTextNode(message.sender[0]);
    avatarElement.appendChild(avatarText);
    avatarElement.style['background-color'] = getAvatarColor(message.sender);

    messageElement.appendChild(avatarElement);

    let usernameElement = document.createElement('span');
    let usernameText = document.createTextNode(message.sender);
    usernameElement.appendChild(usernameText);
    messageElement.appendChild(usernameElement);
    messageElement.classList.add('chat-message');
    commonDrawMessage(message.content, messageElement);
}

function commonDrawMessage(text, listItemElement) {
    let textElement = document.createElement('p');
    let messageText = document.createTextNode(text);
    textElement.appendChild(messageText);
    listItemElement.appendChild(textElement);
    messageArea.appendChild(listItemElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true);
publicMessageForm.addEventListener('submit', sendPublicMessage, true);
privateMessageForm.addEventListener('submit', sendPrivateMessage, true);
meMessageForm.addEventListener('submit', sendMeMessage, true);
