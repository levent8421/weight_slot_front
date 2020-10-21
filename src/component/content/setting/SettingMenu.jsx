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
        this.props.setTitle('设置');
    }

    componentDidMount() {
        this.props.setTabBarState(true);
    }

    render() {
        return (
            <div className="setting">
                <List renderHeader={() => '设置'}>
                    <List.Item onClick={() => this.go('/setting/sensor')} arrow="horizontal">
                        重力传感器
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/th-sensor')} arrow="horizontal">
                        温湿度传感器
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/slot')} arrow="horizontal">
                        货道管理
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/connection')} arrow="horizontal">
                        连接管理
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/system')} arrow="horizontal">
                        系统信息
                    </List.Item>
                    <List.Item arrow="horizontal" onClick={() => this.go('/setting/system-check')}>
                        系统检查
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/overview')} arrow="horizontal">
                        货道概览信息
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
