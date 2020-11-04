import {request} from './request';

export const fetchThSensors = () => {
    return request({
        url: '/api/th-sensor/',
        method: 'get',
    });
};

export const fetchOneSensor = id => {
    return request({
        url: `/api/th-sensor/${id}`,
        method: 'get',
    });
};

export const setRange = data => {
    return request({
        url: `/api/th-sensor/${data.id}/_range`,
        method: 'post',
        data
    });
};

export const calibrateTemp = (id, temp) => {
    return request({
        url: `/api/th-sensor/${id}/_calibrate-temperature`,
        method: 'post',
        data: {
            currentTemperature: temp,
        },
    });
};
