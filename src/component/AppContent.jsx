import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Dashboard from './content/Dashboard'
import Setting from './content/Setting';
import Address from './content/Address';
import Logs from './content/Logs';
import './AppContent.sass';

class AppContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="appContent">
                <div className="headerMask"/>
                <Switch>
                    <Route path="/" component={Dashboard} exact/>
                    <Route path="/setting**" component={Setting} exact/>
                    <Route path="/address" component={Address} exact/>
                    <Route path="/logs" component={Logs} exact/>
                </Switch>
                <div className="tabBarMask"/>
            </div>
        );
    }
}

export default AppContent;
