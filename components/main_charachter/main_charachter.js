export default function createMainCharacter(canvas, scaleFactor, canvasWidth, canvasHeight) {
    let mainCharacterImages = [],
        monster;
    const mainCharacter = {},
          mainCharacterComponents = {};        
    
    const mainCharacterImageSources = {   
      leftArm: '../../resources/images/main-character/leftArm.png', 
      legs: '../../resources/images/main-character/legs2.png',
      torso: '../../resources/images/main-character/torso.png',
      head: '../../resources/images/main-character/head.png',
      rightArm: '../../resources/images/main-character/rightArm.png',
      hair: '../../resources/images/main-character/hair.png',
      eyes: '../../resources/images/main-character/eyes.png'
    };
  
    const mainCharacterBodyPartPositions = {   
      leftArm: [30, 100],
      legs: [12, 129], 
      torso: [0, 90],
      head: [13, 15],
      rightArm: [-5, 95],
      hair: [0, 0],
      eyes: [29, 68]
    };
  
    const shadow = new fabric.Ellipse({
      left: -25,
      top: 170,
      originX: 'center',
      originY: 'center',
      rx: 80,
      ry: 6,
      opacity: 0.5,
      fill: 'black',
    });
  
    function removeFromScreen(item) {
      canvas.remove(item);
    }
  
    mainCharacter.connectWith = function(character) {
      monster = character;
    }
  
    mainCharacter.blink = function() {
      function makeBlink() {
        mainCharacterComponents['eyes'].animate('scaleY', 0.1, {
          duration: 100,    
          onComplete: () => {
            mainCharacterComponents['eyes'].animate('scaleY', 1, {
              duration: 100    
            });
          }
        });
      }
      makeBlink();
      setInterval(makeBlink, 4000);  
    }
  
    mainCharacter.breathe = function() {
      function makeBreath() {
        for (let bodyPart in mainCharacterComponents) {
          const bodyPartComponent = mainCharacterComponents[bodyPart];
          if(bodyPart !== 'legs' && bodyPart !== 'torso') {
            bodyPartComponent.animate('top', bodyPartComponent.top - 4*scaleFactor, {
              duration: 1000,    
              onComplete: () => {
                bodyPartComponent.animate('top',  bodyPartComponent.top + 4*scaleFactor, {
                  duration: 1000    
                });
              }
            });
          }
        }
      }
      setInterval(makeBreath, 3000);
    }
  
    mainCharacter.move = function() {
      function makeMovement() {
        mainCharacterComponents['legs'].animate('angle', -10, {
          duration: 150,    
          onComplete: () => {
            mainCharacterComponents['legs'].animate('angle', 10, {
              duration: 150    
            });
          }
        }); 
        
        mainCharacterComponents['rightArm'].animate('angle', 7, {
          duration: 150,    
          onComplete: () => {
            mainCharacterComponents['rightArm'].animate('angle', -7, {
              duration: 150    
            });
          }
        }); 
  
        mainCharacterComponents['leftArm'].animate('angle', -7, {
          duration: 150,    
          onComplete: () => {
            mainCharacterComponents['leftArm'].animate('angle', 7, {
              duration: 150    
            });
          }
        });
      }
  
      const moveAnimationId = setInterval(makeMovement, 350);
  
      mainCharacter.body.animate('left', canvasWidth/10, {
        duration: 1500,
        onComplete: () => {
          clearInterval(moveAnimationId);
          mainCharacter.leftPoint = mainCharacter.body.left;
          mainCharacterComponents['legs'].animate('angle', 0, {
            duration: 400
          });
        }
      });  
    }
  
    mainCharacter.attack = function(isMiss) {
      const amountOfBalls = 50,
            ballUpperBound = canvasHeight/1.7,
            ballLowerBound = ballUpperBound + canvasHeight/10,
            ballRadius = canvasHeight/80,
            monsterTop = monster.body.top + monster.body.top/3*scaleFactor,
            monsterBottom = monsterTop +  monster.body.height/1.4*scaleFactor;
      let ballStartTop,
          ballEndTop,
          ballEndLeft,
          monsterLeft,
          protectCircleStartCenter,
          protectCircleLeft,
          protectCircleWidth,
          protectCircleHeight,
          protectCircle;
          
      function bounceOff(ball) {
        const startLeft = ball.left,
              startTop = ball.top,
              ballEndTop =  startTop/1.5 + Math.random()*(startTop + (Math.round(Math.random()) * 2 - 1)*monster.body.height/2*scaleFactor - startTop);
        let ballEndLeft;
  
        if(isMiss) {
          ballEndLeft = startLeft + Math.random()*(startLeft - monster.body.width/2*scaleFactor - startLeft);
        } else {
          ballEndLeft = startLeft + Math.random()*(startLeft + (Math.round(Math.random()) * 2 - 1)*monster.body.width/2*scaleFactor - startLeft);
        }
        
        ball.animate('left', ballEndLeft, {
          duration: 500
        });
  
        ball.animate('top', ballEndTop, {
        duration: 500
        });  
        
        ball.animate('scaleX', 1, {
          duration: 200,
          onComplete: () => {
            ball.animate('opacity', 0, {
              duration: 300,
              onComplete: () => {
                canvas.remove(ball);
              }        
            });
          }
        });        
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
  
       if(isMiss){
         protectCircleStartCenter = monsterTop + monster.body.height/2.6*scaleFactor;
         monsterLeft = monster.body.left + monster.body.width/10*scaleFactor;
         protectCircleWidth = monster.body.width/8*scaleFactor;
         protectCircleHeight = monster.body.height*0.9*scaleFactor;
         protectCircleLeft = monsterLeft + protectCircleWidth*0.9;
       } else {
        monsterLeft = (monster.body.left + (monster.body.width/2.3)*scaleFactor);
       }
  
      mainCharacterComponents['rightArm'].animate('left', -10, {
        duration: 500,    
      });
  
      mainCharacterComponents['rightArm'].animate('angle', -115, {
        duration: 500,    
      });
  
      mainCharacterComponents['leftArm'].animate('angle', -50, {
        duration: 500,    
      });
  
      mainCharacterComponents['leftArm'].animate('left', 40, {
        duration: 500, 
        onComplete: () => {
          mainCharacterComponents['eyes'].animate('scaleY', 0.5, {
            duration: 100,
            onComplete: () => { 
  
              if(isMiss){
                createProtectCircle(protectCircleLeft, protectCircleStartCenter, protectCircleHeight, protectCircleWidth, 700);
              }
              
              for(let i = 0; i < amountOfBalls; i++) {
                ballStartTop = ballLowerBound + Math.random()*(ballUpperBound - ballLowerBound);
                ballEndTop = monsterBottom + Math.random()*(monsterTop - monsterBottom);
                ballEndLeft = monsterLeft + Math.random()*monster.body.width/5*scaleFactor;
                const ball = new fabric.Circle({
                  radius: ballRadius,
                  left: mainCharacter.body.left + canvasWidth/8,
                  top: ballStartTop,
                  fill: '#' + Math.random().toString(16).slice(2, 8),
                  originX: 'center',
                  originY: 'center',
                  selectable: false,
                  hoverCursor: 'default',
                });
      
                const ballMoveTime = 900 + i*20;
      
                canvas.add(ball);
                
                ball.animate('top', ballEndTop, {
                  duration: ballMoveTime,
                });
  
                ball.animate('left', ballEndLeft, {
                  duration: ballMoveTime,
                  onComplete: () => {                                 
                    bounceOff(ball);
                    monster.stopBlinking()
                    
                    if(!isMiss && monster.inLeftPoint) {                                
                      monster.showDamage();              
                    } 
  
                    monster.inLeftPoint = true;
                      
                    mainCharacterComponents['eyes'].animate('scaleY', 1, {
                      duration: 100,
                      onComplete: () => {
                        if (i === amountOfBalls/2) {
                          mainCharacterComponents['rightArm'].animate('angle', 0, {
                            duration: 800,    
                          });
                      
                          mainCharacterComponents['rightArm'].animate('left', 17, {
                            duration: 800,    
                          });
    
                          mainCharacterComponents['leftArm'].animate('left', 55, {
                            duration: 800
                          });
                      
                          mainCharacterComponents['leftArm'].animate('angle', 0, {
                            duration: 800    
                          });
                        }  
                        if(i === amountOfBalls-1) {
                          monster.blink();
                          removeFromScreen(protectCircle)
                        }                                          
                      }
                    });
                  }           
                });          
              }
            }     
          });     
        }   
      });
    }
  
    mainCharacter.showDamage = function() {  
      mainCharacterComponents.eyes.animate('scaleY', 1.5, {
        duration: 100
      });
  
      mainCharacter.body.animate('left',  mainCharacter.body.left+3, {
        duration: 1,
        onComplete: () => {
          mainCharacter.body.animate('left',  mainCharacter.leftPoint, {
            duration: 1
          });
        }
      });  
    } 
  
    mainCharacter.heal = function(time) {
  
      let healingBallTop,
          healingBallLeft,
          healingBallRadius;
      
      function runHealingBall() {
        const healingBall = new fabric.Circle({
        radius: 10*scaleFactor,
        left: healingBallLeft,
        top: healingBallTop,
        originX: 'center',
        originY: 'center',
        selectable: false,
        hoverCursor: 'default',
        fill: 'white',
        opacity: 0.6,
        stroke: '#fffae6',
        strokeWidth: 3*scaleFactor
        });
  
        canvas.add(healingBall);
  
        healingBall.animate('left', healingBallLeft + 20*scaleFactor, {
          duration: time/5,
          onComplete: () => {
            healingBall.animate('radius', healingBallRadius, {
              duration: time/4,
              onComplete: () => {
                healingBall.animate('left', healingBallLeft - mainCharacter.body.width/2*scaleFactor, {
                  duration: time/4
                });
      
                healingBall.animate('top', healingBallTop, {
                  duration: time/5
                });
      
                healingBall.animate('opacity', 0, {
                  duration: time/4,
                  onComplete: () => {
                    removeFromScreen(healingBall);
                  }
                });
              }
            });
          }
        });      
  
        healingBall.animate('top', healingBallTop - 20*scaleFactor, {
          duration: time/4
        });      
      }
  
      mainCharacterComponents.rightArm.animate('angle', -110, {
        duration: time/4,
        onComplete: () => {
          healingBallLeft = mainCharacter.body.left + mainCharacter.body.width*scaleFactor; 
          healingBallTop = mainCharacter.body.top + mainCharacter.body.height/2*scaleFactor;
          healingBallRadius = mainCharacter.body.height*0.6*scaleFactor;
          
          runHealingBall();
        }
      });
      mainCharacterComponents.rightArm.animate('left', mainCharacterComponents.rightArm.left-10, {
        duration: time/4,
        onComplete: () => {
          mainCharacterComponents.rightArm.animate('angle', 0, {
            duration: time/4
          });
          mainCharacterComponents.rightArm.animate('left', mainCharacterComponents.rightArm.left+10, {
            duration: time/4
          });
        }
      });    
    }  
  
    for(let bodyPart in mainCharacterImageSources) {
      const bodyPartImage = new Image();
      bodyPartImage.src = mainCharacterImageSources[bodyPart];
  
      const canvasBodyPartImage = new fabric.Image(bodyPartImage, {
        left: +mainCharacterBodyPartPositions[bodyPart][0],
        top: +mainCharacterBodyPartPositions[bodyPart][1],
        selectable: false,
        hoverCursor: 'default',
        originX: "center", 
        originY: "top",
        angle: 0
      });
      mainCharacterComponents[bodyPart] = canvasBodyPartImage;      
    }
  
    mainCharacterComponents['eyes'].set({
      originX: "center", 
      originY: "center"
    });
  
    mainCharacterComponents['rightArm'].set({
      originX: 'right',
      originY: 'top'
    })
  
    for(let bodyPart in mainCharacterComponents) {
      mainCharacterImages.push(mainCharacterComponents[bodyPart])
    }
  
    mainCharacterImages.unshift(shadow);
  
    mainCharacter.body = new fabric.Group(mainCharacterImages, {
      top: canvasHeight/2.1,
      left: -canvasWidth/8, //-120
      selectable: false,
      hoverCursor: 'default',
      scaleX: scaleFactor,
      scaleY: scaleFactor
    });
   
    return mainCharacter;
  }