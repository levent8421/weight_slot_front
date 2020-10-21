import {request} from './request';

export const fetchSensors = () => {
    return request({
        url: '/api/sensor/_with-slot',
        method: 'get',
    });
};

export const toggleElable = (sensorId, hasElabel) => {
    return request({
        url: `/api/sensor/${sensorId}/haselabel`,
        method: 'post',
        data: {
            hasElabel: hasElabel
        }
    });
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


export const findSensorById = id => {
    return request({
        url: `/api/sensor/${id}`,
        method: 'get',
    });
};
export const tryRecoverySensorAddress = id => {
    return request({
        url: `/api/sensor/${id}/_recovery-sensor-address`,
        method: 'post',
    });
};
export const tryRecoveryElabelAddress = id => {
    return request({
        url: `/api/sensor/${id}/_recovery-elabel-address`,
        method: 'post',
    });
};
