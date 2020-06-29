import React from 'react'
import './App.css'
import store from './store'
import {Provider} from 'react-redux'
import AppTabBar from './component/AppTabBar'
import AppContent from './component/AppContent'
import AppHeader from './component/AppHeader'
import {BrowserRouter as Router} from 'react-router-dom'
import history from './util/History'

class App extends React.Component {
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
