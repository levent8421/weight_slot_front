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

export const fetchDashboardData = () => {
    return request({
        url: '/api/dashboard/_data',
        method: 'get',
        hideLoading: true,
    });
};

export const fetchDashboardDataByPrefix = prefix => {
    return request({
        url: '/api/dashboard/_data-for-prefix',
        method: 'get',
        hideLoading: true,
        params: {
            prefix
        }
    });
};
