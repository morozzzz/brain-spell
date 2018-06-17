export default function createHealtBar(position, canvas, scaleFactor, name, onDeathCallback) {
    let healthBarLeft,
        userNameLeft; 

    const healthBar = {};

    const canvasUserName = new fabric.Text(name, {
        fontFamily: 'Comic Kings',
        fontSize: canvas.height/20,
        selectable: false,
        hoverCursor: 'default',
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2*scaleFactor
      }); 
      
    const healthBarBorders = new fabric.Rect({
        height: canvas.height/20+4*scaleFactor,
        width: canvas.width/4+4*scaleFactor,
        fill: false,
        stroke: 'white',
        strokeWidth: 2*scaleFactor,
        rx: 12*scaleFactor,
        ry: 12*scaleFactor,
        selectable: false,
        hoverCursor: 'default',
        originX: 'center',
        originY: 'center'

    }); 

    const healthBarBody = new fabric.Rect({
        height: canvas.height/20,
        width: canvas.width/4,
        fill: 'red',
        rx: 10*scaleFactor,
        ry: 10*scaleFactor,
        selectable: false,
        hoverCursor: 'default'
    });

    const healthUnit = healthBarBody.width/100;

    healthBar.value = 100;

    if(position === 'left') {
        healthBarLeft = 20*scaleFactor;
        userNameLeft = healthBarLeft;
        healthBar.isLeft = true;
    } else if(position === 'right') {
        healthBarLeft = canvas.width - 23*scaleFactor - healthBarBody.width;
        userNameLeft = healthBarLeft + healthBarBody.width - canvasUserName.width;
    } else {
        throw new Error('have to be onle "left" or "right"')
    }

    canvasUserName.set({
        top: 20*scaleFactor,
        left: userNameLeft
    });

    healthBarBody.set({
        top: canvasUserName.height*1.1 + canvasUserName.top,
        left: healthBarLeft
    });

    healthBarBorders.set({
        top: healthBarBody.getCenterPoint().y,
        left: healthBarBody.getCenterPoint().x
    });

    healthBar.add = () => {
        canvas.add(canvasUserName);
        canvas.add(healthBarBody);
        canvas.add(healthBarBorders);
    }

    healthBar.decreaseBy = (number) => {        
        let newWidth = healthBarBody.width - number*healthUnit;

        healthBar.value -= number;

        if(newWidth < 0) {
            newWidth = 0;
        }

        healthBarBody.animate('width', newWidth, {
            duration: 1200,
            onComplete: () => {
                if(newWidth <= 0) {
                    healthBarBody.animate('opacity', 0, {
                        duration: 100
                    });
                    setTimeout(onDeathCallback, 2000);
                                   
                }
            }
        });

        if(!healthBar.isLeft) {
            healthBarBody.animate('left', healthBarBody.left + healthBarBody.width - newWidth, {
                duration: 1200
            })    
        }      
    }
    return healthBar;
}