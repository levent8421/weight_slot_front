import {request} from './request';

export const fetchSlotData = () => {
    return request({
        url: '/api/dashboard/slot-data',
        method: 'get',
        hideLoading: true,
    });
};
