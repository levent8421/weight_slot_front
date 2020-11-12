import React, {Component} from 'react';
import {asyncDeleteConnection, asyncFetchConnection, setTabBarState, setTitle} from '../../../store/actionCreators';
import {ActionSheet, Button, Card, Flex, InputItem, List, Modal, Picker, Progress, Toast, WingBlank} from 'antd-mobile';
import {asConnectionType} from '../../../util/DataConvertor';
import './ConnectionSetting.sass'
import {
    createConnection,
    fetchScanProgress,
    scanDevice,
    scanPort,
    startScanTempHumiSensors
} from '../../../api/connection';
import {connect} from 'react-redux';
import FetcherTask from '../../../util/FetcherTask';

const ConnectionOperations = [
    '删除',
    '扫描重力货道',
    '扫描温湿度传感器',
    '取消',
];
const connectionTypes = [
    {
        label: '串口',
        value: 1,
    },
    {
        label: '网络',
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
const SCAN_PROGRESS_FETC_DURATION = 1000;
const scanResultMap2Arr = result => {
    const res = [];
    for (let key in result) {
        if (!result.hasOwnProperty(key)) {
            continue;
        }
        const item = result[key];
        res.push({
            ...item,
            address: key,
        });
    }
    return res.sort((a, b) => a.address - b.address);
};
const scanStateTable = {
    1: '准备扫描',
    2: '扫描中',
    3: '扫描结束',
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
            serialPorts: [],
            scanProgressVisible: false,
            scanProgress: {
                progress: 50,
                start: 0,
                end: 0,
                address: -1,
                result: [],
                errors: [],
                state: 1,
            },
            scanError: null,
        };
        this.props.setTitle('物理连接设置');
    }

    componentDidMount() {
        this.props.fetchConnection();
        this.props.setTabBarState(false);
    }

    startFetchScanProgress() {
        if (this.scanProgressFetcher) {
            this.scanProgressFetcher.stop();
        }
        const _this = this;
        this.scanProgressFetcher = new FetcherTask({
            fetchData: fetchScanProgress,
            onNewData: data => {
                const {currentAddress, end, start, progress, scanResult, errors, state} = data;
                const scanProgress = {
                    progress: progress.toFixed(2),
                    end: end,
                    start: start,
                    address: currentAddress,
                    result: scanResultMap2Arr(scanResult),
                    errors: errors,
                    state: state,
                };
                _this.setState({scanProgress: scanProgress});
                if (state === 3) {
                    _this.scanProgressFetcher.stop();
                    Modal.alert('扫描完成', '扫描完成', [
                        {
                            text: '确认',
                            onPress() {
                                _this.setState({scanProgressVisible: false});
                            }
                        }
                    ]);
                }
            },
            duration: SCAN_PROGRESS_FETC_DURATION,
            onError: err => {
                console.error('Fetch scan progress error!', err);
                _this.setState({scanError: err.toString()});
            },
        });
        this.scanProgressFetcher.start();
        this.setState({
            scanProgressVisible: true
        });
    }

    stopFetchScanProgress() {
        if (this.scanProgressFetcher) {
            this.scanProgressFetcher.stop();
            this.scanProgressFetcher = null;
        }
        this.setState({
            scanProgressVisible: false,
        });
    }

    render() {
        const {Item} = List;
        const {connections} = this.props;
        const {createDialogVisible, scanProgressVisible, scanProgress} = this.state;
        const {create} = this.state;
        return (
            <div>
                <List renderHeader={() => '连接列表'}>
                    {
                        connections.map(connection => (
                            <Item key={connection.id} arrow="horizontal"
                                  onClick={() => this.showConnectionOperations(connection)}>
                                <Flex justify="between" className="connectionItem">
                                    <span className="type">{asConnectionType(connection.type)}</span>
                                    <span className="target">{connection.target}</span>
                                </Flex>
                            </Item>))
                    }
                    <Item key="createButton">
                        <Button type="primary" onClick={() => this.showCreateDialog()}>创建连接</Button>
                    </Item>
                </List>
                <Modal
                    visible={createDialogVisible}
                    transparent
                    title="创建连接"
                    footer={[
                        {text: '取消', onPress: () => this.setState({createDialogVisible: false})},
                        {text: '创建', onPress: () => this.createConnection()},
                    ]}
                    onClose={() => this.setState({createDialogVisible: false})}>
                    <List>
                        <Picker data={connectionTypes} title="连接类型" cols={1}
                                extra="请选择"
                                onChange={e => this.setCreateType(e)}>
                            <List.Item>
                                <InputItem value={create.type && asConnectionType(create.type)}
                                           disabled={true}
                                           placeholder="类型"/>
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
                                                    extra="选择"
                                                    title="串口列表"
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
                <Modal visible={scanProgressVisible} title="扫描进度">
                    <WingBlank>
                        <Card>
                            <Card.Header title="扫描进度" extra={scanStateTable[scanProgress.state]}/>
                            <Card.Body>
                                <Progress percent={scanProgress.progress} position="normal"/>
                                <Flex className="scan-overview">
                                    <Flex.Item>
                                        <p className="name">开始地址</p>
                                        <p className="value">{scanProgress.start}</p>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <p className="name">结束地址</p>
                                        <p className="value">{scanProgress.end}</p>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <p className="name">扫描进度</p>
                                        <p className="value">{scanProgress.progress}%</p>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <p className="name">发现设备</p>
                                        <p className="value">{scanProgress.result.length}</p>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <p className="name">正在扫描</p>
                                        <p className="value">ADDR:{scanProgress.address}</p>
                                    </Flex.Item>
                                </Flex>
                                <Button type="primary" onClick={() => this.stopFetchScanProgress()}>后台扫描</Button>
                            </Card.Body>
                        </Card>
                        <Flex>
                            <Flex.Item>
                                <List renderHeader={() => '扫描结果:'}>
                                    {scanProgress.result.map(item => (
                                        <List.Item key={item.address} extra={item.address}>
                                            {item.sensorSn}/{item.elabelSn}
                                        </List.Item>))}
                                </List>
                            </Flex.Item>
                            <Flex.Item>
                                <List renderHeader={() => '错误信息:'}>
                                    {
                                        scanProgress.errors.map((item, index) => (
                                            <List.Item key={index} extra={index}>{item}</List.Item>))
                                    }
                                </List>
                            </Flex.Item>
                        </Flex>
                    </WingBlank>
                </Modal>
            </div>
        );
    }

    deleteConnection(connection) {
        Modal.alert('删除连接!', '确定删除连接？',
            [
                {
                    text: '取消',
                },
                {
                    text: '删除',
                    onPress: () => {
                        this.props.deleteConnection(connection.id);
                    }
                }
            ]);
    }

    scanConnection(connection) {
        const _this = this;
        Modal.alert('扫描重力传感器!', '扫描该连接下的传感器？?',
            [
                {
                    text: '取消',
                },
                {
                    text: '扫描',
                    onPress: () => {
                        scanDevice(connection.id).then(() => {
                            _this.startFetchScanProgress();
                            Toast.show('扫描已开始!', 2, false)
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
            Toast.show('请选择连接类型!');
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
            Toast.show('请选择串口!');
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
        Modal.alert('扫描温湿度传感器!', '扫描该连接下的温湿度传感器?',
            [
                {
                    text: '取消',
                },
                {
                    text: '扫描',
                    onPress: () => {
                        startScanTempHumiSensors(connection.id).then(() => {
                            Toast.show('扫描已开始!', 2, false)
                        });
                    }
                }
            ]);
    }

    showConnectionOperations(connection) {
        ActionSheet.showActionSheetWithOptions({
            title: `${connection.target} 操作`,
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
