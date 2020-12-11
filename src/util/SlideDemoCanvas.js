const BOX_LIST = [
    {
        mode: 'b',
    },
    {
        mode: 'f',
    },
    {
        mode: 'b',
    },
    {
        mode: 'f',
    },
];
const BACKGROUND_COLOR = '#000000';
const FRAME_DURATION = 1000;

const BOX_SIZE = 20;
// const FOCUS_BOX_SIZE = 40;
const BOX_MARGIN = 1;
// const FOCUS_X = 45;
// const NORMAL_L_X = 1;
// const NORMAL_R_X = 1;
// const SIZE_K = 20 / 46;
// const SIZE_B = 900 / 46;
// const getPosition = (x, y) => {
//
// };

class SlideDemoCanvas {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.width = parseInt(canvas.getAttribute('width'));
        this.height = parseInt(canvas.getAttribute('height'));
        this.boxList = BOX_LIST;
    }

    setup() {
        this.drawBackground();
    }

    nextFrame() {
        this.drawBackground();
        let x = 0;
        let y = 0;
        for (const box of this.boxList) {
            const res = this.drawBox(x, y, box.mode);
            x = res.x + BOX_MARGIN;
            y = res.y;
        }
    }

    drawBox(x, y, mode) {
        const ctx = this.ctx;
        if (mode === 'b') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x, y, BOX_SIZE, BOX_SIZE);
        } else {
            ctx.strokeStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.rect(x, y, BOX_SIZE, BOX_SIZE);
            ctx.stroke();
        }
        console.log(x, y, mode);
        return {x: x + BOX_SIZE, y: y}
    }

    drawBackground() {
        this.ctx.fillStyle = BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.width, this.height);
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
