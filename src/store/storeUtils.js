import {connect} from 'react-redux';
import {setTabBarState, setTitle, showHeader} from './actionCreators';

const mapState = (state, props) => {
    return {
        ...state,
        ...props,
    };
};
const mapAction = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
        setTabBarState: (...args) => dispatch(setTabBarState(...args)),
        showHeader: (...args) => dispatch(showHeader(...args)),
    };
};
export const mapStateAndAction = (component) => {
    return connect(mapState, mapAction)(component);
};
