import React, {Component} from 'react';
import {disconnectTcp, fetchDatabaseTables, fetchStatusTable, resetDatabase} from '../../../api/systemStatus';
import {Button, Flex, List, Modal, Toast} from 'antd-mobile';
import {connect} from 'react-redux';
import {setTitle} from '../../../store/actionCreators';
import {withRouter} from 'react-router-dom';

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

class SystemCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusTable: {
                tcpApi: {},
            },
            databaseTables: []
        };
    }

    componentDidMount() {
        this.props.setTitle('系统检查');
        this.refreshStatusTable();
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

    render() {
        const {statusTable, databaseTables} = this.state;
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
                </List>
                <List renderHeader={() => '数据库信息'}>
                    {databaseTables.map(tableName => (<List.Item key={tableName}>{tableName}</List.Item>))}
                    <List.Item>
                        <Flex>
                            <Flex.Item>
                                <Button type="warning" onClick={() => this.showDbResetConfirm()}>重置数据库</Button>
                            </Flex.Item>
                            <Flex.Item>
                                <Button type="primary" onClick={() => this.refreshDatabaseTables()}>
                                    数据表
                                </Button>
                            </Flex.Item>
                        </Flex>
                    </List.Item>
                </List>
            </div>
        );
    }

    reconnectTcp() {
        Modal.alert('圈定重连', '确定段考连接并重新建立连接？?', [{text: '取消'}, {
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
