import $ from "../../node_modules/jquery/dist/jquery.js";
require("../../jquery-ui.js");

export default function createDragLettersTask(canvas, scaleFactor, onRight, onWrong) {
    const taskFile = require('../../resources/tasks/drag letters task.json');
    const dragLettersTask = {};

    dragLettersTask.tasks = [];
    
    dragLettersTask.run = (canvas) => {
        if(dragLettersTask.tasks.length < 1) {
            for(let taskId in taskFile) {
                dragLettersTask.tasks.push(taskFile[taskId]);
            }
        }
            
        const randomTaskId = Math.round(Math.random()*(dragLettersTask.tasks.length-1));
        const currentTask = dragLettersTask.tasks.splice(randomTaskId, 1)[0];
        const taskText = currentTask.task;
        const answer = taskText;
        const canvasTaskTop = canvas.height/3;
        const taskWrapper = document.createElement('div');        
        const letterBox = document.createElement('ul');
        const taskMessage = document.createElement('div');
        const taskContainer = document.createElement('div');
        const tryButton = document.createElement('div');

        const shuffleLetters = (array) => {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }; 

        const checkAnswer = () => {
            Array.from(letterBox.childNodes).forEach(letter => {
                userAnswer.push(letter.innerHTML);
            });

            return userAnswer.join('') === answer;       
        };

        let isRightAnswer = false;
        let taskLetters = taskText.split('');
        let userAnswer = [];

        tryButton.innerHTML = 'TRY!';
        tryButton.classList.add('try-button');
        tryButton.style.fontSize = `${canvas.height/10}px`;
        tryButton.style.top = `-${canvas.height/15}px`;
        taskContainer.classList.add('drag-letters-task-container');
        taskContainer.style.height = `${canvas.height}px`;
        taskMessage.classList.add('drag-letters-task-message');
        taskMessage.innerHTML = 'Put the letters in the correct order';
        taskMessage.style.fontSize = `${canvas.height/12}px`;
        taskMessage.style.width = `${canvas.width*0.9}px`;
        taskMessage.style.top = `${canvas.height/10}px`;
        taskWrapper.classList.add('modal');
        letterBox.classList.add('letter-box');
        letterBox.id = 'sortable';
        letterBox.style.fontSize = `${canvas.height/8}px`;        

        taskLetters = shuffleLetters(taskLetters);

        taskLetters.forEach(letter => {
            const DraggableLetter = document.createElement('li');
            DraggableLetter.classList.add('letter');       
            DraggableLetter.innerHTML = letter;
            letterBox.appendChild(DraggableLetter);
        });        

        taskContainer.appendChild(taskMessage);
        taskContainer.appendChild(letterBox);
        taskContainer.appendChild(tryButton);        
        taskWrapper.appendChild(taskContainer);
        document.body.appendChild(taskWrapper);

        $( function() {
            $( "#sortable" ).sortable();
            $( "#sortable" ).disableSelection();
        } );         

        tryButton.onclick = () => {
            
            isRightAnswer = checkAnswer();
            if(isRightAnswer) {
                document.body.removeChild(taskWrapper);
                onRight();                    
                return;
            } else {
                onWrong();
                document.body.removeChild(taskWrapper);
                return;
            }            
        }            
    }    
    return dragLettersTask;
}