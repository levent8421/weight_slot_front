import React, {Component} from 'react';
import {disconnectTcp, fetchDatabaseTables, fetchStatusTable, resetDatabase} from '../../../api/systemStatus';
import {Button, Flex, InputItem, List, Modal, Picker, Switch, Toast} from 'antd-mobile';
import {connect} from 'react-redux';
import {setTitle} from '../../../store/actionCreators';
import {withRouter} from 'react-router-dom';
import {
    fetchDisplayAutoUnit,
    fetchSoftFilterLevel,
    setDisplayAutoUnit,
    updateSoftFilterLevel
} from '../../../api/config';
import {setCompensationState} from '../../../api/slot';
import {cleanAllBackupSn, reloadSensors} from '../../../api/sensor';

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
    }
};
const renderConnectionStatus = status => {
    if (status) {
        return (<span style={{color: '#1F90E6'}}>Connected</span>)
    } else {
        return (<span style={{color: '#E94F4F'}}>Disconnected</span>)
    }
};

const SoftFilterLevelTable = {
    0: '关闭[0]',
    1: '低[1]',
    2: '中[2]',
    3: '高[3]',
};

const SoftFilterLevels = [
    {
        label: SoftFilterLevelTable[3],
        value: 3,
        key: 3,
    },
    {
        label: SoftFilterLevelTable[2],
        value: 2,
        key: 2,
    },
    {
        label: SoftFilterLevelTable[1],
        value: 1,
        key: 1,
    },
    {
        label: SoftFilterLevelTable[0],
        value: 0,
        key: 0,
    },
];

const doSetCompensationState = state => {
    setCompensationState(state).then(() => {
        Toast.show(`补偿${state ? '开启' : '关闭'}成功！`, 3, false);
    });
};

class SystemCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusTable: {
                tcpApi: {},
            },
            databaseTables: [],
            softFilterLevel: -1,
            softFilterLevelLabel: '',
            displayAutoUnit: 'false',
        };
    }

    componentDidMount() {
        this.props.setTitle('系统检查');
        this.refreshStatusTable();
        this.refreshSoftFilterLevel();
        this.refreshDisplayAutoUnitState();
    }

    refreshSoftFilterLevel() {
        fetchSoftFilterLevel().then(res => {
            const {value} = res;
            const level = parseInt(value);
            this.setState({
                softFilterLevelLabel: SoftFilterLevelTable[level],
                softFilterLevel: level,
            });
        });
    }

    refreshDisplayAutoUnitState() {
        fetchDisplayAutoUnit().then(res => {
            const {value} = res;
            this.setState({displayAutoUnit: value});
        });
    }

    refreshStatusTable() {
        fetchStatusTable().then(res => {
            this.setState({
                statusTable: res,
            })
        });
    }

    refreshDatabaseTables() {
        fetchDatabaseTables().then(res => {
            this.setState({databaseTables: res,})
        });
    }

    showCompensationOperations() {
        Modal.operation([
            {
                text: '关闭补偿', onPress: () => {
                    doSetCompensationState(false);
                }
            },
            {
                text: '开启补偿', onPress: () => {
                    doSetCompensationState(true);
                }
            },
        ]);
    }

    render() {
        const _this = this;
        const {statusTable, databaseTables, softFilterLevel, softFilterLevelLabel, displayAutoUnit} = this.state;
        const {tcpApi} = statusTable;
        return (
            <div className="system-check">
                <List renderHeader={() => 'SCADA_API状态'}>
                    <List.Item extra={renderConnectionStatus(tcpApi.connection)}>
                        连接状态
                    </List.Item>
                    <List.Item extra={tcpApi.ip}>
                        IP地址
                    </List.Item>
                    <List.Item extra={tcpApi.port}>
                        端口
                    </List.Item>
                    <List.Item arrow="horizontal"
                               onClick={() => this.props.history.push({pathname: '/setting/message-log'})}>
                        交互日志
                    </List.Item>
                    <List.Item>
                        <Flex justify="between">
                            <Flex.Item>
                                <Button type="warning" onClick={() => this.reconnectTcp()}>重新连接</Button>
                            </Flex.Item>
                            <Flex.Item>
                                <Button type="primary" onClick={() => this.refreshStatusTable()}>刷新</Button>
                            </Flex.Item>
                        </Flex>
                    </List.Item>
                </List>
                <List renderHeader={() => '传感器信息'}>
                    <List.Item arrow="horizontal"
                               onClick={() => this.props.history.push({pathname: '/setting/sensor-healthy'})}>
                        传感器健康
                    </List.Item>
                    <Picker data={SoftFilterLevels}
                            cols={1}
                            title="软件滤波等级"
                            value={softFilterLevel}
                            onChange={value => {
                                this.setSoftFilterLevel(value)
                            }}>
                        <InputItem value={softFilterLevelLabel}>软滤波等级</InputItem>
                    </Picker>
                    <List.Item extra="Disable/Enable"
                               onClick={() => this.showCompensationOperations()}>
                        补偿管理
                    </List.Item>
                    <List.Item extra="强制刷新货道数据"
                               onClick={() => this.showReloadConfirm()}>
                        重新加载
                    </List.Item>
                    <List.Item extra="清除备份SN并重新收集"
                               onClick={() => this.showCleanBackupSnConfirm()}>
                        重新收集SN
                    </List.Item>
                    <List.Item
                        extra={<Switch
                            checked={displayAutoUnit === 'true'}
                            onChange={value => {
                                setDisplayAutoUnit(value).then(() => _this.refreshDisplayAutoUnitState())
                            }}/>}>
                        自动调整显示单位
                    </List.Item>
                </List>
                <List renderHeader={() => '数据库信息'}>
                    {databaseTables.map(tableName => (<List.Item key={tableName}>{tableName}</List.Item>))}
                    <List.Item>
                        <Flex>
                            <Flex.Item>
                                <Button type="warning" onClick={() => this.showDbResetConfirm()}>重置数据库</Button>
                            </Flex.Item>
                            <Flex.Item>
                                <Button type="primary"
                                        onClick={() => this.refreshDatabaseTables()}>数据表</Button>
                            </Flex.Item>
                        </Flex>
                    </List.Item>
                </List>
            </div>
        );
    }

    showCleanBackupSnConfirm() {
        Modal.alert('重新收集SN', '确认清空备份SN并重新收集？', [
            {text: '取消'},
            {
                text: '确认', onPress: () => {
                    cleanAllBackupSn().then(res => {
                        Toast.show('备份SN清空成功，操作记录数为：' + res, 3, false);
                    });
                }
            },
        ]);
    }

    showReloadConfirm() {
        Modal.alert('重新加载', '确认重新加载货道数据?', [
            {text: '取消'},
            {
                text: '确认', onPress: () => {
                    reloadSensors().then(() => {
                        Toast.show('重新加载成功', 3, false);
                    });
                }
            },
        ]);
    }

    setSoftFilterLevel(value) {
        updateSoftFilterLevel(value[0]).then(() => {
            Toast.show('滤波等级设置成功，重新加载后生效！', 3, false);
            this.refreshSoftFilterLevel();
        });
    }

    reconnectTcp() {
        Modal.alert('确定重连', '确定段考连接并重新建立连接？?', [{text: '取消'}, {
            text: '确定', onPress() {
                disconnectTcp().then(() => {
                    Toast.show('断开成功，系统将在3秒后重新连接!', 3, false);
                });
            }
        }])
    }

    showDbResetConfirm() {
        Modal.alert('清空数据库？',
            '该操作将会清空数据库中全部内容，操作完成后需要对货道重新扫描并重新下发库位信息！（该操作无法恢复）',
            [{text: '取消'}, {text: '确定', onPress: () => this.doDbReset()}])
    }

    doDbReset() {
        resetDatabase().then(() => {
            Modal.alert('Database Reset Success!', 'Reset success, please scan again!');
        });
    }
}

const component = connect(null, mapAction2Props)(SystemCheck);
export default withRouter(component);
