export const asKg = g => {
    return (g / 1000.0).toFixed(3);
};

export const isWan = state => {
    return state !== 1;
};

export const isIncredible = state => {
    return state !== 1;
};

export const isDisable = state => {
    return state === 3;
};

export const isOffline = state => {
    return state === 2;
};

const connectionTypes = {
    1: '串口',
    2: '网络',
};

export const asConnectionType = type => {
    if (type in connectionTypes) {
        return connectionTypes[type];
    }
    return `Unknown [${type}]`;
};

const weightStateTable = {
    1: 'stable',
    2: 'dynamic',
    3: 'underLoad',
    4: 'overLoad',
};
export const isStable = weightState => {
    return weightState === 1;
};

export const asWeightStateString = state => {
    return state in weightStateTable ? weightStateTable[state] : state;
};
const slotSortWeight = {
    'S': 1,
    'D': 2,
    'F': 3,
};

const compareBySlotNo = (a, b) => {
    const aName = a.slotNo;
    const bName = b.slotNo;
    const aNames = aName.split('-');
    const bNames = bName.split('-');
    if (aNames.length !== bNames.length) {
        return aNames.length - bNames.length;
    }
    for (let i = 0; i < aNames.length; i++) {
        const aItem = parseInt(aNames[i]);
        const bItem = parseInt(bNames[i]);
        if (!(aItem && bItem)) {
            continue;
        }
        if (aItem !== bItem) {
            return aItem - bItem;
        }
    }
    return 0;
};
export const groupSlots = slots => {
    const groups = {};
    const putSlot = (name, slot) => {
        if (name in groups) {
            groups[name].push(slot);
        } else {
            groups[name] = [slot];
        }
    };
    for (let slot of slots) {
        const slotNo = slot.slotNo;
        const noItems = slotNo.match(/^(\w+)-(\w+)-(\w+)$/);
        if (noItems) {
            const groupName = `${noItems[1]}货架第${noItems[2]}层`;
            putSlot(groupName, slot);
        } else {
            putSlot('未分组货道', slot);
        }
    }
    const res = [];
    for (let name in groups) {
        if (!groups.hasOwnProperty(name)) {
            continue;
        }
        const slots = groups[name];
        res.push({
            name,
            slots: slots.sort(compareBySlotNo),
        });
    }
    return res.sort((a, b) => {
        const aWeight = slotSortWeight[a.name.substring(0, 1)];
        const bWeight = slotSortWeight[b.name.substring(0, 1)];
        if (aWeight !== bWeight) {
            return aWeight - bWeight;
        }
        return a.name.localeCompare(b.name);
    });
};

const stateTable = {
    1: '使用中',
    2: '离线',
    3: '已停用',
    4: '超载',
    5: '欠载',
};
export const asStateString = state => {
    if (state in stateTable) {
        return stateTable[state];
    }
    return 'Unknown State:' + state;
};

export const asCount = data => {
    const count = data.count;
    const isStable = data.weightState === 1;
    if (count === null) {
        return '~❗';
    }
    if (isStable) {
        return count;
    }
    return '~' + count;
};

const thSensorStateTable = {
    4: '过高',
    5: '过低',
    1: '正常',
};

export const thSensorStateText = state => {
    if (state in thSensorStateTable) {
        return thSensorStateTable[state];
    }
    return '未知' + state;
};

export const thSensorStateWarn = state => {
    return state !== 1;
};
