import {request} from './request';

export const fetchConnections = () => {
    return request({
        url: '/api/connection/',
        method: 'get',
    });
};

export const deleteConnection = id => {
    return request({
        url: `/api/connection/${id}`,
        method: 'delete',
    });
};

export const createConnection = connection => {
    return request({
        url: '/api/connection/',
        method: 'put',
        data: connection,
    });
};


export const scanPort = () => {
    return request({
        url: '/api/serial/scan',
        method: 'get',
    });
};
