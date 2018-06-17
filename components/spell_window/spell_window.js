export default function createSpellWindow(canvas, scaleFactor) {
    const spellWindow = {};
    const tasksFile = require('../../resources/tasks/tasks.json');
    const tasks = tasksFile.tasks;
    const numberOfTasks = tasks.length; 
    
    let spellWindowDocumentCanvas;
    let runTaskHandler;
  
    spellWindow.body = document.createElement('div');
    spellWindow.body.classList.add('modal');
    spellWindow.body.classList.add('hidden');
  
    spellWindowDocumentCanvas = document.createElement('canvas');
    spellWindowDocumentCanvas.id = 'spell-window-canvas';
  
    spellWindow.body.appendChild(spellWindowDocumentCanvas);

    spellWindow.setTaskHandler = (func) => {
      runTaskHandler = func;
    };
  
    spellWindow.add = function() {
      document.body.appendChild(spellWindow.body);
      prepareCanvas();  
    }

    spellWindow.show = function() {
      spellWindow.body.classList.toggle('hidden');  
    }
  
    spellWindow.hide = function() {
      spellWindow.body.classList.toggle('hidden');
    }

    function chooseSpell(e) {
      if(e.target && e.target.text) {
        const spellListItem = e.target;
        const spellName = e.target.text;

        spellListItem.animate('opacity', 0.7, {
          duration: 400,
          onChange: () => {
            spellWindow.canvas.renderAll()
          },
          onComplete: () => {
            spellListItem.animate('opacity', 1, {
              duration: 400,
              onChange: () => {
                spellWindow.canvas.renderAll()
              },
              onComplete: () => {
                spellWindow.hide();
                setTimeout(() => {
                  runTaskHandler(spellName, canvas, scaleFactor);
                }, 800);
              }
            });
          }
        });         
      }   
    }
  
    function prepareCanvas() {
      spellWindow.canvas = new fabric.Canvas('spell-window-canvas', {
        width: 867*scaleFactor,
        height: canvas.height
      });

      spellWindow.canvas.setBackgroundImage('./resources/images/spell_window/scroll.png', spellWindow.canvas.renderAll.bind(spellWindow.canvas),{
        scaleX: scaleFactor,
        scaleY: scaleFactor
      });

      const spellListItemLeft = spellWindow.canvas.width/2;
      let spellListItemTop = spellWindow.canvas.height/2 - numberOfTasks*spellWindow.canvas.height/20/2;
   
      tasks.forEach((taskName, i) => { 
        
        const spellListItem = new fabric.Text(taskName, {
          fontFamily: 'Comic Kings',
          fontSize: spellWindow.canvas.height/20,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          lockUniScaling: true,
          hasControls: false,
          hoverCursor: 'pointer',
          left: spellListItemLeft,
          top: spellListItemTop + spellWindow.canvas.height/20*i,
          originX: 'center',
          originY: 'center',
          opacity: 0     
        });    
        
        setTimeout(() => {
          spellWindow.canvas.add(spellListItem);
        }, 400);
        
        setTimeout(() => {
           spellListItem.animate('opacity', 1, {
            duration: 1000,
            onChange: () => {
              spellWindow.canvas.renderAll();
            }
          });
        },200*i);
      });  
   
        spellWindow.canvas.on('mouse:up', function(e) {
          chooseSpell(e);
        });  
  }
    
  return spellWindow;
}