import {request} from './request';

export const reloadLibPath = path => {
    return request({
        url: '/api/serial/load-lib',
        method: 'post',
        data: {
            libPath: path
        }
    })
};
