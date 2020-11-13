import DStar from './DStar';

const HEIGHT_STEP = 10;
const WIDTH_STEP = 10;
const BACKGROUND_LINE_COLOR = '#AAAAAA';
const WALL_COLOR = '#666666';
const CURRENT_COLOR = '#FF8800';
const TARGET_COLOR = '#FF0000';

export const CLICK_ACTION_ADD_WALL = 0x01;
export const CLICK_ACTION_REMOVE_WALL = 0x02;

const getPressPoint = e => {
    const {offsetX, offsetY} = e;
    const tx = Math.floor(offsetX / WIDTH_STEP);
    const x = tx * WIDTH_STEP;
    const ty = Math.floor(offsetY / HEIGHT_STEP);
    const y = ty * HEIGHT_STEP;
    const key = `${tx}/${ty}`;
    return {x, y, tx, ty, key};
};

const drawCross = (ctx, point, color) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x + WIDTH_STEP, point.y + HEIGHT_STEP);
    ctx.moveTo(point.x, point.y + HEIGHT_STEP);
    ctx.lineTo(point.x + WIDTH_STEP, point.y);
    ctx.stroke();
};

class DStarBoard {
    constructor(props) {
        const _this = this;
        const {canvas, height, width} = props;
        this.canvas = canvas;
        this.height = height;
        this.width = width;
        this.wallList = {};
        this.clickAction = CLICK_ACTION_ADD_WALL;
        this.currentPoint = {x: 100, y: 100};
        this.targetPoint = {x: 300, y: 300};
        this.canvas.onclick = e => {
            _this.onCanvasPress(e);
        };
    }

    setupDStar() {
        const width = this.width;
        const height = this.height;
        const start = this.currentPoint;
        const target = this.targetPoint;
        this.dStar = new DStar({
            onRePlan(list) {
                console.log(list);
            },
            start,
            target,
            requestPoint() {

            },
            onError(err) {
                console.log(err);
            },
            mapSize: {
                width,
                height,
            }
        });
        this.dStar.firstPlan();
    }

    onCanvasPress(e) {
        const point = getPressPoint(e);
        switch (this.clickAction) {
            case CLICK_ACTION_ADD_WALL:
                this.addWall(point);
                break;
            case CLICK_ACTION_REMOVE_WALL:
                this.removeWall(point);
                break;
            default:
                return;
        }
    }

    removeWall(point) {
        const {key} = point;
        delete this.wallList[key];
        this.rePaint();
    }

    addWall(point) {
        const {key} = point;
        if (key in this.wallList) {
            return;
        }
        this.wallList[key] = point;
        this.rePaint();
    }

    rePaint() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawBackground();
        this.drawWall();
        this.drawCurrent();
        this.drawTarget();
    }

    setup() {
        this.ctx = this.canvas.getContext('2d');
        this.rePaint();
        this.setupDStar();
    }

    drawBackground() {
        const ctx = this.ctx;
        const width = this.width;
        const height = this.height;
        ctx.strokeStyle = BACKGROUND_LINE_COLOR;
        for (let x = 0; x < width; x += WIDTH_STEP) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += HEIGHT_STEP) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();
    }

    drawCurrent() {
        const current = this.currentPoint;
        const ctx = this.ctx;
        drawCross(ctx, current, CURRENT_COLOR);
    }

    drawTarget() {
        const target = this.targetPoint;
        const ctx = this.ctx;
        drawCross(ctx, target, TARGET_COLOR);
    }

    drawWall() {
        const ctx = this.ctx;
        ctx.fillStyle = WALL_COLOR;
        for (const key in this.wallList) {
            if (!this.wallList.hasOwnProperty(key)) {
                continue;
            }
            const wall = this.wallList[key];
            ctx.fillRect(wall.x, wall.y, WIDTH_STEP, HEIGHT_STEP);
        }
    }

    checkCanvasChanged(canvas) {
        return canvas !== this.canvas;
    }

    setClickAction(action) {
        this.clickAction = action;
    }
}

export default DStarBoard;
