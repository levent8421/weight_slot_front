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
    1: 'Serial',
    2: 'Network',
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
        const noItems = slotNo.match(/^(\w+)-(\d+)-(\w+)$/);
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
        res.push({
            name,
            slots: groups[name],
        });
    }
    return res;
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
    const isStable = data.weightState == 1;
    if (count === null) {
        return '~❗';
    }
    if (isStable) {
        return count;
    }
    return '~' + count;
};
