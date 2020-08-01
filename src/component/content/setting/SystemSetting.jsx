import React, {Component} from 'react';
import {Button, Icon, List, Modal, Switch, TextareaItem, Toast} from 'antd-mobile';
import {setEnableTabBarAction, setTitle} from '../../../store/actionCreators';
import {connect} from 'react-redux';
import {fetchSystemInfo} from '../../../api/dashboard';
import {reloadLibPath} from '../../../api/serial';
import {stopWeightService} from '../../../api/sensor';
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
            killButtonState: true,
            libLoadVisible: false,
            reloadLibPath: '',
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
        const {systemInfo, libLoadVisible, reloadLibPath} = this.state;
        const {enableTabBar} = this.props;
        return (
            <div className="systemSettings">
                <List renderHeader={() => 'System Infos'}>
                    <Item key="appName" extra={systemInfo.appName}>APPName</Item>
                    <Item key="appVersion" extra={systemInfo.appVersion}>APPVersion</Item>
                    <Item key="dbVersion" extra={systemInfo.dbVersion}>DBVersion</Item>
                    <Item key="dbVersionName" extra={systemInfo.dbVersionName}>DBVersionName</Item>
                    <Item key="pid" extra={systemInfo.pid}>ProcessID</Item>
                    <Item key="libPath" extra={<Icon type="right"/>}
                          onClick={() => this.showLibLoadModal()}> LibPath: {systemInfo.libPath}</Item>
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
                    <Item key="stopService">
                        <Button type="warning" onClick={() => this.stopWeightService()}>Stop Weight Service</Button>
                    </Item>
                </List>
                <Modal
                    visible={libLoadVisible}
                    title="Reload SerialPort Library"
                    transparent
                    maskClosable={true}
                    footer={[
                        {
                            text: 'Cancel',
                            onPress: () => this.setState({libLoadVisible: false})
                        },
                        {
                            text: 'Reload',
                            onPress: () => this.reloadLibrary()
                        },
                    ]}>
                    <TextareaItem
                        placeholder="Type the SerialPort library Path!"
                        autoHeight
                        value={reloadLibPath} onChange={e => this.setState({reloadLibPath: e})}/>
                </Modal>
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

    showLibLoadModal() {
        const reloadLibPath = this.state.systemInfo.libPath;
        this.setState({
            reloadLibPath,
            libLoadVisible: true
        });
    }

    reloadLibrary() {
        reloadLibPath(this.state.reloadLibPath).then(res => {
            Toast.show(`Success: [${res}]`);
            this.setState({
                libLoadVisible: false,
            })
        })
    }

    stopWeightService() {
        stopWeightService().then(() => {
            Toast.show("Stop Weight Service Success!");
        });
    }
}

export default withRouter(connect(mapState2Props, mapAction2Props)(SystemSetting));
