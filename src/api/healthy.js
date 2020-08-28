import {request} from './request';

export const sensorHealthy = () => {
    return request({
        url: '/api/sensor-healthy/_healthy',
        method: 'get',
    });
};


export const cleanCounter = () => {
    return request({
        url: '/api/sensor-healthy/_clean-counter',
        method: 'post',
    });
};
