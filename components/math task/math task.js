export default function createMathTask(canvas, scaleFactor, onRight, onWrong) {
    const taskFile = require('../../resources/tasks/math.json');
    const mathTask = {};

    mathTask.tasks = [];
    
    mathTask.run = (canvas) => {
        if(mathTask.tasks.length < 1) {
            for(let taskId in taskFile) {
                mathTask.tasks.push(taskFile[taskId]);
            }
        }
            
        const randomTaskId = Math.round(Math.random()*(mathTask.tasks.length-1));
        const currentTask = mathTask.tasks.splice(randomTaskId, 1)[0];
        const taskText = currentTask['task'];
        const answer = currentTask.answer;
        const canvasTaskTop = canvas.height/3;

        let isRightAnswer = false;
        let userAnswer = ' ';
       
        const canvasTaskText = new fabric.Text(`${taskText} =`, {
            fontFamily: 'Comic Kings',
            fontSize: canvas.height/5,
            fill: 'white',
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
            lockUniScaling: true,
            hasControls: false,
            hoverCursor: 'default',
            originX: 'center',
            originY: 'center',
            opacity: 1,
            top: canvasTaskTop 
          });  
          
        const canvasTaskAnswer = new fabric.IText(' ', {
            fontFamily: 'Comic Kings',
            fontSize: canvas.height/5,
            fill: 'white',
            lockMovementX: true,
            lockMovementY: true,
            lockUniScaling: true,
            hasControls: false,
            hoverCursor: 'pointer',
            originX: 'left',
            originY: 'center',
            opacity: 1, 
            top: canvasTaskTop,
            hasBorders: false
        });

        canvasTaskText.set({
            left: canvas.width/2 - canvasTaskText.width/4
        });
    
        canvasTaskAnswer.set({
            left: canvasTaskText.left/2 + canvasTaskText.width + 10*scaleFactor,
            width: canvas.width - canvasTaskText.left - 400*scaleFactor,
            originX: 'left',
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
            opacity: 1,
            top: canvas.height/1.3,
            left: canvas.width/2,
            hoverCursor: 'pointer'
          });         

        canvas.add(canvasTaskText);
        canvas.add(canvasTaskAnswer);
        canvas.add(tryButton);

        
        canvas.on('text:changed', function(e) {
            if(e.target.text === '') {
                e.target.text = ' ';
                e.target.width = canvas.width - canvasTaskText.left - 400*scaleFactor;
            }
            
            userAnswer = e.target.text;
            
            if(userAnswer == answer) {
                isRightAnswer = true;                                
            } else {
                isRightAnswer = false;  
            }
        })

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
    return mathTask;
}