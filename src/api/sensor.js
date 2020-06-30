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
