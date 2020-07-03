import React, {Component} from 'react';
import {Button, Icon, List, Switch, Toast} from 'antd-mobile';
import {setEnableTabBarAction, setTitle} from '../../../store/actionCreators';
import {connect} from 'react-redux';
import {fetchSystemInfo} from '../../../api/dashboard';
import {withRouter} from 'react-router-dom';

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
        setEnableTabBar: (...args) => dispatch(setEnableTabBarAction(...args)),
    };
};
const mapState2Props = (state, props) => {
    return {
        ...props,
        enableTabBar: state.enableTabBar,
    };
};

class SystemSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            systemInfo: {},
            killButtonState: true
        };
    }

    componentDidMount() {
        this.props.setTitle('System Infos');
        fetchSystemInfo().then(res => {
            this.setState({
                systemInfo: res,
            })
        });
    }

    render() {
        const {Item} = List;
        const {systemInfo} = this.state;
        const {enableTabBar} = this.props;
        return (
            <div className="systemSettings">
                <List renderHeader={() => 'System Infos'}>
                    <Item key="appName" extra={systemInfo.appName}>APPName</Item>
                    <Item key="appVersion" extra={systemInfo.appVersion}>APPVersion</Item>
                    <Item key="dbVersion" extra={systemInfo.dbVersion}>DBVersion</Item>
                    <Item key="pid" extra={systemInfo.pid}>ProcessID</Item>
                    <Item key="libPath">LibPath: {systemInfo.libPath}</Item>
                    <Item key="kill">
                        <Button type="warning" onClick={() => this.killProcess()}
                                disabled={!this.state.killButtonState}>Kill Process</Button>
                    </Item>
                </List>
                <List renderHeader={() => 'Settings'}>
                    <Item
                        key="tabBar"
                        extra={<Switch
                            checked={enableTabBar}
                            onChange={target => this.setEnableTabBar(target)}
                            platform="android"/>}>
                        EnableTabBar
                    </Item>
                    <Item key="systemProps" extra={<Icon type="right"/>}
                          onClick={() => this.props.history.push({pathname: '/setting/system-props'})}>
                        System Props
                    </Item>
                </List>
            </div>
        );
    }

    killProcess() {
        Toast.show('Do not kill this process!', 1, false);
        this.setState({
            killButtonState: false
        });
    }

    setEnableTabBar(target) {
        this.props.setEnableTabBar(target);
    }
}

export default withRouter(connect(mapState2Props, mapAction2Props)(SystemSetting));
