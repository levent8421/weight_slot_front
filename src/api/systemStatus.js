import {request} from './request';

export const fetchStatusTable = () => {
    return request({
        url: '/api/status/',
        method: 'get',
    })
};

export const disconnectTcp = () => {
    return request({
        url: '/api/status/tcp-disconnect',
        method: 'post',
    });
};

export const fetchDatabaseTables = () => {
    return request({
        url: '/api/status/tables',
        method: 'get',
    });
};

export const fetchMessageLog = () => {
    return request({
        url: '/api/status/message-log',
        method: 'get',
    });
};
