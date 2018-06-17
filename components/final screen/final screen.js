export default function createFinalScreen(canvas) {
    const finalScreen = {};
    const currentUserData = {};
    const scoreTableWrapper = document.createElement('div');
    const scoreTableBody = document.createElement('table');
    const scoreTableHead = document.createElement('tr');    
    const scoreTableUserNameHeader = document.createElement('th');
    const scoreTableKillsHeader = document.createElement('th');
    const scoreTableLabel = document.createElement('div');
    const playAgainButton = document.createElement('div');   
    const compareUsersKills = (a,b) => b['kills'] - a['kills'];
    const playAgain = () => {location.href = 'index.html'};

    let scoreTableData = window.localStorage.BrainSpellScore ? JSON.parse(window.localStorage.BrainSpellScore) : [];

    scoreTableLabel.innerHTML = 'top 10 scores';
    scoreTableUserNameHeader.innerHTML = 'users';
    scoreTableKillsHeader.innerHTML = 'kills';
    playAgainButton.innerHTML = 'play again';

    scoreTableWrapper.classList.add('score-table-wrapper');
    scoreTableBody.classList.add('score-table');
    playAgainButton.classList.add('play-again-button');

    scoreTableWrapper.style.webkitTextStroke = `${canvas.height/320}px black`
    scoreTableWrapper.style.height = `${canvas.height}px`;
    scoreTableWrapper.style.width = `${canvas.width}px`;
    scoreTableWrapper.style.fontSize = `${canvas.height/20}px`;
    scoreTableLabel.style.marginBottom = `${canvas.height/25}px`;
    playAgainButton.style.marginTop = `${canvas.height/25}px`;

    scoreTableWrapper.appendChild(scoreTableLabel); 
    scoreTableWrapper.appendChild(scoreTableBody); 
    scoreTableWrapper.appendChild(playAgainButton); 
    scoreTableBody.appendChild(scoreTableHead);
    scoreTableHead.appendChild(scoreTableUserNameHeader);
    scoreTableHead.appendChild(scoreTableKillsHeader);

    playAgainButton.onclick = () => {
        setTimeout(playAgain,800);
    };

    if(scoreTableData.length) {
        scoreTableData = scoreTableData.map(item => JSON.parse(item));
    }

    finalScreen.updateScore = (userName, kills) => {
        currentUserData.user = userName;
        currentUserData.kills = kills;       

        scoreTableData.push(currentUserData);

        scoreTableData = scoreTableData.sort(compareUsersKills);

        scoreTableData = scoreTableData.filter((item, i) => i<10);

        const tableToSave = scoreTableData.map(item => JSON.stringify(item));

        window.localStorage.BrainSpellScore = JSON.stringify(tableToSave);  
    }

    finalScreen.show = () => {
        scoreTableData.forEach(userData => {
            const tableRow = document.createElement('tr');
            const userNameTableData = document.createElement('td');
            const killsTableData = document.createElement('td');
           
            userNameTableData.innerHTML = userData.user;
            killsTableData.innerHTML = userData.kills;

            tableRow.appendChild(userNameTableData);
            tableRow.appendChild(killsTableData);
            
            scoreTableBody.appendChild(tableRow);
        });

        document.body.appendChild(scoreTableWrapper);      
    }

    return finalScreen;
}