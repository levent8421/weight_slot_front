import React, {Component} from 'react';
import FloatButton from '../../commons/FloatButton';
import {ActionSheet, Card, Flex, List, Modal, Progress, Toast} from 'antd-mobile';
import {cleanCounter, sensorHealthy} from '../../../api/healthy';
import {
    tryRecoveryElabelAddress,
    tryRecoverySensorAddress,
    tryRecoverySensorAddressWithOriginSn
} from '../../../api/sensor';
import {
    abortFirmwareUpgrade,
    eLabelFirmwareUpgrade,
    fetchUpgradeProgress,
    sensorFirmwareUpgrade
} from '../../../api/firmware';
import './SensorHealthy.sass';

const operations = ['重置计数器', '刷新', '取消'];
const ClickOperations = ['传感器固件升级', '电子标签固件升级', '恢复传感器地址', '恢复电子标签地址', '取消'];
const WARN_RATE = 0.1;
const UPGRADE_PROGRESS_STATE_TABLE = {
    0: '等待升级',
    1: '升级成功',
    2: '升级失败',
    3: '升级中',
};

class SensorHealthy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensors: [],
            upgradePercent: 0,
            upgradeProgress: {},
        };
    }

    componentDidMount() {
        this.refreshSensors();
    }

    componentWillUnmount() {
        this.tryReleaseUpgradeProgressTimmer();
    }

    tryReleaseUpgradeProgressTimmer() {
        if (this.upgradeFirmwareTimmer) {
            clearTimeout(this.upgradeFirmwareTimmer);
        }
    }

    refreshSensors() {
        sensorHealthy().then(res => {
            const healthyList = res.sort((a, b) => a.sensor.address - b.sensor.address);
            this.setState({
                sensors: healthyList,
                showUpgradeProgress: false,
            });
        });
    }

    refreshUpgradeProgress(cb) {
        fetchUpgradeProgress().then(res => {
            this.setState({upgradeProgress: res});
            cb(res);
        });
    }

    doAbortFirmwareUpgrade() {
        abortFirmwareUpgrade().then(() => {
            Toast.show('升级已取消', 3, false);
        });
        this.tryReleaseUpgradeProgressTimmer();
    }

    render() {
        const {sensors, showUpgradeProgress, upgradeProgress} = this.state;
        let upgradeProgressPercent = 0;
        if (upgradeProgress.total !== undefined && upgradeProgress.current !== undefined && upgradeProgress.total !== 0) {
            upgradeProgressPercent = upgradeProgress.current / upgradeProgress.total * 100;
        }
        return (
            <div>
                <List renderHeader={() => 'Sensor Healthy'}>
                    {
                        sensors.map(helthy => (<List.Item key={helthy.sensor.id}>
                            {this.renderSensorCard(helthy)}
                        </List.Item>))
                    }
                </List>
                <Modal visible={showUpgradeProgress}
                       title="升级进度"
                       transparent
                       maskClosable={false}
                       onClose={() => this.onUpgradeProgressModalClose()}
                       footer={[{
                           text: 'Abort Upgrade',
                           disabled: true,
                           onPress: () => {
                               this.onUpgradeProgressModalClose();
                               this.doAbortFirmwareUpgrade();
                           }
                       }]}>
                    <p>{UPGRADE_PROGRESS_STATE_TABLE[upgradeProgress.state]}</p>
                    <p>{upgradeProgressPercent.toFixed(2)}%</p>
                    <Progress percent={upgradeProgressPercent} position="normal"/>
                </Modal>
                <FloatButton iconType="ellipsis" onClick={() => this.showOperations()}/>
            </div>
        );
    }

    recoveryElabelAddress(healthy) {
        const {sensor} = healthy;
        const {id, elabelSn} = sensor;
        const content = (<p>确认使用序列号[{elabelSn}]恢复地址?</p>);
        Modal.alert(`电子标签[${sensor.address}]地址恢复`, content, [
            {
                text: '确认', onPress: () => {
                    tryRecoveryElabelAddress(id).then(res => {
                        Toast.show(`${res.address}:恢复成功`, 3, false);
                    });
                }
            },
            {text: '取消'},
        ]);
    }

    recoverySensorAddress(healthy) {
        const {sensor} = healthy;
        const {id, deviceSn, sensorSn} = sensor;
        const content = (<p>初始SN:[{deviceSn}]<br/>备份SN:[{sensorSn}]<br/>确认使用该SN恢复地址?</p>);
        Modal.alert(`传感器[${sensor.address}]地址恢复`, content, [
            {
                text: '使用新SN恢复', onPress: () => {
                    tryRecoverySensorAddress(id).then(res => {
                        Toast.show(`${res.address}:恢复成功`, 3, false);
                    });
                }
            },
            {
                text: '使用原SN恢复', onPress: () => {
                    tryRecoverySensorAddressWithOriginSn(id).then(res => {
                        Toast.show(`${res.address}:恢复成功`, 3, false);
                    });
                }
            },
            {text: '取消'},
        ]);
    }

    onCardClick(healthy) {
        ActionSheet.showActionSheetWithOptions({
            options: ClickOperations,
            title: '操作菜单',
            cancelButtonIndex: ClickOperations.length - 1,
        }, index => {
            switch (index) {
                case 0:
                    this.upgradeFirmware(healthy);
                    break;
                case 1:
                    this.upgradeElabelFirmware(healthy);
                    break;
                case 2:
                    this.recoverySensorAddress(healthy);
                    break;
                case 3:
                    this.recoveryElabelAddress(healthy);
                    break;
                default:
                // Do Nothing
            }
        });
    }

    upgradeFirmware(healthy) {
        const {sensor, packageCounter} = healthy;
        const total = packageCounter.totalSuccess + packageCounter.totalErrors;
        const errorsRate = total === 0 ? 0 : ((packageCounter.totalErrors / total));
        let title = '';
        let content = '';
        let warn = false;
        const errorRateInPer = (errorsRate * 100).toFixed(2);
        if (errorsRate > WARN_RATE) {
            const minRate = (WARN_RATE * 100).toFixed(2);
            title = '谨慎升级！！！';
            content = `传感器${sensor.address}的网络丢包率为${errorRateInPer}%，在极限值${minRate}%下，建议通过串口升级！`;
            warn = true;
        } else {
            title = '升级确认';
            content = `传感${sensor.address}器的网络丢包率为${errorRateInPer}%,升级后请手动reload启动重力服务！`;
            warn = false;
        }
        Modal.alert(title, content, [
            {
                text: warn ? '仍要升级' : '升级',
                onPress: () => {
                    this.doFirmwareUpgrade(sensor);
                }
            },
            {
                text: '取消升级',
            }
        ]);
    }

    upgradeElabelFirmware(healthy) {
        const {sensor, packageCounter} = healthy;
        const total = packageCounter.elabelSuccess + packageCounter.elabelErrors;
        const errorsRate = total === 0 ? 0 : ((packageCounter.elabelErrors / total));
        let title = '';
        let content = '';
        let warn = false;
        const errorRateInPer = (errorsRate * 100).toFixed(2);
        if (errorsRate > WARN_RATE) {
            const minRate = (WARN_RATE * 100).toFixed(2);
            title = '谨慎升级！！！';
            content = `电子标签器${sensor.address}的网络丢包率为${errorRateInPer}%，在极限值${minRate}%下，建议通过串口升级！`;
            warn = true;
        } else {
            title = '升级确认';
            content = `电子标签${sensor.address}器的网络丢包率为${errorRateInPer}%,升级后请手动reload启动重力服务！`;
            warn = false;
        }
        Modal.alert(title, content, [
            {
                text: warn ? '仍要升级' : '升级',
                onPress: () => {
                    this.doElabelFirmwareUpgrade(sensor);
                }
            },
            {
                text: '取消升级',
            }
        ])
    }

    doFirmwareUpgrade(sensor) {
        this.tryReleaseUpgradeProgressTimmer();
        sensorFirmwareUpgrade(sensor.id).then(() => {
            Toast.show('升级已完成', 2, false);
            this.tryReleaseUpgradeProgressTimmer();
        });
        this.showUpgradeProgress();
        this.refreshUpgradeProgress(this.refreshUpgradeProgressCb());
    }

    doElabelFirmwareUpgrade(sensor) {
        this.tryReleaseUpgradeProgressTimmer();
        eLabelFirmwareUpgrade(sensor.id).then(() => {
            Toast.show('升级已完成', 2, false);
            this.tryReleaseUpgradeProgressTimmer();
        });
        this.showUpgradeProgress();
        this.refreshUpgradeProgress(this.refreshUpgradeProgressCb());
    }

    refreshUpgradeProgressCb() {
        return () => {
            this.upgradeFirmwareTimmer = setTimeout(() => {
                this.refreshUpgradeProgress(this.refreshUpgradeProgressCb());
            }, 500);
        };
    }

    showUpgradeProgress() {
        this.setState({showUpgradeProgress: true});
    }

    onUpgradeProgressModalClose() {
        this.setState({showUpgradeProgress: false});
    }

    renderSensorCard(healthy) {
        const {sensor, packageCounter} = healthy;
        const zeroOffset = `ZeroOffset:${sensor.zeroReference}`;
        const total = packageCounter.totalSuccess + packageCounter.totalErrors;
        const successRate = total === 0 ? 0 : ((packageCounter.totalSuccess / total) * 100).toFixed(0);
        const errorsRate = total === 0 ? 0 : ((packageCounter.totalErrors / total) * 100).toFixed(0);

        const elabelSuccess = packageCounter.elabelSuccess;
        const elabelErrors = packageCounter.elabelErrors;
        const eLabelTotal = elabelErrors + elabelSuccess;
        const elabelSuccessRate = eLabelTotal === 0 ? 0 : ((elabelSuccess / eLabelTotal) * 100).toFixed(0);
        const elabelErrorosRate = eLabelTotal === 0 ? 0 : ((elabelErrors / eLabelTotal) * 100).toFixed(0);
        const elabelContinueErrors = packageCounter.elabelContinueErrors;
        return (<Card key={sensor.id} onClick={() => this.onCardClick(healthy)}>
            <Card.Header title={sensor.address} extra={sensor.deviceSn}/>
            <Card.Body className="healthy-package-counter">
                <Flex>
                    <Flex.Item>
                        <div className="total">
                            <p className="title">SUCCESS</p>
                            <p className="value">{packageCounter.totalSuccess}/{successRate}%</p>
                            <p className="title">ELABEL SUCCESS</p>
                            <p className="value">{elabelSuccess}/{elabelSuccessRate}%</p>
                        </div>
                    </Flex.Item>
                    <Flex.Item>
                        <div className="error">
                            <p className="title">ERRORS</p>
                            <p className="value">{packageCounter.totalErrors}/{errorsRate}%</p>
                            <p className="title">ELABEL ERRORS</p>
                            <p className="value">{elabelErrors}/{elabelErrorosRate}%</p>
                        </div>
                    </Flex.Item>
                    <Flex.Item>
                        <div className="continue">
                            <p className="title">CONTINUE</p>
                            <p className="value">{packageCounter.continueErrors}</p>
                            <p className="title">ELABEL CONTINUE</p>
                            <p className="value">{elabelContinueErrors}</p>
                        </div>
                    </Flex.Item>
                </Flex>
            </Card.Body>
            <Card.Footer content={zeroOffset}/>
        </Card>);
    }

    showOperations() {
        ActionSheet.showActionSheetWithOptions({
            options: operations,
            title: 'Operations',
            cancelButtonIndex: operations.length - 1,
            destructiveButtonIndex: 0,
        }, index => {
            switch (index) {
                case 0:
                    //Clean
                    this.showCleanCounterConfirm();
                    break;
                case 1:
                    this.refreshSensors();
                    break;
                case 2:
                    //Cancel
                    break;
                default:
                //Do nothing
            }
        });
    }

    showCleanCounterConfirm() {
        Modal.alert('Clean Counter?', 'Clean counter?', [
            {text: 'Cancel'},
            {text: 'Yes', onPress: () => this.doCleanCounter()}
        ]);
    }

    doCleanCounter() {
        cleanCounter().then(() => {
            Toast.show('Clean success!', 1, false);
        })
    }
}

export default SensorHealthy;
