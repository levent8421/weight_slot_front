import React, {Component} from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import SensorSetting from './setting/SensorSetting'
import SettingMenu from './setting/SettingMenu'
import SlotSetting from './setting/SlotSetting'
import ConnectionSetting from './setting/ConnectionSetting'
import SlotDetailSetting from './setting/SlotDetailSetting'
import SystemSetting from './setting/SystemSetting'
import {connect} from 'react-redux';

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
    };
};

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/setting/" component={SettingMenu} exact/>
                    <Route path="/setting/sensor" component={SensorSetting} exact/>
                    <Route path="/setting/slot" component={SlotSetting} exact/>
                    <Route path="/setting/connection" component={ConnectionSetting} exact/>
                    <Route path="/setting/slot-detail/:id" component={SlotDetailSetting} exact/>
                    <Route path="/setting/system" component={SystemSetting} exact/>
                </Switch>
            </Router>
        )
    }
}

export default connect(null, mapAction2Props)(Setting);
