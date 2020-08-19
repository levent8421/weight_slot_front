import {request} from './request';

export const doZeroAll = () => {
    return request({
        url: '/api/slot/zero-all',
        method: 'post',
    });
};

export const zeroOne = slotNo => {
    return request({
        url: `/api/slot/${slotNo}/zero`,
        method: 'post',
    });
};


export const fetchAllSlots = () => {
    return request({
        url: '/api/slot/',
        method: 'get',
    });
};

export const fetchDetail = id => {
    return request({
        url: `/api/slot/${id}`,
        method: 'get',
    });
};


export const updateSlot = slot => {
    return request({
        url: `/api/slot/${slot.id}`,
        method: 'post',
        data: slot
    });
};


export const toggleELabelState = option => {
    return request({
        url: `/api/slot/${option.id}/has-e-label`,
        method: 'post',
        data: {hasElabel: option.hasELabel},
    });
};

export const highlightBySku = sku => {
    return request({
        url: '/api/slot/highlight',
        method: 'post',
        data: {
            skuNo: sku
        }
    });
};


export const fetchAllWithSensors = () => {
    return request({
        url: '/api/slot/_with-sensors',
        method: 'get',
    });
};

export const setCompensationState = state => {
    return request({
        url: '/api/slot/_all-compensation',
        method: 'post',
        data: {
            enableCompensation: state,
        }
    });
};
