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

export const fetchDisplayAutoUnit = () => {
    return request({
        url: '/api/config/application.display.auto_unit',
        method: 'get',
    });
};

export const setDisplayAutoUnit = autoUnit => {
    return request({
        url: '/api/config/application.display.auto_unit',
        method: 'post',
        data: {
            value: autoUnit ? 'true' : 'false',
            createIfNotExists: true,
        },
    });
};
export const fetchExtraPageUri = () => {
    return request({
        url: '/api/config/extra.page_uri',
        method: 'get',
    });
};
export const setExtraPageUri = uri => {
    return request({
        url: '/api/config/extra.page_uri',
        method: 'post',
        data: {
            value: uri,
            createIfNotExists: true,
        }
    });
};

export const setProtocolVersion = version => {
    return request({
        url: '/api/config/weight.protocol_version',
        method: 'post',
        data: {
            value: version,
            createIfNotExists: true,
        }
    });
};
