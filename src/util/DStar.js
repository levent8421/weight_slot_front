const SQRT2 = 1.4142135623730951;

const calcDistance = (pa, pb) => {
    const dx = Math.abs(pa.tx - pb.tx);
    const dy = Math.abs(pa.ty - pb.ty);
    return dx + dy;
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
}

class DStar {
    constructor(props) {
        const {onRePlan, start, target, requestPoint, onError, mapSize} = props;
        this.onRePlan = onRePlan;
        this.current = start;
        this.target = target;
        this.requestPoint = requestPoint;
        this.onError = onError;
        this.mapSize = mapSize;
        this.wallCache = {};
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
        while (!pointEquals(current, target)) {
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
        console.log(closeList);
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
        return calcMin(openList);
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
        if (closeList.hasKey(key) || this.wallCache.hasOwnProperty(key)) {
            return null;
        }
        return {
            tx: nextX,
            ty: nextY,
            key: key,
        };
    }

    go() {
        return this.current;
    }
}

export default DStar;
