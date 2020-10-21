import {request} from './request';

export const sensorFirmwareUpgrade = sensorId => {
    return request({
        url: `/api/firmware/${sensorId}/_upgrade`,
        method: 'post',
        hideLoading: true,
    });
};

export const eLabelFirmwareUpgrade = sensorId => {
    return request({
        url: `/api/firmware/${sensorId}/_elabel-upgrade`,
        method: 'post',
        hideLoading: true,
    });
};

export const fetchUpgradeProgress = () => {
    return request({
        url: '/api/firmware/_upgrade-progress',
        method: 'get',
        hideLoading: true,
    });
};

export const abortFirmwareUpgrade = () => {
    return request({
        url: '/api/firmware/_abort-upgrade',
        method: 'post',
    });
};
