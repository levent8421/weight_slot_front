import React, {Component} from 'react';
import {disconnectTcp, fetchDatabaseTables, fetchStatusTable} from '../../../api/systemStatus';
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
        this.props.setTitle('System Check');
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
                <List renderHeader={() => 'TCP API'}>
                    <List.Item extra={renderConnectionStatus(tcpApi.connection)}>
                        TCP API Status
                    </List.Item>
                    <List.Item extra={tcpApi.ip}>
                        IP
                    </List.Item>
                    <List.Item extra={tcpApi.port}>
                        PORT
                    </List.Item>
                    <List.Item arrow="horizontal"
                               onClick={() => this.props.history.push({pathname: '/setting/message-log'})}>
                        Message Log
                    </List.Item>
                    <List.Item arrow="horizontal"
                               onClick={() => this.props.history.push({pathname: '/setting/sensor-healthy'})}>
                        Sensor Healthy
                    </List.Item>
                    <List.Item>
                        <Flex justify="between">
                            <Flex.Item>
                                <Button type="warning" onClick={() => this.reconnectTcp()}>Reconnect</Button>
                            </Flex.Item>
                            <Flex.Item>
                                <Button type="primary" onClick={() => this.refreshStatusTable()}>Refresh</Button>
                            </Flex.Item>
                        </Flex>
                    </List.Item>
                </List>
                <List renderHeader={() => 'Database Tables'}>
                    {databaseTables.map(tableName => (<List.Item key={tableName}>{tableName}</List.Item>))}
                    <List.Item>
                        <Button type="primary" onClick={() => this.refreshDatabaseTables()}>Fetch Table List</Button>
                    </List.Item>
                </List>
            </div>
        );
    }

    reconnectTcp() {
        Modal.alert('Confirm', 'Disconnect TCP connection and reconnect?', [{text: 'Cancel'}, {
            text: 'Yes', onPress() {
                disconnectTcp().then(() => {
                    Toast.show('Disconnect success! reconnect after 3 seconds!', 3, false);
                });
            }
        }])
    }
}

const component = connect(null, mapAction2Props)(SystemCheck);
export default withRouter(component);
