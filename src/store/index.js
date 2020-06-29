import {applyMiddleware, compose, createStore} from 'redux'
import reducer from './reducer';
import thunk from 'redux-thunk'

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const allEnhancers = reduxDevTools(applyMiddleware(thunk));
const store = createStore(reducer, allEnhancers);

export default store;
