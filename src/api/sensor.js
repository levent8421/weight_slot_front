import {request} from './request';

export const fetchSensors = () => {
    return request({
        url: '/api/sensor/_with-slot',
        method: 'get',
    });
};

export const toggleElable = (sensorId, hasElabel) => {
    return new Promise((resolve, reject) => {
        resolve();
    })
};


export const reloadSensors = () => {
    return request({
        url: '/api/sensor/reload',
        method: 'post',
    });
};


export const setSlotByIds = (sensorIds, slotId) => {
    return request({
        url: '/api/sensor/_set-slot-id-by-ids',
        method: 'post',
        data: {
            sensorIds,
            slotId,
        }
    });
};


export const stopWeightService = () => {
    return request({
        url: '/api/sensor/_stop-weight-service',
        method: 'post',
    });
};

export const dumpAll = () => {
    return request({
        url: '/api/sensor/_dump-all',
        method: 'get',
    });
};
