const SQRT2 = 1.4142135623730951;

const calcDistance = (pa, pb) => {
    const dx = Math.abs(pa.tx - pb.tx);
    const dy = Math.abs(pa.ty - pb.ty);
    return (dx + dy) / 2;
};
const calcCoast = (current, dx, dy) => {
    if (dx === 0) {
        return Math.abs(dy);
    }
    if (dy === 0) {
        return Math.abs(dx);
    }
    return SQRT2;
};
const pointEquals = (pa, pb) => {
    return pa.tx === pb.tx && pa.ty === pb.ty;
};
const MAX_STEP = 1000;
const calcMin = (list, current, target) => {
    let minCoastPoint = list[0];
    let minNum = 999999999;
    for (const point of list) {
        const coast = calcCoast(point, point.tx - current.tx, point.ty - current.ty);
        const distance = calcDistance(point, target);
        const num = coast + distance;
        if (num < minNum) {
            minNum = num;
            minCoastPoint = point;
        }
    }
    return minCoastPoint;
};

class CloseList {
    constructor() {
        this.pointTable = {};
        this.priority = 0;
    }

    push(point) {
        this.priority++;
        point.priority = this.priority;
        this.pointTable[point.key] = point;
    }

    hasKey(key) {
        return this.pointTable.hasOwnProperty(key);
    }

    asPath() {
        const res = [];
        for (const key in this.pointTable) {
            if (!this.pointTable.hasOwnProperty(key)) {
                continue;
            }
            res.push(this.pointTable[key]);
        }
        return res.sort((a, b) => b.priority - a.priority);
    }
}

class DStar {
    constructor(props) {
        const {onRePlan, start, target, requestPoint, onError, mapSize, updateCurrent} = props;
        this.onRePlan = onRePlan;
        this.current = start;
        this.target = target;
        this.requestPoint = requestPoint;
        this.onError = onError;
        this.mapSize = mapSize;
        this.updateCurrent = updateCurrent;
        this.wallCache = {};
        this.planPath = [];
        this.planPathIndex = 0;
    }

    firstPlan() {
        return this.rePlan();
    }

    rePlan() {
        let current = this.current;
        const target = this.target;
        let steps = 0;
        let nextPoint = target;
        const closeList = new CloseList();
        closeList.push(target);
        while (!pointEquals(current, nextPoint)) {
            steps++;
            if (steps > MAX_STEP) {
                this.onError('Target is not available! Step overflow1');
                return;
            }
            nextPoint = this.nextStep(current, nextPoint, closeList);
            if (nextPoint == null) {
                this.onError('Target is not available! Open list null!');
                return;
            }
            closeList.push(nextPoint);
        }
        const planPath = closeList.asPath();
        this.planPath = planPath;
        this.planPathIndex = 0;
        this.onRePlan(planPath);
        return closeList;
    }

    nextStep(target, current, closeList) {
        let openList = [];
        openList.push(this.nearPoint(current, closeList, 1, 1));
        openList.push(this.nearPoint(current, closeList, 1, 0));
        openList.push(this.nearPoint(current, closeList, 1, -1));
        openList.push(this.nearPoint(current, closeList, 0, 1));
        openList.push(this.nearPoint(current, closeList, 0, -1));
        openList.push(this.nearPoint(current, closeList, -1, 1));
        openList.push(this.nearPoint(current, closeList, -1, 0));
        openList.push(this.nearPoint(current, closeList, -1, -1));
        openList = openList.filter(point => point !== null);
        if (openList.length <= 0) {
            return null;
        }
        return calcMin(openList, current, target);
    }

    nearPoint(point, closeList, dx, dy) {
        const xMax = this.mapSize.width;
        const yMax = this.mapSize.height;
        const nextX = point.tx + dx;
        const nextY = point.ty + dy;
        if (nextX > xMax || nextX < 0 || nextY > yMax || nextY < 0) {
            return null;
        }
        const key = `${nextX}/${nextY}`;
        if (closeList.hasKey(key)) {
            return null;
        }
        if (this.wallCache.hasOwnProperty(key)) {
            return null;
        }
        return {
            tx: nextX,
            ty: nextY,
            key: key,
        };
    }

    go() {
        this.updateNearPointInfo();
        this.planPathIndex++;
        if (this.planPathIndex >= this.planPath.length) {
            return;
        }
        const point = this.planPath[this.planPathIndex];
        if (this.wallCache.hasOwnProperty(point.key)) {
            this.planPath = [];
            this.planPathIndex = 0;
            this.rePlan();
            return;
        }
        this.current = point;
        this.updateCurrent(point);
    }

    updateNearPointInfo() {
        const current = this.current;
        this.updatePointInfo(current, 1, 1);
        this.updatePointInfo(current, 1, 0);
        this.updatePointInfo(current, 1, -1);
        this.updatePointInfo(current, 0, 1);
        this.updatePointInfo(current, 0, -1);
        this.updatePointInfo(current, -1, 1);
        this.updatePointInfo(current, -1, 0);
        this.updatePointInfo(current, -1, -1);
    }

    updatePointInfo(base, xOffset, yOffset) {
        const x = base.tx + xOffset;
        const y = base.ty + yOffset;
        const {width, height} = this.mapSize;
        if (x > width || y > height || x < 0 || y < 0) {
            return;
        }
        const point = this.requestPoint(x, y);
        if (point == null) {
            // 为墙
            this.wallCache[`${x}/${y}`] = {
                tx: x,
                ty: y,
            };
        }
    }
}

export default DStar;
