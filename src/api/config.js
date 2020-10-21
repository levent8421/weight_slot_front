import {request} from './request';


export const fetchEnableTabBar = () => {
    return request({
        url: '/api/config/application.ui.enable_tabBar',
        method: 'get',
    });
};

export const setEnableTabBar = enable => {
    return request({
        url: '/api/config/application.ui.enable_tabBar',
        method: 'post',
        data: {
            value: enable,
        },
    });
};

export const fetchSoftFilterLevel = () => {
    return request({
        url: '/api/config/weight.soft_filter_level',
        method: 'get',
    });
};

export const updateSoftFilterLevel = value => {
    return request({
        url: '/api/config/weight.soft_filter_level',
        method: 'post',
        data: {
            value: value,
        }
    });
};
