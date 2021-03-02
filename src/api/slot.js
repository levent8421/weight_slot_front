import {request} from './request';

export const doZeroAll = () => {
    return request({
        url: '/api/slot/zero-all',
        method: 'post',
    });
};

export const zeroOne = slotNo => {
    const encodedSlotNo = encodeURIComponent(slotNo);
    const apiUrl = `/api/slot/${encodedSlotNo}/zero`;
    return request({
        url: apiUrl,
        method: 'post',
    });
};


export const fetchAllSlots = () => {
    return request({
        url: '/api/slot/_with-sensors',
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

export const mergeSlotsByIds = ids => {
    return request({
        url: '/api/slot/_merge',
        method: 'post',
        data: {
            slotIds: ids,
        }
    });
};

export const resetSlotBySlots = ids => {
    return request({
        url: '/api/slot/_reset-slot-sensors',
        method: 'post',
        data: {
            slotIds: ids,
        },
    });
};

export const toggleEnableState = slotId => {
    return request({
        url: `/api/slot/${slotId}/_toggle-enable`,
        method: 'post',
    });
};

export const tare = id => {
    return request({
        url: `/api/slot/${id}/_tare`,
        method: 'post',
    });
};

export const tareWithValue = slot => {
    return request({
        url: `/api/slot/${slot.id}/_tare-with-value`,
        method: 'post',
        data: slot,
    });
};

export const lockSlot = options => {
    const {id} = options;
    return request({
        url: `/api/slot/${id}/_lock`,
        method: 'post',
        data: options,
    });
}
