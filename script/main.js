

/**
 * @param {CanvasRenderingContext2D} canvas 
 */
const SortDemo = function(canvas) {
	
	/** @type {CanvasRenderingContext2D} */
    var ctx = canvas.getContext('2d')
    var timeStep = 500; // In milliseconds
    const CW = ctx.canvas.width;    // 600
    const CH = ctx.canvas.height;   // 400
    const MARGIN_BOTTOM = 20;
    const MARGIN_TOP = 20;
    const MARGIN_SIDE = 10;

    const N_ITEMS = 20;
    const MAX_VALUE = 100;

    const TIME_STEP_MS = 250;

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
        this.higlight = 0;

        this.stroke = function(i) {
            ctx.beginPath();
            let strokeStyle = ctx.strokeStyle;
            if (this.higlight == 1) {
                ctx.strokeStyle = 'red';
            }
            ctx.moveTo(MARGIN_SIDE + i*itemFieldWidth + itemFieldWidth/2, MARGIN_BOTTOM)
            ctx.lineTo(MARGIN_SIDE + i*itemFieldWidth + itemFieldWidth/2, MARGIN_BOTTOM + this.value / MAX_VALUE * lineFieldheigt)            
            ctx.stroke()
            ctx.strokeStyle = strokeStyle;
        }
    }

    // we want (0,0) to be in the lower left corner and y coords from bottom to up
    ctx.translate(0, CH)
    ctx.scale(1 , -1);
	
    // initialize items to sort

    for(let i = 0; i < N_ITEMS; i++) {
        this.items.push(new Item(Math.floor(Math.random() * MAX_VALUE), i));
    }
    console.log(this.items)

    

	this.stroke = function() {

        // base line
        ctx.beginPath();
        ctx.moveTo(MARGIN_SIDE, MARGIN_BOTTOM);
        ctx.lineTo(CW - MARGIN_SIDE, MARGIN_BOTTOM)
        ctx.stroke()
        // draw items
        this.items.forEach((item, i) => item.stroke(i))
        ctx.stroke();
	}

    this.selectionSort = function* (self) {

        for (let i = 0; i < N_ITEMS; i++) {

            console.dir(`i = ${i}`);
            self.items[i].higlight = 1;
            yield "hello";
        }
    }

    /**
     * 
     * @param {SortDemo} self 
     * @param {Generator} generator 
     */
    this.runAnimation = function(self, generator) {
        console.log('runAnimation')
        ctx.clearRect(0, 0, CW, CH);
        self.stroke();

        let res = generator.next();
        console.debug('generator res: ' + res)

        if (!res.done) {
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
    /** @type {SortDemo} **/
    var sortDemo = new SortDemo(canvas);

    sortDemo.start();
})
