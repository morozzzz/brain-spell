export default function createTranslationTask(canvas, scaleFactor, onRight, onWrong) {
    const taskFile = require('../../resources/tasks/translation.json');
    const translationTask = {};

    translationTask.tasks = [];
    
    translationTask.run = (canvas) => {
        if(translationTask.tasks.length < 1) {
            for(let taskId in taskFile) {
                translationTask.tasks.push(taskFile[taskId]);
            }
        }
            
        const randomTaskId = Math.round(Math.random()*(translationTask.tasks.length-1));
        const currentTask = translationTask.tasks.splice(randomTaskId, 1)[0];
        const taskText = currentTask['task'];
        const answers = currentTask.answer;
        const canvasTaskTop = canvas.height/8;

        let isRightAnswer = false;
        let userAnswer = ' ';

        const canvasTaskMessage = new fabric.Text('translate into russian', {
            fontFamily: 'Comic Kings',
            fontSize: canvas.height/12,
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
       
        const canvasTaskText = new fabric.Text(taskText, {
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
            top: canvasTaskText.top + canvasTaskText.height + 20*scaleFactor,
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
          
        const checkAnswer = (answer) => {
            return answers.some(ans => ans === answer);
        }

        canvas.add(canvasTaskMessage);
        canvas.add(canvasTaskText);
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
            } else if(canvasTaskAnswer.isEditing) {
                canvasTaskAnswer.exitEditing();
                return;
            }            
            canvasTaskAnswer.enterEditing();
        });   
    }    
    return translationTask;
}