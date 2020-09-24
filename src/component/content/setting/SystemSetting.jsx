import React, {Component} from 'react';
import {Button, List, Modal, Switch, TextareaItem, Toast} from 'antd-mobile';
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
            libLoadVisible: false,
            reloadLibPath: '',
        };
    }

    componentDidMount() {
        this.props.setTitle('系统信息');
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
                <List renderHeader={() => '系统信息'}>
                    <Item key="appName" extra={systemInfo.appName}>应用名称</Item>
                    <Item key="appVersion" extra={systemInfo.appVersion}>应用版本</Item>
                    <Item key="dbVersion" extra={systemInfo.dbVersion}>数据库版本</Item>
                    <Item key="dbVersionName" extra={systemInfo.dbVersionName}>数据库版本名</Item>
                    <Item key="pid" extra={systemInfo.pid}>进程ID</Item>
                    <Item key="libPath" arrow="horizontal"
                          onClick={() => this.showLibLoadModal()}> 驱动路径: {systemInfo.libPath}</Item>
                </List>
                <List renderHeader={() => '系统设置'}>
                    <Item
                        key="tabBar"
                        extra={<Switch
                            checked={enableTabBar}
                            onChange={target => this.setEnableTabBar(target)}
                            platform="android"/>}>
                        底部标签栏
                    </Item>
                    <Item key="systemProps" arrow="horizontal"
                          onClick={() => this.props.history.push({pathname: '/setting/system-props'})}>
                        JVM信息
                    </Item>
                    <Item key="stopService">
                        <Button type="warning" onClick={() => this.stopWeightService()}>停止重力服务</Button>
                    </Item>
                </List>
                <Modal
                    visible={libLoadVisible}
                    title="重新加载驱动"
                    transparent
                    maskClosable={true}
                    footer={[
                        {
                            text: '取消',
                            onPress: () => this.showLibLoadModal(false),
                        },
                        {
                            text: '加载',
                            onPress: () => this.reloadLibrary()
                        },
                    ]}>
                    <TextareaItem
                        placeholder="驱动路径!"
                        autoHeight
                        value={reloadLibPath} onChange={e => this.setState({reloadLibPath: e})}/>
                </Modal>
            </div>
        );
    }

    setEnableTabBar(target) {
        this.props.setEnableTabBar(target);
    }

    showLibLoadModal(show = true) {
        const reloadLibPath = this.state.systemInfo.libPath;
        this.setState({
            reloadLibPath,
            libLoadVisible: show
        });
    }

    reloadLibrary() {
        reloadLibPath(this.state.reloadLibPath).then(res => {
            Toast.show(`加载成功: [${res}]`);
            this.setState({
                libLoadVisible: false,
            })
        })
    }

    stopWeightService() {
        stopWeightService().then(() => {
            Toast.show("重力服务已停止!");
        });
    }
}

export default withRouter(connect(mapState2Props, mapAction2Props)(SystemSetting));
