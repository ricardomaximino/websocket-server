    var chatHistoryList = document.querySelector('#chatHistoryList');
    var userList = document.querySelector('#userList');
    var messageForm = document.querySelector('#messageForm');
    var owner = true;

    function drawMessage(event) {
        event.preventDefault();
        let message = {time: '10:12 AM, Today', content: 'Hello my friend!!', avatar: 'https://bootdey.com/img/Content/avatar/avatar7.png'};

        if(owner) {
            let li = document.createElement('li');
            li.classList.add("clearfix");
            let divMessageHeader = document.createElement('div');
            divMessageHeader.classList.add("message-data");
            let spanTime = document.createElement('span');
            spanTime.classList.add("message-data-time");
            let img = document.createElement('img');
            let divMessage = document.createElement('div');
            divMessage.classList.add("message");
            divMessage.classList.add("my-message");

            let time = document.createTextNode(message.time);
            let content = document.createTextNode(message.content);

            spanTime.appendChild(time);
            img.src = message.avatar;
            divMessage.appendChild(content);

            divMessageHeader.appendChild(spanTime);
            divMessageHeader.appendChild(img);
            li.appendChild(divMessageHeader);
            li.appendChild(divMessage);
            chatHistoryList.appendChild(li);
        } else {

            let li = document.createElement('li');
            li.classList.add("clearfix");
            let divMessageHeader = document.createElement('div');
            divMessageHeader.classList.add("message-data");
            divMessageHeader.classList.add("text-right");
            let spanTime = document.createElement('span');
            spanTime.classList.add("message-data-time");
            let img = document.createElement('img');
            let divMessage = document.createElement('div');
            divMessage.classList.add("message");
            divMessage.classList.add("other-message");
            divMessage.classList.add("float-right");

            let time = document.createTextNode(message.time);
            let content = document.createTextNode(message.content);

            spanTime.appendChild(time);
            img.src = message.avatar;
            divMessage.appendChild(content);

            divMessageHeader.appendChild(spanTime);
            divMessageHeader.appendChild(img);
            li.appendChild(divMessageHeader);
            li.appendChild(divMessage);
            chatHistoryList.appendChild(li);
        }
        owner =! owner;
    }

    messageForm.addEventListener('submit', drawMessage, true)

    function addUser(user) {
        let li = document.createElement('li');
        li.classList.add("clearfix");
        let divAbout = document.createElement('div');
        let divName = document.createElement('div');
        let divStatus = document.createElement('div');
        let iStatus = document.createElement('i');
        let img = document.createElement('img');

        divAbout.classList.add("about");
        divName.classList.add("name");
        divStatus.classList.add("status");
        iStatus.classList.add("fa");
        iStatus.classList.add("fa-circle");

        if(user.online) {
            iStatus.classList.add("online");
        } else {
            iStatus.classList.add("offline");
        }

        let name = document.createTextNode(user.name);
        let lastSeen = document.createTextNode(user.lastSeen);

        divName.appendChild(name);
        divStatus.appendChild(iStatus);

        img.src = user.avatar;
        divStatus.appendChild(iStatus);

        divAbout.appendChild(divStatus);
        divAbout.appendChild(divName);
        li.appendChild(img);
        li.appendChild(divAbout);
        userList.appendChild(li);
    }

    let user = {
        avatar: "https://bootdey.com/img/Content/avatar/avatar1.png",
        lastSeen: "online",
        name: "Ricardo Maximino",
        online: true,
    };

    addUser(user);