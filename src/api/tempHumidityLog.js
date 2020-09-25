import {request} from './request';

export const fetchSensorDataLog = sensorId => {
    return request({
        url: '/api/temp-humidity-log/_sensor-logs',
        method: 'get',
        params: {
            sensorId: sensorId,
        }
    });
};
