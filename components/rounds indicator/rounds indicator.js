export default function createRoundsIndicator(canvas, scaleFactor) {
    const roundsIndicator = {};    
    
    roundsIndicator.value = 1;

    const roundsIndicatorHeader =  new fabric.Text('round', {
        fontFamily: 'Comic Kings',
        fontSize: canvas.height/18,
        selectable: false,
        hoverCursor: 'pointer',
        left: canvas.width/2,
        top: 20*scaleFactor,
        stroke: 'black',
        strokeWidth: 2*scaleFactor,
        originX: 'center',
        fill: 'white'
    }); 

    const roundsIndicatorNumber =  new fabric.Text('1', {
        fontFamily: 'Comic Kings',
        fontSize: canvas.height/15,
        selectable: false,
        hoverCursor: 'pointer',
        left: canvas.width/2,
        top: roundsIndicatorHeader.top + roundsIndicatorHeader.height,
        stroke: 'black',
        strokeWidth: 2*scaleFactor,
        originX: 'center',
        fill: 'white'
    }); 

    roundsIndicator.add = () => {
        canvas.add(roundsIndicatorHeader);
        canvas.add(roundsIndicatorNumber);        
    }

    roundsIndicator.increase = () => {
        roundsIndicator.value++;
        roundsIndicatorNumber.text = `${roundsIndicator.value}`;      
    }

    return roundsIndicator;    
}