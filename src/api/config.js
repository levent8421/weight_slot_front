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
