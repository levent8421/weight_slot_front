import React from 'react'
import './App.css'
import store from './store'
import {Provider} from 'react-redux'
import AppTabBar from './component/AppTabBar'
import AppContent from './component/AppContent'
import AppHeader from './component/AppHeader'
import {HashRouter as Router} from 'react-router-dom'
import history from './util/History'
import {fetchEnableTabBarAction} from './store/actionCreators';
import consoleBanner from './util/consoleBanner';

class App extends React.Component {
    componentDidMount() {
        store.dispatch(fetchEnableTabBarAction());
        consoleBanner();
    }

    render() {
        return (
            <Router history={history}>
                <Provider store={store}>
                    <div className="app-content">
                        <AppHeader/>
                        <AppContent/>
                        <AppTabBar/>
                    </div>
                </Provider>
            </Router>)
    }
}

export default App;
