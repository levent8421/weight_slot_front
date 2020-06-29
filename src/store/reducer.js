import {
    ASYNC_FETCH_CONNECTION,
    ASYNC_FETCH_DASHBOARD_SLOT_DATA,
    ASYNC_FETCH_SENSORS,
    DELETE_CONNECTION,
    SET_ROUTER_PATH,
    SET_TABBAR_STATE,
    SET_TITLE,
    TOGGLE_SENSOR_ELABLE,
} from './actionTypes';

const defaultState = {
    showTabBar: true,
    globalTitle: '重力货道',
    routerPath: null,
    dashboardSlots: [],
    sensors: [],
    connections: [],
    user: {
        name: 'MonolithIoT'
    }
};
const actionTable = {};
const registerReducer = (type, reducer) => {
    actionTable[type] = reducer;
};
registerReducer(SET_TABBAR_STATE, (state, action) => {
    return {
        ...state,
        showTabBar: action.data
    };
});
registerReducer(SET_ROUTER_PATH, (state, action) => {
    return {
        ...state,
        routerPath: action.data,
    };
});

registerReducer(ASYNC_FETCH_DASHBOARD_SLOT_DATA, (state, action) => {
    return {
        ...state,
        dashboardSlots: action.data,
    };
});

registerReducer(SET_TITLE, (state, action) => {
    return {
        ...state,
        globalTitle: action.data,
    }
});
registerReducer(ASYNC_FETCH_SENSORS, (state, action) => {
    return {
        ...state,
        sensors: action.data,
    };
});

registerReducer(TOGGLE_SENSOR_ELABLE, (state, action) => {
    const sensors = state.sensors;
    const sensorId = action.data.sensorId;
    const hasElable = action.data.hasElabel;
    for (let sensor of sensors) {
        if (sensor.id === sensorId) {
            sensor.hasElable = hasElable;
            break;
        }
    }
    return {
        ...state,
        sensors: JSON.parse(JSON.stringify(sensors))
    };
});

registerReducer(ASYNC_FETCH_CONNECTION, (state, action) => {
    return {
        ...state,
        connections: action.data,
    };
});
registerReducer(DELETE_CONNECTION, (state, action) => {
    const id = action.data.id;
    const connections = state.connections.filter(connection => connection.id !== id);
    return {
        ...state,
        connections
    };
});
export default (state = defaultState, action) => {
    const type = action.type;
    if (type in actionTable) {
        const handler = actionTable[type];
        return handler(state, action);
    }
    return state;
}
