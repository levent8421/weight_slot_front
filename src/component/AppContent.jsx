import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Dashboard from './content/Dashboard'
import HomeDashboard from './content/HomeDashboard'
import Setting from './content/Setting';
import Address from './content/Address';
import Logs from './content/Logs';
import About from './content/About';
import PidAnimation from './content/PidAnimation';
import DStarAnimation from './content/DStarAnimation';
import SlideAnimation from './content/SlideAnimation';
import ExtraPage from './content/ExtraPage';
import AsbogDashboard from './content/AsbogDashboard';
import './AppContent.sass';
import {connect} from 'react-redux';

const mapState2Props = (state, props) => {
    return {
        ...props,
        showHeader: state.showHeader,
    };
};

class AppContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="appContent">
                {
                    this.props.showHeader ? <div className="headerMask"/> : null
                }
                <Switch>
                    <Route path="/dashboard" component={Dashboard} exact/>
                    <Route path="/" component={HomeDashboard} exact/>
                    <Route path="/setting**" component={Setting} exact/>
                    <Route path="/address" component={Address} exact/>
                    <Route path="/logs" component={Logs} exact/>
                    <Route path="/about" component={About} exact/>
                    <Route path="/pid" component={PidAnimation} exact/>
                    <Route path="/extra" component={ExtraPage} exact/>
                    <Route path="/dstar" component={DStarAnimation} exact/>
                    <Route path="/slide" component={SlideAnimation} exact/>
                    <Route path="/asbog" component={AsbogDashboard} exact/>
                </Switch>
                <div className="tabBarMask"/>
            </div>
        );
    }
}

export default connect(mapState2Props, null)(AppContent);
