export default function createlisteningTask(canvas, scaleFactor, onRight, onWrong) {
    const taskFile = require('../../resources/tasks/listening task.json');
    const listeningTask = {};

    listeningTask.tasks = [];
    
    listeningTask.run = (canvas) => {
        if(listeningTask.tasks.length < 1) {
            for(let taskId in taskFile) {
                listeningTask.tasks.push(taskFile[taskId]);
            }
        }
            
        const randomTaskId = Math.round(Math.random()*(listeningTask.tasks.length-1));
        const currentTask = listeningTask.tasks.splice(randomTaskId, 1)[0];
        const taskText = currentTask['task'];
        const answer = taskText;
        const canvasTaskTop = canvas.height/8;

        let isRightAnswer = false;
        let userAnswer = ' ';

        const canvasTaskMessage = new fabric.Text('enter the word you heard', {
            fontFamily: 'Comic Kings',
            fontSize: canvas.height/14,
            fill: 'white',
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
            lockUniScaling: true,
            hasControls: false,
            hoverCursor: 'default',
            originX: 'center',
            top: canvasTaskTop,
            left: canvas.width/2
          }); 

        const button = new fabric.Text('push to listen', {
            fontFamily: 'Comic Kings',
            fontSize: canvas.height/14,
            fill: 'white',
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
            lockUniScaling: true,
            hasControls: false,
            hoverCursor: 'pointer',
            originX: 'center',
            top: canvasTaskMessage.top + canvasTaskMessage.height + 50*scaleFactor,
            left: canvas.width/2
          }); 
          
        const canvasTaskAnswer = new fabric.IText(' ', {
            fontFamily: 'Comic Kings',
            fontSize: canvas.height/8,
            fill: 'white',
            lockMovementX: true,
            lockMovementY: true,
            lockUniScaling: true,
            hasControls: false,
            hoverCursor: 'pointer',
            originX: 'center', 
            top: button.top + button.height + 20*scaleFactor,
            hasBorders: false,
            left: canvas.width/2
        });

        const tryButton = new fabric.Text(`try!`, {
            fontFamily: 'Comic Kings',
            fontSize: canvas.height/8,
            fill: 'white',
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
            lockUniScaling: true,
            hasControls: false,
            hoverCursor: 'default',
            originX: 'center',
            originY: 'center',
            top: canvas.height/1.3,
            left: canvas.width/2,
            hoverCursor: 'pointer'
          });  
          
        const checkAnswer = (ans) => {
            return answer === ans;
        }

        canvas.add(canvasTaskMessage);
        canvas.add(button);
        canvas.add(canvasTaskAnswer);
        canvas.add(tryButton);
        
        canvas.on('text:changed', function(e) {
            if(e.target.text === '') {
                e.target.text = ' ';
            }
            
            userAnswer = e.target.text.slice(0, -1);           
            
            isRightAnswer = checkAnswer(userAnswer);
            
        });

        canvas.on('mouse:up', function(e) {
            if(e.target && e.target.text && e.target.text === 'try!') {
                if(isRightAnswer) {
                    onRight();                    
                    return;
                } else if(userAnswer !== ' ') {
                    onWrong();
                    return;
                }   
            } else if (e.target && e.target.text && e.target.text === 'push to listen') {
                let speech = new SpeechSynthesisUtterance(taskText);
                speech.rate = 0.5;
                window.speechSynthesis.speak(speech);
            } else if(canvasTaskAnswer.isEditing) {
                canvasTaskAnswer.exitEditing();
                return;
            }            
            canvasTaskAnswer.enterEditing();
        });   
    }    
    return listeningTask;
}