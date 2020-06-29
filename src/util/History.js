import {createBrowserHistory} from 'history';
import {setRouterPath} from '../store/actionCreators'
import store from '../store';

const history = createBrowserHistory();

const notifyPathChanged = location => {
    const info = {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash
    };
    const action = setRouterPath(info);
    store.dispatch(action);
};
history.listen((action) => {
    notifyPathChanged(action.location);
});


notifyPathChanged(history.location);
export default history;
