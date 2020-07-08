import {
    ASYNC_FETCH_CONNECTION,
    ASYNC_FETCH_DASHBOARD_SLOT_DATA,
    ASYNC_FETCH_SENSORS,
    DELETE_CONNECTION,
    SET_ENABLE_HEADER,
    SET_ENABLE_TAB_BAR,
    SET_ROUTER_PATH,
    SET_TABBAR_STATE,
    SET_TITLE,
    SET_USER,
    TOGGLE_SENSOR_ELABLE,
} from './actionTypes';
import {fetchSlotData} from '../api/dashboard';
import {fetchSensors, toggleElable} from '../api/sensor';
import {deleteConnection, fetchConnections} from '../api/connection';
import {fetchEnableTabBar, setEnableTabBar} from '../api/config';

export const setUser = user => {
    return {
        type: SET_USER,
        data: user
    }
};
export const setTabBarState = show => {
    return {
        type: SET_TABBAR_STATE,
        data: show
    };
};

export const setRouterPath = info => {
    return {
        type: SET_ROUTER_PATH,
        data: info
    };
};
export const setTitle = title => {
    return {
        type: SET_TITLE,
        data: title,
    }
};
export const asyncFetchDashboardSlotData = () => {
    return dispatch => {
        fetchSlotData().then(res => {
            const slots = [];
            for (const key in res) {
                if (res.hasOwnProperty(key)) {
                    slots.push(res[key]);
                }
            }
            const action = {
                type: ASYNC_FETCH_DASHBOARD_SLOT_DATA,
                data: slots.sort((a, b) => a.slotNo.localeCompare(b.slotNo)),
            };
            dispatch(action);
        });
    }
};

export const asyncFetchSensors = () => {
    return dispatch => {
        fetchSensors().then(res => {
            const action = {
                type: ASYNC_FETCH_SENSORS,
                data: res
            };
            dispatch(action);
        });
    };
};


export const toggleSensorElable = (sensorId, hasElabel) => {
    return dispatch => {
        toggleElable().then(() => {
            const action = {
                type: TOGGLE_SENSOR_ELABLE,
                data: {
                    sensorId,
                    hasElabel
                }
            };
            dispatch(action);
        })
    };
};


export const asyncFetchConnection = () => {
    return dispatch => {
        fetchConnections().then(res => {
            const action = {
                type: ASYNC_FETCH_CONNECTION,
                data: res
            };
            dispatch(action);
        });
    };
};

export const asyncDeleteConnection = id => {
    return dispatch => {
        deleteConnection(id).then(() => {
            const action = {
                type: DELETE_CONNECTION,
                data: {
                    id: id
                }
            };
            dispatch(action);
        })
    }
};

export const fetchEnableTabBarAction = () => {
    return dispatch => {
        fetchEnableTabBar().then(res => {
            const action = {
                type: SET_ENABLE_TAB_BAR,
                data: res.value === 'true',
            };
            dispatch(action);
        });
    };
};

export const setEnableTabBarAction = enable => {
    return dispatch => {
        setEnableTabBar(enable).then(() => {
            const action = {
                type: SET_ENABLE_TAB_BAR,
                data: enable,
            };
            dispatch(action);
        });
    };
};

export const showHeader = show => {
    return {
        type: SET_ENABLE_HEADER,
        data: show,
    };
};
