import {request} from './request';

export const fetchSlotData = () => {
    return request({
        url: '/api/dashboard/slot-data',
        method: 'get',
        hideLoading: true,
    });
};

export const fetchSystemInfo = () => {
    return request({
        url: '/api/dashboard/system-infos',
        method: 'get',
    });
};

export const fetchSystemProps = () => {
    return request({
        url: '/api/dashboard/system-props',
        method: 'get',
    });
};
