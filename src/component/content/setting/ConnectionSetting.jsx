import React, {Component} from 'react';
import {asyncDeleteConnection, asyncFetchConnection, setTabBarState, setTitle} from '../../../store/actionCreators';
import {ActionSheet, Button, Flex, Icon, InputItem, List, Modal, Picker, Toast} from 'antd-mobile';
import {asConnectionType} from '../../../util/DataConvertor';
import './ConnectionSetting.sass'
import {createConnection, scanDevice, scanPort, startScanTempHumiSensors} from '../../../api/connection';
import {connect} from 'react-redux';

const ConnectionOperations = [
    'Delete',
    'Start Scan WeightSensor',
    'Start Scan TempHumiditySensor',
    'Cancel',
];
const connectionTypes = [
    {
        label: 'Serial',
        value: 1,
    },
    {
        label: 'Network',
        value: 2,
    }
];
const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        fetchConnection: (...args) => dispatch(asyncFetchConnection(...args)),
        setTitle: (...args) => dispatch(setTitle(...args)),
        deleteConnection: (...args) => dispatch(asyncDeleteConnection(...args)),
        setTabBarState: (...args) => dispatch(setTabBarState(...args)),
    };
};
const mapState2Props = (state, props) => {
    return {
        ...props,
        connections: state.connections,
    };
};

class ConnectionSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createDialogVisible: false,
            create: {
                type: null,
                target: ''
            },
            serialPorts: []
        };
        this.props.setTitle('Connection Setting');
    }

    componentDidMount() {
        this.props.fetchConnection();
        this.props.setTabBarState(false);
    }

    render() {
        const {Item} = List;
        const {connections} = this.props;
        const {createDialogVisible} = this.state;
        const {create} = this.state;
        return (
            <div>
                <List renderHeader={() => 'Connections'}>
                    {
                        connections.map(connection => (
                            <Item key={connection.id} extra={<Icon type="right"/>}
                                  onClick={() => this.showConnectionOperations(connection)}>
                                <Flex justify="between" className="connectionItem">
                                    <span className="type">{asConnectionType(connection.type)}</span>
                                    <span className="target">{connection.target}</span>
                                </Flex>
                            </Item>))
                    }
                    <Item key="createButton">
                        <Button type="primary" onClick={() => this.showCreateDialog()}>New</Button>
                    </Item>
                </List>
                <Modal
                    visible={createDialogVisible}
                    transparent
                    title="Create A Connection"
                    footer={[
                        {text: 'Cancel', onPress: () => this.setState({createDialogVisible: false})},
                        {text: 'Create', onPress: () => this.createConnection()},
                    ]}
                    onClose={() => this.setState({createDialogVisible: false})}>
                    <List title="Connection">
                        <Picker data={connectionTypes} title="Connection Type" cols={1}
                                extra="Choose"
                                onChange={e => this.setCreateType(e)}>
                            <List.Item>
                                <InputItem value={create.type && asConnectionType(create.type)}
                                           disabled={true}
                                           placeholder="Type"/>
                            </List.Item>
                        </Picker>
                        {
                            (() => {
                                const input = (<List.Item key="target"><InputItem placeholder="Connection Target"
                                                                                  onChange={e => this.setCreateTarget(e)}
                                                                                  value={create.target}
                                                                                  disabled={this.state.create.type === 1}/></List.Item>);
                                if (create.type === 1) {
                                    return (<Picker data={this.state.serialPorts}
                                                    extra="Choose"
                                                    title="Serial Port List"
                                                    cols={1}
                                                    onChange={arr => this.setCreateTargetSerial(arr)}>
                                        {input}
                                    </Picker>)
                                } else {
                                    return input;
                                }
                            })()
                        }
                    </List>
                </Modal>
            </div>
        );
    }

    deleteConnection(connection) {
        Modal.alert('Delete Connection!', 'Are You Sure delete this connection',
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                        Toast.show('Canceled', 1, false);
                    }
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        this.props.deleteConnection(connection.id);
                    }
                }
            ]);
    }

    scanConnection(connection) {
        Modal.alert('Scan Device!', 'Scan Devices for this Connection?',
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                        Toast.show('Canceled', 1, false);
                    }
                },
                {
                    text: 'Scan',
                    onPress: () => {
                        scanDevice(connection.id).then(() => {
                            Toast.show('Scan Success!', 2, false)
                        });
                    }
                }
            ]);
    }

    showCreateDialog() {
        this.setState({
            createDialogVisible: true
        })
    }

    createConnection() {
        createConnection(this.state.create).then(() => {
            this.props.fetchConnection();
            this.setState({
                create: {},
                createDialogVisible: false,
            });
        })
    }

    setCreateType(types) {
        if (types.length < 1) {
            Toast.show('Please Choose A Connection Type!');
        }
        const type = types[0];
        const newCreate = {
            type,
            target: ''
        };
        this.setState({create: newCreate});
        if (type === 1 && this.state.serialPorts.length <= 0) {
            scanPort().then(res => {
                const serialPorts = [];
                for (const port of res) {
                    serialPorts.push({
                        label: port,
                        value: port,
                    });
                }
                this.setState({serialPorts});
            });
        }
    }

    setCreateTarget(e) {
        const create = {
            ...this.state.create,
            target: e,
        };
        this.setState({create});
    }

    setCreateTargetSerial(serialIndexList) {
        if (!serialIndexList) {
            Toast.show('Please Choose A Serial Port!');
            return;
        }
        const port = serialIndexList[0];
        const create = {
            ...this.state.create,
            target: port,
        };
        this.setState({create});
    }

    startScanTHSensors(connection) {
        Modal.alert('Scan TH Device!', 'Scan TemperatureHumidityDevices for this Connection?',
            [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Scan',
                    onPress: () => {
                        startScanTempHumiSensors(connection.id).then(() => {
                            Toast.show('Scan Success!', 2, false)
                        });
                    }
                }
            ]);
    }

    showConnectionOperations(connection) {
        ActionSheet.showActionSheetWithOptions({
            title: `${connection.target} Operations`,
            options: ConnectionOperations,
            cancelButtonIndex: ConnectionOperations.length - 1,
            destructiveButtonIndex: 0,
        }, index => {
            switch (index) {
                case 0:
                    this.deleteConnection(connection);
                    break;
                case 1:
                    this.scanConnection(connection);
                    break;
                case 2:
                    this.startScanTHSensors(connection);
                    break;
                default:
                    break;
            }
        })
    }
}

export default connect(mapState2Props, mapAction2Props)(ConnectionSetting);
