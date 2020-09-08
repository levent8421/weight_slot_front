import React, {Component} from 'react';
import FloatButton from '../../commons/FloatButton';
import {ActionSheet, Card, Flex, List, Modal, Toast} from 'antd-mobile';
import {cleanCounter, sensorHealthy} from '../../../api/healthy';
import './SensorHealthy.sass';

const operations = ['Clean', 'Refresh', 'Cancel'];

class SensorHealthy extends Component {
    constructor(props) {
        super(props);
        this.state = {sensors: []};
    }

    componentDidMount() {
        this.refreshSensors();
    }

    refreshSensors() {
        sensorHealthy().then(res => {
            this.setState({
                sensors: res,
            })
        });
    }

    render() {
        const {sensors} = this.state;
        return (
            <div>
                <List renderHeader={() => 'Sensor Healthy'}>
                    {
                        sensors.map(sensor => (<List.Item>
                            {this.renderSensorCard(sensor)}
                        </List.Item>))
                    }
                </List>
                <FloatButton iconType="ellipsis" onClick={() => this.showOperations()}/>
            </div>
        );
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
        return (<Card>
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
