export default function createMonster(canvas, scaleFactor, canvasWidth, canvasHeight) {
    let monsterImages = [],
        monsterBreathAnimationId,
        monsterBlinkAnimationId,
        mainCharacter,
        monsterBodyPartScreenPositions = {};
    const monster = {},
          monsterComponents = {},
          monsterNamesFile = require('./monster names.json');
    
    const monsterImageSources = {
      rightArm: [
        './resources/images/monster/right arms/rightArm1.png',
        './resources/images/monster/right arms/rightArm2.png'
      ],    
      legs: [
        './resources/images/monster/legs/legs1.png',
        './resources/images/monster/legs/legs2.png',
        './resources/images/monster/legs/legs3.png',
        './resources/images/monster/legs/legs4.png',
      ],
      torso: [
        './resources/images/monster/torsos/torso1.png',
        './resources/images/monster/torsos/torso2.png',
        './resources/images/monster/torsos/torso3.png',
        './resources/images/monster/torsos/torso4.png'
      ],
      head: [
        './resources/images/monster/heads/head1.png',
        './resources/images/monster/heads/head2.png',
        './resources/images/monster/heads/head3.png',
        './resources/images/monster/heads/head4.png'
      ],
      leftArm: [
        './resources/images/monster/left arms/leftArm1.png',
        './resources/images/monster/left arms/leftArm2.png',
        './resources/images/monster/left arms/leftArm3.png',
        './resources/images/monster/left arms/leftArm4.png'
      ],
      eyes: [
        './resources/images/monster/eyes/eyes1.png',
        './resources/images/monster/eyes/eyes2.png',
        './resources/images/monster/eyes/eyes3.png',
        './resources/images/monster/eyes/eyes4.png'
      ]
    };
  
    const monsterBodyPartPositions = {   
      leftArm: [110, 120],
      legs: [15, 210], 
      torso: [20, 90],
      head: [13, 15],
      rightArm: [-80, 130],
      eyes: [-7, 75]
    };
  
    const shadow = new fabric.Ellipse({
      left: -60,
      top: 325,
      originX: 'center',
      originY: 'center',
      rx: 150,
      ry: 12,
      opacity: 0.5,
      fill: 'black'
    });
  
    function removeFromScreen(item) {
      canvas.remove(item);
    }
  
    function getMonsterBodyPartPosotions() {
      for(let bodyPart in monsterComponents) {
        const monsterComponent = monsterComponents[bodyPart];
        monsterBodyPartScreenPositions[bodyPart] = [] ||  monsterBodyPartScreenPositions[bodyPart];
        monsterBodyPartScreenPositions[bodyPart].push(monsterComponent.left);
        monsterBodyPartScreenPositions[bodyPart].push(monsterComponent.top);
      }
    }
  
    function setMonsterBodyPartDefaulPositions(time) {
      for(let bodyPart in monsterComponents) {      
        const monsterComponent = monsterComponents[bodyPart];
  
        const monsterComponentLeft = monsterBodyPartScreenPositions[bodyPart][0];
        const monsterComponentTop = monsterBodyPartScreenPositions[bodyPart][1];
       
        monsterComponent.animate('left', monsterComponentLeft, {
          duration: time
        });
  
        monsterComponent.animate('top', monsterComponentTop, {
          duration: time
        });
      }
    }

    monster.setNewName = () => {
      const fullName = [];

      for (let id in monsterNamesFile) {
          const namePartItems = monsterNamesFile[id];
          const randomNamePartId = Math.round(Math.random()*(namePartItems.length-1));
          fullName.push(namePartItems[randomNamePartId]);            
      } 
           
      return fullName.join(' ');       
  }
  
    monster.connectWith = function(character) {
      mainCharacter = character;
    }
  
    monster.blink = function() {
      function makeBlink() {
        monsterComponents['eyes'].animate('scaleY', 0.2, {
          duration: 100,    
          onComplete: () => {
            monsterComponents['eyes'].animate('scaleY', 1, {
              duration: 100    
            });
          }
        });
      }
      makeBlink();
      monsterBlinkAnimationId = setInterval(makeBlink, 4538);  
    }
  
    monster.stopBlinking = function() {
      clearInterval(monsterBlinkAnimationId);
    }
  
    monster.breathe = function() {
      function makeBreath() {
        for (let bodyPart in monsterComponents) {
          const bodyPartComponent = monsterComponents[bodyPart];
          if(bodyPart !== 'legs' && bodyPart !== 'torso') {
            bodyPartComponent.animate('top', '-=4', {
              duration: 1400,    
              onComplete: () => {
                bodyPartComponent.animate('top', '+=4', {
                  duration: 1400    
                });
              }
            });
          }
        }
        monsterComponents['torso'].animate('scaleX', 1.07, {
          duration: 1421,    
          onComplete: () => {
            monsterComponents['torso'].animate('scaleX', 1, {
              duration: 1200    
            });
          }
        });
        monsterComponents['leftArm'].animate('left', monsterComponents.leftArm.left+5, {
          duration: 1421,    
          onComplete: () => {
            monsterComponents['leftArm'].animate('left', monsterComponents.leftArm.left-5, {
              duration: 1200    
            });
          }
        });
        
      }
      makeBreath();
      monsterBreathAnimationId = setInterval(makeBreath, 2800);
    }
  
    monster.stopBreath = function() {
      clearInterval(monsterBreathAnimationId);
    }
  
    monster.move = function() {
      function makeMovement() {
        monsterComponents['legs'].animate('angle', -10, {
          duration: 150,    
          onComplete: () => {
            monsterComponents['legs'].animate('angle', 10, {
              duration: 150    
            });
          }
        }); 
        
        monsterComponents['rightArm'].animate('angle', 7, {
          duration: 150,    
          onComplete: () => {
            monsterComponents['rightArm'].animate('angle', -7, {
              duration: 150    
            });
          }
        }); 
  
        monsterComponents['leftArm'].animate('angle', -2, {
          duration: 150,    
          onComplete: () => {
            monsterComponents['leftArm'].animate('angle', 2, {
              duration: 150    
            });
          }
        });
      }
      const moveAnimationId = setInterval(makeMovement, 350);
  
      monster.body.animate('left', canvasWidth-canvasWidth/2.5, {
        duration: 1500,
        onComplete: () => {
          clearInterval(moveAnimationId);
          monsterComponents['legs'].animate('angle', 0, {
            duration: 400
          });
          monster.leftPoint = monster.body.left;
          monster.inLeftPoint = true;
          getMonsterBodyPartPosotions();
          
          canvas.renderAll();
        }
      });  
    }
  
    monster.attack = function(isMiss) {  
      let protectCircleStartCenter,
          protectCircleLeft,
          protectCircleWidth,
          protectCircleHeight,
          protectCircle;
      
      function throwBalls() {
        const startLeft = monster.body.left + monster.body.width/3.8*scaleFactor,
              startTop = monster.body.top  + monster.body.height/1.14*scaleFactor,
              endTop = startTop,
              amountOfBalls = 12,
              maxRadius = mainCharacter.body.height/2,
              minRadius = mainCharacter.body.height/5,
              ballColors = ['#c19f66','#a77f51','#73573b','#5b452f'];
        let scaleBallAnimationId,
            endLeft;
  
        function startScaleBall(ball, min, delay) {
          const time = Math.random()*delay;
          function startScale() {          
            ball.animate('scaleX', min, {
              duration: 1000
            });
            ball.animate('scaleY', min, {
              duration: 100,
              onComplete: () => {
                ball.animate('scaleX', 1, {
                  duration: 100
                });
                ball.animate('scaleY', 1, {
                  duration: 100
                });
              }
            });
          }
          scaleBallAnimationId = setInterval(startScale, time);
          setTimeout(stopScaleBall, 2000);
        }
  
        function stopScaleBall() {
            clearInterval(scaleBallAnimationId);          
        }
  
        function addBallWithDelay(ball, delay) {
          function addBall() {
            canvas.add(ball);
          }
  
          setTimeout(addBall, delay);
        }
  
        function moveBallLeft(ball, endLeft, moveTime, delay, numberOfBall) {
          function startMove() {
            ball.animate('left', endLeft, {
              duration: moveTime,
              onComplete: () => {             
  
                if(!isMiss) {
                  mainCharacter.showDamage();
                }
  
                canvas.remove(ball);
  
                if(numberOfBall === amountOfBalls-1 && isMiss) {
                  removeFromScreen(protectCircle);                
                }
              }
            });
          }
          setTimeout(startMove, delay);
        }
  
        function startBallAnimation(ball, endLeft, moveTime, timeFactor) {
          const delay = 100*timeFactor;
          
          addBallWithDelay(ball, delay);
          moveBallLeft(ball, endLeft, moveTime, delay, timeFactor);
          startScaleBall(ball, 0.8, delay);    
        }
  
        function createProtectCircle(left, top, height, width, time) {
          protectCircle = new fabric.Ellipse({        
          left: left,
          top: top,
          fill: '#ffffde',
          opacity: 0.6,
          selectable: false,
          hoverCursor: 'default',
          rx: 1,
          ry: 1,
          originX: 'center',
          originY: 'center'
          });
    
          canvas.add(protectCircle);
    
          protectCircle.animate('ry', height/2, {
            duration: time
          });
    
          protectCircle.animate('rx', width/2, {
            duration: time
          });
        }
    
        if(isMiss) {
          protectCircleStartCenter = mainCharacter.body.top + mainCharacter.body.height/2*scaleFactor;
          protectCircleLeft = mainCharacter.body.left + mainCharacter.body.width*1.4*scaleFactor;
          protectCircleWidth = mainCharacter.body.width/2*scaleFactor;
          protectCircleHeight = mainCharacter.body.height*scaleFactor;
          endLeft = protectCircleLeft*1.1;
        } else {
          endLeft = mainCharacter.body.left + mainCharacter.body.width*scaleFactor;
        }
  
        for(let i = 0; i < amountOfBalls; i++) {
          const ballRadius = (minRadius + Math.random()*(maxRadius - minRadius))*scaleFactor;
          const ballColor = ballColors[Math.round(Math.random()*(ballColors.length-1))];
          const ball = new fabric.Circle({
            radius: ballRadius,
            left: startLeft,
            top: startTop,
            fill: ballColor,
            stroke: 'black',
            strokeWidth: 4*scaleFactor,
            originX: 'center',
            originY: 'center',
            selectable: false,
            hoverCursor: 'default',
            startAngle: 0,
            endAngle: Math.PI,
            angle: 180
          });
          
          const ballMoveTime = 1200;
          
          startBallAnimation(ball, endLeft, ballMoveTime, i);
        }
        if(isMiss) {
          createProtectCircle(protectCircleLeft, protectCircleStartCenter, protectCircleHeight, protectCircleWidth, 700);
        }
      }
      
      monster.stopBreath();
      monster.stopBlinking();
  
      monsterComponents.eyes.animate('scaleY', 0.5, {
        duration: 200,
        easing: fabric.util.ease.easieInQuint,
      });
  
      monsterComponents.eyes.animate('left',  monsterComponents.eyes.left - 100, {
        duration: 1000,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.eyes.animate('left', monsterComponents.eyes.left + 100, {
            duration: 1000
          });
        }
      });
  
      monsterComponents.eyes.animate('top',  monsterComponents.eyes.top + 90, {
        duration: 1000,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          throwBalls();
          monsterComponents.eyes.animate('top', monsterComponents.eyes.top - 90, {
            duration: 1000
          });
        }
      });
  
      monsterComponents.eyes.animate('angle',  -50, {
        duration: 1000,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.eyes.animate('angle', 0, {
            duration: 1000
          });
        }
      });
  
      monsterComponents.head.animate('left',  monsterComponents.head.left - 150, {
        duration: 1000,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.head.animate('left', monsterComponents.head.left + 150, {
            duration: 1000
          });
        }
      });
  
      monsterComponents.head.animate('top',  monsterComponents.head.top + 90, {
        duration: 1000,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.head.animate('top', monsterComponents.head.top - 90, {
            duration: 1000
          });
        }
      });
  
      monsterComponents.head.animate('angle',  -50, {
        duration: 1000,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.head.animate('angle', 0, {
            duration: 1000
          });
        }
      });
  
      monsterComponents.torso.animate('left',  monsterComponents.torso.left - 80, {
        duration: 1000,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.torso.animate('left', monsterComponents.torso.left + 80, {
            duration: 1000
          });
        }
      });
  
      monsterComponents.torso.animate('top',  monsterComponents.torso.top + 45, {
        duration: 1000,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.torso.animate('top', monsterComponents.torso.top - 45, {
            duration: 1000
          });
        }
      });
  
      monsterComponents.torso.animate('angle',  -50, {
        duration: 1000,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.torso.animate('angle', 0, {
            duration: 1000
          });
        }
      });
  
      monsterComponents.leftArm.animate('left',  monsterComponents.leftArm.left - 10, {
        duration: 500,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.leftArm.animate('left',  monsterComponents.leftArm.left - 50, {
            duration: 500,
            easing: fabric.util.ease.easieInQuint,
            onComplete: () => {
              monsterComponents.leftArm.animate('left', monsterComponents.leftArm.left + 60, {
                duration: 1000
              });
            }
          });
        }
      });
  
      monsterComponents.leftArm.animate('top', monsterComponents.leftArm.top + 10, {
        duration: 500,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.leftArm.animate('top', monsterComponents.leftArm.top + 10, {
            duration: 500,
            easing: fabric.util.ease.easieInQuint,
            onComplete: () => {
              monsterComponents.leftArm.animate('top', monsterComponents.leftArm.top - 20, {
                duration: 1000,                                
              });
            }
          });
        }
      });
  
      monsterComponents.leftArm.animate('angle',  30, {
        duration: 500,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.leftArm.animate('angle', -5, {
            duration: 500,
            onComplete: () => {
              monsterComponents.leftArm.animate('angle', 0, {
                duration: 1000
              });
            }
          });
        }
      });
  
      monsterComponents.rightArm.animate('left',  monsterComponents.rightArm.left + 20, {
        duration: 500,
        onComplete: () => {
          monsterComponents.rightArm.animate('left',  monsterComponents.rightArm.left - 20, {
            duration: 500,
            easing: fabric.util.ease.easieInQuint,
            onComplete: () => {
              monsterComponents.rightArm.animate('left', monsterComponents.rightArm.left + 0, {
                duration: 1000
              });
            }
          });
        }
      });
  
      monsterComponents.rightArm.animate('top', monsterComponents.rightArm.top + 75, {
        duration: 1000,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.rightArm.animate('top', monsterComponents.rightArm.top - 75, {
            duration: 1000
          });
        }
      });
  
      monsterComponents.rightArm.animate('angle',  20, {
        duration: 500,
        easing: fabric.util.ease.easieInQuint,
        onComplete: () => {
          monsterComponents.rightArm.animate('angle', -5, {
            duration: 500,
            onComplete: () => {
              monsterComponents.rightArm.animate('angle', 0, {
                duration: 1000,
                onComplete: () => {                
                  monsterComponents.eyes.animate('scaleY', 1, {
                    duration: 200,
                    onComplete: () => { 
                      setMonsterBodyPartDefaulPositions(499);
                      setTimeout(monster.breathe, 500);                    
                      setTimeout(monster.blink, 2000);
                    }
                  });                  
                }
              });
            }
          });
        }
      });       
    }
  
    monster.showDamage = function() {
      monsterComponents.eyes.animate('scaleY', 1.5, {
        duration: 100
      });
      
      monster.body.animate('left', monster.body.left + 2*scaleFactor, {
        duration: 10,
        onComplete: () => {
          monster.body.animate('left', monster.leftPoint, {
            duration: 10
          });
          monster.inLeftPoint = false;
        }
      });
    }     
    
    for(let bodyPart in monsterImageSources) {  
      const randomBodyPartItem = Math.round(Math.random()*(monsterImageSources[bodyPart].length - 1));
      const bodyPartImageSource = monsterImageSources[bodyPart][randomBodyPartItem];
      
      const bodyPartImage = new Image();
      bodyPartImage.src =  bodyPartImageSource;
  
      const canvasBodyPartImage = new fabric.Image(bodyPartImage, {
        left: +monsterBodyPartPositions[bodyPart][0],
        top: +monsterBodyPartPositions[bodyPart][1],
        selectable: false,
        hoverCursor: 'default',
        originX: "center", 
        originY: "top",
        angle: 0
      });
      monsterComponents[bodyPart] = canvasBodyPartImage;
    }  
  
    monsterComponents['eyes'].set({
      originX: "center", 
       originY: "center"
    });
  
    for(let bodyPart in monsterComponents) {
      monsterImages.push(monsterComponents[bodyPart])
    }
  
    monsterImages.unshift(shadow);
  
    monster.body = new fabric.Group(monsterImages, {
      top: canvasHeight/4.5,
      left: canvasWidth,
      selectable: false,
      hoverCursor: 'default',
      scaleX: scaleFactor,
      scaleY: scaleFactor,
    });
  
    monster.body.width +=  monster.body.width/6;
    monster.body.height += monster.body.height/6;
   
    return monster;
  }