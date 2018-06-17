export default function createUserNameRequestWindow(canvas) {
    const userNameRequestWindow = {}; 
    const messege = document.createElement('div');

    let parentElement;

    userNameRequestWindow.body = document.createElement('div');
    userNameRequestWindow.playButton = document.createElement('button');
    userNameRequestWindow.textArea = document.createElement('input');

    userNameRequestWindow.body.classList.add('user-name-request-window');    
    messege.classList.add('user-name-window-messege');
    userNameRequestWindow.textArea.classList.add('user-name-window-text-area');
    userNameRequestWindow.playButton.classList.add('user-name-window-play-button');
    
    userNameRequestWindow.body.style.height = `${canvas.height/2}px`;
    userNameRequestWindow.body.style.width = `${canvas.width/3}px`;
    

    messege.style.marginTop = `${canvas.height/13}px`;
    messege.style.fontSize = `${canvas.height/20}px`;
    messege.innerHTML = 'enter your name';
    messege.style.webkitTextStroke = `${canvas.height/320}px #000000b2`;

    userNameRequestWindow.textArea.style.marginTop = `${canvas.height/35}px`;
    userNameRequestWindow.textArea.type = 'text';
    userNameRequestWindow.textArea.required = true;
    userNameRequestWindow.textArea.style.fontSize = `${canvas.height/20}px`;
    userNameRequestWindow.textArea.style.width = `${canvas.width/4}px`;
    userNameRequestWindow.textArea.style.height = `${canvas.height/15}px`;

    userNameRequestWindow.playButton.style.marginTop = `${canvas.height/25}px`;
    userNameRequestWindow.playButton.style.width = `${canvas.width/10}px`;
    userNameRequestWindow.playButton.style.fontSize = `${canvas.height/20}px`;
    userNameRequestWindow.playButton.innerHTML = 'start game!';
    userNameRequestWindow.playButton.style.webkitTextStroke = `${canvas.height/320}px #000000b2`;

    userNameRequestWindow.body.appendChild(messege);
    userNameRequestWindow.body.appendChild(userNameRequestWindow.textArea);
    userNameRequestWindow.body.appendChild( userNameRequestWindow.playButton); 

    userNameRequestWindow.show = (parent) => {
        parentElement = parent;
        parent.appendChild(userNameRequestWindow.body);
    };

    userNameRequestWindow.remove = () => {
        parentElement.removeChild(userNameRequestWindow.body);
    };

    return userNameRequestWindow;
}