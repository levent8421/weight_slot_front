import React, {Component} from 'react';
import {ActionSheet, Button, List, Modal, Switch, TextareaItem, Toast} from 'antd-mobile';
import {setEnableTabBarAction, setTitle} from '../../../store/actionCreators';
import {connect} from 'react-redux';
import {fetchSystemInfo} from '../../../api/dashboard';
import {reloadLibPath} from '../../../api/serial';
import {stopWeightService} from '../../../api/sensor';
import {withRouter} from 'react-router-dom';
import {setProtocolVersion} from '../../../api/config';

const VERSION_SELECTOR_OPTIONS = ['V21', 'V22', '取消'];
const DATA_TO_SHOW = [
    {
        title: '应用名称',
        key: 'appName',
    },
    {
        title: '应用版本',
        key: 'appVersion',
    },
    {
        title: '数据库版本号',
        key: 'application.db_version',
    },
    {
        title: '数据库版本名称',
        key: 'application.db_version_name',
    },
    {
        title: '站点号',
        key: 'application.station_id',
    },
    {
        title: '显示导航栏',
        key: 'application.ui.enable_tabBar',
    },
    {
        title: '扩展页面地址',
        key: 'extra.page_uri',
    },
    {
        title: '进程ID',
        key: 'pid',
    },
    {
        title: '软滤波等级',
        key: 'weight.soft_filter_level',
    },
];
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
        this.refreshConfig();
    }

    refreshConfig() {
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
                    {
                        DATA_TO_SHOW.map(item => (<List.Item key={item.key} extra={systemInfo[item.key]}>
                            {item.title}
                        </List.Item>))
                    }
                    <Item key="libPath" arrow="horizontal"
                          onClick={() => this.showLibLoadModal()}> 驱动路径: {systemInfo.libPath}</Item>
                    <Item key="weight.protocol_version" arrow="horizontal"
                          extra={systemInfo['weight.protocol_version']}
                          onClick={() => this.showProtocolVersionSelector()}>
                        协议版本
                    </Item>
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

    showProtocolVersionSelector() {
        const _this = this;
        ActionSheet.showActionSheetWithOptions({
            options: VERSION_SELECTOR_OPTIONS,
            cancelButtonIndex: VERSION_SELECTOR_OPTIONS.length - 1,
            title: '协议版本',
            message: '传感器协议版本选择'
        }, value => {
            let version;
            switch (value) {
                case 0:
                    version = 1;
                    break;
                case 1:
                    version = 2;
                    break;
                default:
                    version = 0;
            }
            setProtocolVersion(version).then(() => {
                Toast.show('协议版本设置成功', 3, false);
                _this.refreshConfig();
            });
        });
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
