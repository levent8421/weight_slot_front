const dataTemplate = [
    {
        id: 1,
        deviceSn: '123456789',
        address: 10,
        hasElable: true,
        slotId: 1,
        slot: {
            id: 1,
            slotNo: 'A-1-1'
        }
    },
    {
        id: 2,
        deviceSn: '123456789',
        address: 10,
        hasElable: true,
        slotId: 1,
        slot: {
            id: 1,
            slotNo: 'A-1-1'
        }
    },
    {
        id: 3,
        deviceSn: '123456789',
        address: 10,
        hasElable: false,
        slotId: 1,
        slot: {
            id: 1,
            slotNo: 'A-1-1'
        }
    }
];

export const fetchSensors = () => {
    return new Promise((resolve, reject) => {
        resolve(dataTemplate);
    });
};

export const toggleElable = (sensorId, hasElabel) => {
    return new Promise((resolve, reject) => {
        resolve();
    })
};
