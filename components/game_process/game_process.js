import createMainCharacter from '../../components/main_charachter/main_charachter.js';
import createMonster from '../../components/monster/monster.js';
import createSpellWindow from '../../components/spell_window/spell_window.js';
import createUserNameRequestWindow from '../../components/user_name_request_window/user_name_request_window.js';
import createTaskHandler from '../../components/task_handler/task_handler.js';
import createHealtBar from '../../components/health bar/health bar.js';
import createRoundsIndicator from '../../components/rounds indicator/rounds indicator.js';
import createFinalScreen from '../../components/final screen/final screen.js';

export default function startGame() { 
    let canvasHeight = 640,
        canvasWidth = 1280,
        scaleFactor = 1,
        userName;  
  
    if(innerWidth < 1280) {
        canvasWidth = innerWidth;
        canvasHeight = canvasWidth/2;
        scaleFactor = innerWidth/1280;  
    }
  
    const gameScreen = new fabric.Canvas('game-canvas', {
        width: canvasWidth,
        height: canvasHeight
    });

    gameScreen.setBackgroundImage('./resources/images/backgrounds/background1.png', gameScreen.renderAll.bind(gameScreen),{
        scaleX: scaleFactor,
        scaleY: scaleFactor
    });     
    
    let spellWindow;
    let monster = createMonster(gameScreen, scaleFactor, canvasWidth, canvasHeight);
    let mainCharacter = createMainCharacter(gameScreen, scaleFactor, canvasWidth, canvasHeight);

    const roundsIndicator = createRoundsIndicator(gameScreen, scaleFactor);
    const userNameRequestWindow = createUserNameRequestWindow(gameScreen);
    const finalScreen = createFinalScreen(gameScreen);
    const taskHandler = createTaskHandler(startRound);

    userNameRequestWindow.show(document.body);

    userNameRequestWindow.playButton.onclick = () => {
        userName = userNameRequestWindow.textArea.value;

        startBattle();

        userNameRequestWindow.remove();
    }

    function updateGameScreen() {  
        gameScreen.renderAll.call(gameScreen);
    }

    function startRound() {
        spellWindow.show();    
    }  

    function startBattle() {  

        gameScreen.setBackgroundImage('./resources/images/backgrounds/background1.png', gameScreen.renderAll.bind(gameScreen),{
            scaleX: scaleFactor,
            scaleY: scaleFactor
        });
        
        mainCharacter = createMainCharacter(gameScreen, scaleFactor, canvasWidth, canvasHeight);
        monster = createMonster(gameScreen, scaleFactor, canvasWidth, canvasHeight);
        
        let monsterName = monster.setNewName();
        let mainCharacterHealthBar = createHealtBar('left', gameScreen, scaleFactor, userName, stopGame);
        let monsterHealthBar = createHealtBar('right', gameScreen, scaleFactor, monsterName, startNextRound);
        
        taskHandler.setMainCharacter(mainCharacter, mainCharacterHealthBar);
        taskHandler.setMonster(monster, monsterHealthBar);
        

        if(!spellWindow) {
            spellWindow = createSpellWindow(gameScreen, scaleFactor);
            spellWindow.add();
        }

        spellWindow.setTaskHandler(taskHandler.run);
    
        setInterval(updateGameScreen, 1000/60);  

        gameScreen.add(mainCharacter.body);
        gameScreen.add(monster.body);

        monster.connectWith(mainCharacter);
        mainCharacter.connectWith(monster);

        mainCharacter.blink();
        mainCharacter.breathe();
        mainCharacter.move();

        monster.blink();
        monster.breathe();
        monster.move();

        mainCharacterHealthBar.add();
        monsterHealthBar.add();

        roundsIndicator.add();

        setTimeout(startRound, 2500);     
    }

    function startNextRound() {
        gameScreen.clear();

        gameScreen.setBackgroundImage('./resources/images/backgrounds/background1.png', gameScreen.renderAll.bind(gameScreen),{
            scaleX: scaleFactor,
            scaleY: scaleFactor
        });
        
        roundsIndicator.increase();
        setTimeout(startBattle, 1000);  
    }

    function stopGame() {
        finalScreen.updateScore(userName, roundsIndicator.value);
        finalScreen.show();       
    }   
}

