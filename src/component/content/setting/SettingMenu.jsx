import React, {Component} from 'react';
import {List} from "antd-mobile";
import {withRouter} from 'react-router-dom';
import {setTabBarState, setTitle} from "../../../store/actionCreators";
import {connect} from 'react-redux';

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
        setTabBarState: (...args) => dispatch(setTabBarState(...args)),
    };
};

class SettingMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.props.setTitle('Setting');
    }

    componentDidMount() {
        this.props.setTabBarState(true);
    }

    render() {
        return (
            <div className="setting">
                <List renderHeader={() => 'Settings:'}>
                    <List.Item onClick={() => this.go('/setting/sensor')} arrow="horizontal">
                        WeightSensors
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/th-sensor')} arrow="horizontal">
                        TempHumiditySensors
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/slot')} arrow="horizontal">
                        Slots
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/connection')} arrow="horizontal">
                        Connections
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/system')} arrow="horizontal">
                        System Info
                    </List.Item>
                    <List.Item arrow="horizontal" onClick={() => this.go('/setting/system-check')}>
                        System Check
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/overview')} arrow="horizontal">
                        Overview
                    </List.Item>
                </List>
            </div>
        );
    }

    go(path) {
        this.props.history.push({
            pathname: path
        });
    }
}

export default withRouter(connect(null, mapAction2Props)(SettingMenu));
