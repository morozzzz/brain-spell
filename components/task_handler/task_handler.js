import createMathTask from '../../components/math task/math task.js';
import createTranslationTask from '../../components/translation task/translation task.js';
import createDragLettersTask from '../../components/drag letters task/drag letters task.js';
import createListeningTask from '../../components/listening task/listening task.js';


export default function createTaskHandler(callback) {
    const taskHandler = {};

    let mathTask,
        translationTask,
        dragLettersTask,
        listeningTask;

    let mainCharacter,
        mainCharacterHealthBar,
        monster,
        monsterHealthBar,
        taskDocumentCanvasWrapper,
        taskDocumentCanvas;   

    taskHandler.setMainCharacter = (newMainCharacter, newMainCharacterHealthBar) => {
        mainCharacter = newMainCharacter;
        mainCharacterHealthBar = newMainCharacterHealthBar;
    };

    taskHandler.setMonster = (newMonster, newMonsterHealthBar) => {
        monster = newMonster;
        monsterHealthBar = newMonsterHealthBar;
    };

    taskHandler.run = (taskName, canvas, scaleFactor) => {        

        const onRightAnswerCallback = () => {

            document.body.removeChild(taskDocumentCanvasWrapper);
            mainCharacter.attack();            
            
            setTimeout(() => {
                monsterHealthBar.decreaseBy(34);
            }, 1600);   

            setTimeout(() => {
                if(monsterHealthBar.value > 0) {
                    startMonsterTry();
                    setTimeout(callback, 5000);
                }
            }, 5000);           
        };

        const onWrongAnswerCallback = () => {
            document.body.removeChild(taskDocumentCanvasWrapper);
            mainCharacter.attack(true);         
            
            setTimeout(startMonsterTry, 4000);

            setTimeout(() => {

                if(mainCharacterHealthBar.value > 0) {
                    callback();
                }
            }, 8000);
        };
    
        function startMonsterTry () {
            const monsterPowers = [34, 30];
            const monsterCurrentPowerId = Math.round(Math.random()*(monsterPowers.length-1));
            const monsterCurrentPower = monsterPowers[monsterCurrentPowerId];
            const random = Math.random() * 2 - 0.3;

            if(random > 0) {
                monster.attack();
                setTimeout(() => {
                    mainCharacterHealthBar.decreaseBy(monsterCurrentPower);
                }, 2000);               
            } else {
                monster.attack(true);
            }
        }

        taskDocumentCanvasWrapper = document.createElement('div');
        taskDocumentCanvas = document.createElement('canvas');

        taskDocumentCanvas.id = 'task-canvas';
        taskDocumentCanvasWrapper.classList.add('modal');
    
        taskDocumentCanvasWrapper.appendChild(taskDocumentCanvas)
        document.body.appendChild(taskDocumentCanvasWrapper);
    
        const deskImage = new Image();
        deskImage.src = './resources/images/task/desk.png';
    
        deskImage.onload = () => {
            const taskBackground = new fabric.Image(deskImage);
    
            const desk = new fabric.Canvas('task-canvas', {
                width: deskImage.width*scaleFactor,
                height: deskImage.height*scaleFactor
            });
        
            desk.setBackgroundImage(taskBackground, desk.renderAll.bind(desk), {
            scaleX: scaleFactor,
            scaleY: scaleFactor
            });
            
            switch (taskName) {
                case 'math': {                   
                    mathTask = mathTask || createMathTask(desk, scaleFactor, onRightAnswerCallback, onWrongAnswerCallback );
                    
                    setTimeout(() => {
                        mathTask.run(desk);                       
                    }, 1000);
        
                    break;
                } 
                case 'translation': {
                    translationTask = translationTask || createTranslationTask(desk, scaleFactor, onRightAnswerCallback, onWrongAnswerCallback );
                    
                    setTimeout(() => {
                        translationTask.run(desk);                       
                    }, 1000);
        
                    break;
                } 
                case 'drag letters': {
                    dragLettersTask = dragLettersTask || createDragLettersTask(desk, scaleFactor, onRightAnswerCallback, onWrongAnswerCallback );

                    setTimeout(() => {
                        dragLettersTask.run(desk);                       
                    }, 1000);

                    break;
                } 
                case 'listening': {
                    listeningTask = listeningTask || createListeningTask(desk, scaleFactor, onRightAnswerCallback, onWrongAnswerCallback );
                    
                    setTimeout(() => {
                        listeningTask.run(desk);                       
                    }, 1000);
                    break;
                }   
            }
        }        
    }
    return taskHandler;
}