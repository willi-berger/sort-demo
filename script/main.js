

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

    
    /**
     * 
     * @param {number} value 
     * @param {number} index 
     */
    const Item = function(value, index) {
        this.value = value;
        this.index = index;
        this.state = 0;

        this.stroke = function(i) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 3;
            switch (this.state) {
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
            ctx.lineTo(MARGIN_SIDE + i*itemFieldWidth + itemFieldWidth/2, MARGIN_BOTTOM + this.value / MAX_VALUE * lineFieldheigt)            
            ctx.stroke()
            ctx.restore();
        }
    }

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

    

    /**
     * draw all
     */
	this.stroke = function() {

        console.log('stroke')
        // draw items
        this.items.forEach((item, i) => item.stroke(i))

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
     * Generator for the selction sort demo
     *  
     * @param {SortDemo} self 
     */
    this.selectionSort = function* (self) {

        let i = 0;
        let j = 0;
        for (i = 0; i < N_ITEMS - 1; i++) {
            let current_min_index = i;
            self.items[i].state = 'compare';

            for (j = i + 1; j < N_ITEMS; j++ ) {
                console.log(`i = ${i} j = ${j}`);
                self.items[j].state = 'compare';
                yield {'op': 'compare', 'items': [i, j]}

                if (this.items[j].value < this.items[current_min_index].value) {
                    console.debug(`new min: index ${j} value ${this.items[j].value}`)
                    this.items[current_min_index].state = 'default'
                    current_min_index = j;
                    this.items[j].state = 'current_min';
                } else {
                    this.items[j].state = 'default';
                }
            } 

            if (i != current_min_index) {
                [this.items[i], this.items[current_min_index]] = [this.items[current_min_index], this.items[i]];
            }
            this.items[i].state = 'done';
            yield {'op': 'swap', 'items': [i, j]}

        }
    }

    /**
     * 
     * @param {SortDemo} self 
     * @param {Generator} generator 
     */
    this.runAnimation = function(self, generator) {
        console.log('animatiionstep step')
        ctx.clearRect(0, 0, CW, CH);
        self.stroke();

        let res = generator.next();
        let value = res.value;
        
        if (!res.done) {
            console.debug(`generator res: op: ${value.op}, items ${value.items}`)
            timerId = setTimeout(self.runAnimation, TIME_STEP_MS, self, generator);
        } else {
            console.info('Finished');
        }
    }

    this.start = function() {
        generator = this.selectionSort(this);
        this.runAnimation(this, generator);
    }
	
}

$(document).ready(function () {
    var canvas = $("#canvas")[0]
    new SortDemo(canvas).start();
})
