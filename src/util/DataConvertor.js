export const asKg = g => {
    return (g / 1000.0).toFixed(3);
};

export const isWarn = (slot) => {
    return (slot.data && slot.data.toleranceState) !== 1;
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
