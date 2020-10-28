import React, {Component} from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import SensorSetting from './setting/SensorSetting'
import SettingMenu from './setting/SettingMenu'
import SlotSetting from './setting/SlotSetting'
import ConnectionSetting from './setting/ConnectionSetting'
import SlotDetailSetting from './setting/SlotDetailSetting'
import SystemSetting from './setting/SystemSetting'
import SystemPropsSetting from './setting/SystemPropsSetting'
import SlotSensorsSetting from './setting/SlotSensorsSetting'
import Overview from './setting/Overview'
import SystemCheck from './setting/SystemCheck'
import MessageLog from './setting/MessageLog'
import SensorHealthy from './setting/SensorHealthy'
import SensorDetails from './setting/SensorDetails'
import ThSensorSetting from './setting/ThSensorSetting'
import ThSensorDetailsSetting from './setting/ThSensorDetailsSetting'
// import ExtraPageSetting from './setting/ExtraPageSetting'
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
                    <Route path="/setting/system-props" component={SystemPropsSetting} exact/>
                    <Route path="/setting/slot-sensors/:id" component={SlotSensorsSetting} exact/>
                    <Route path="/setting/overview" component={Overview} exact/>
                    <Route path="/setting/system-check" component={SystemCheck} exact/>
                    <Route path="/setting/message-log" component={MessageLog} exact/>
                    <Route path="/setting/sensor-healthy" component={SensorHealthy} exact/>
                    <Route path="/setting/th-sensor" component={ThSensorSetting} exact/>
                    <Route path="/setting/:address/sensor-details" component={SensorDetails} exact/>
                    <Route path="/setting/:id/th-detail" component={ThSensorDetailsSetting} exact/>
                    {/*<Route path="/setting/extra-setting" component={ExtraPageSetting} exact/>*/}
                </Switch>
            </Router>
        )
    }
}

export default connect(null, mapAction2Props)(Setting);
