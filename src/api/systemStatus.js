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


export const resetDatabase = () => {
    return request({
        url: '/api/status/_db-reset',
        method: 'post',
    });
};

export const sensorParams = address => {
    return request({
        url: `/api/status/${address}/_details`,
        method: 'get'
    });
};
