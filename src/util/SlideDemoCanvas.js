const BOX_LIST = [
    {
        color: '#FFFFFF',
    },
    {
        color: '#000000',
    },
    {
        color: '#FFFFFF',
    },
    {
        color: '#000000',
    },
];
const BACKGROUND_COLOR = '#000000';
const FRAME_DURATION = 1000;

class SlideDemoCanvas {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.width = parseInt(canvas.getAttribute('width'));
        this.height = parseInt(canvas.getAttribute('height'));
        this.boxList = BOX_LIST;
    }

    setup() {
        this.ctx.fillStyle = BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    nextFrame() {

    }

    nextBox() {
        const last = this.boxList.pop();
        this.boxList.unshift(last);
        console.log(this.boxList);
    }

    play() {
        this.timmer = setInterval(() => {
            this.nextFrame();
        }, FRAME_DURATION);
    }

    stop() {
        if (this.timmer) {
            clearInterval(this.timmer);
        }
    }
}

export default SlideDemoCanvas;