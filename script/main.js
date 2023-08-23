
   
/**
 * 
 * @param {number} value 
 * @param {number} index 
 */
const Item = function(value, index) {
    this.value = value;
    this.index = index;
    this.state = 0;

    /**
     * 
     * @param {Item} another 
     * @returns number
     */
    this.compareTo = function(another) {
        return this.value === another.value ? 0 : this.value < another.value ? -1 : 1;
    }
}

/**
 * @param {CanvasRenderingContext2D} canvas 
 */
const SortDemo = function(canvas) {
	
	/** @type {CanvasRenderingContext2D} */
    var ctx = canvas.getContext('2d')
    const CW = ctx.canvas.width;    // 600
    const CH = ctx.canvas.height;   // 400
    const MARGIN_BOTTOM = 20;
    const MARGIN_TOP = 20;
    const MARGIN_SIDE = 10;

    const N_ITEMS = 50;
    const MAX_VALUE = 100;

    const TIME_STEP_MS = 50;

    const baseLineLength = CW - 2 * MARGIN_SIDE;
    const lineFieldheigt = CH - MARGIN_BOTTOM - MARGIN_TOP;
    const itemFieldWidth = baseLineLength / N_ITEMS;

    this.items = []


    // we want (0,0) to be in the lower left corner and y coords from bottom to up
    ctx.translate(0, CH)
    ctx.scale(1 , -1);
	
    // initialize items to sort
    let min = 10
    let max = MAX_VALUE - 10
    for(let i = 0; i < N_ITEMS; i++) {
        this.items.push(new Item(Math.floor(Math.random() * max) + min, i));
    }
    console.log(this.items)

    
    this.strokeItem = function(item, i) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 3;
        switch (item.state) {
            case 'compare':
                ctx.strokeStyle = 'yellow';
                break;
            case 'current_min':
                ctx.strokeStyle = 'blue';
                break;
            case 'done':
                ctx.strokeStyle = 'green';
                break;
            default:
                ctx.strokeStyle = 'black';
                break;
        }

        ctx.moveTo(MARGIN_SIDE + i*itemFieldWidth + itemFieldWidth/2, MARGIN_BOTTOM)
        ctx.lineTo(MARGIN_SIDE + i*itemFieldWidth + itemFieldWidth/2, MARGIN_BOTTOM + item.value / MAX_VALUE * lineFieldheigt)            
        ctx.stroke()
        ctx.restore();
    }

    /**
     * draw all
     */
	this.stroke = function() {
        console.debug('stroke')
        // draw items
        this.items.forEach((item, i) => this.strokeItem(item, i))

        // base line
        ctx.save();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(MARGIN_SIDE, MARGIN_BOTTOM);
        ctx.lineTo(CW - MARGIN_SIDE, MARGIN_BOTTOM)
        ctx.stroke()
        ctx.restore();
	}



    /**
     * 
     * @param {SortDemo} self 
     * @param {Generator} generator 
     */
    this.runAnimation = function(self, generator) {
        ctx.clearRect(0, 0, CW, CH);
        self.stroke();

        let res = generator.next();
        let value = res.value;
        
        if (!res.done) {
            console.log(`generator res: op: ${value.op}, items ${value.items}`)
            timerId = setTimeout(self.runAnimation, TIME_STEP_MS, self, generator);
        } else {
            console.info('Finished');
        }
    }

    this.start = function(generator) {
        this.runAnimation(this, generator(this.items));
    }
	
}


/**
 * Generator for the selction sort demo
 * @param {Array} items 
 */
selectionSort = function* (items) {

    let i = 0;
    let j = 0;
    for (i = 0; i < items.length - 1; i++) {
        let current_min_index = i;
        items[i].state = 'compare';

        for (j = i + 1; j < items.length; j++ ) {
            console.log(`i = ${i} j = ${j}`);
            items[j].state = 'compare';
            yield {'op': 'compare', 'items': [i, j]}

            if (items[j].compareTo(items[current_min_index]) <= 0) {
                console.debug(`new min: index ${j} value ${items[j].value}`)
                items[current_min_index].state = 'default'
                current_min_index = j;
                items[j].state = 'current_min';
            } else {
                items[j].state = 'default';
            }
        } 

        if (i != current_min_index) {
            [items[i], items[current_min_index]] = [items[current_min_index], items[i]];
        }
        
        items[i].state = 'done';
        yield {'op': 'swap', 'items': [i, current_min_index]}

    }
}

$(document).ready(function () {
    var canvas = $("#canvas")[0]
    new SortDemo(canvas).start(selectionSort);

})
