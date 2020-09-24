import React, {Component} from 'react';
import {ActionSheet, Card, List, Modal, Switch, Toast} from "antd-mobile";
import {asyncFetchSensors, setTabBarState, setTitle, toggleSensorElable} from "../../../store/actionCreators";
import {connect} from 'react-redux';
import FloatButton from '../../commons/FloatButton';
import {reloadSensors} from "../../../api/sensor";

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        fetchSensors: (...args) => dispatch(asyncFetchSensors(...args)),
        toggleSensorElable: (...args) => dispatch(toggleSensorElable(...args)),
        setTitle: (...args) => dispatch(setTitle(...args)),
        setTabBarState: (...args) => dispatch(setTabBarState(...args)),
    }
};
const mapState2Props = (state, props) => {
    return {
        ...props,
        sensors: state.sensors,
    };
};

class SensorSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.props.setTabBarState(false);
    }

    render() {
        const {sensors} = this.props;
        return (
            <div className="slotSetting">
                <List renderHeader={() => '传感器列表'}>
                    {
                        sensors.map(sensor => (<List.Item key={sensor.id}>
                            <Card>
                                <Card.Header title={`地址:${sensor.address}`} extra={sensor.deviceSn}/>
                                <Card.Body>
                                    <List>
                                        <List.Item extra={<Switch checked={sensor.hasElabel}
                                                                  onChange={(e) => this.toggleElabel(sensor, e)}
                                                                  platform="android"/>}>
                                            启用电子标签
                                        </List.Item>
                                        <List.Item arrow="horizontal" onClick={() => this.toSensorDetails(sensor)}>
                                            传感器详细参数
                                        </List.Item>
                                    </List>
                                </Card.Body>
                                <Card.Footer content={`绑定货道:[${sensor.slot && sensor.slot.slotNo}]`}
                                             extra={sensor.slot && sensor.slot.id}/>
                            </Card>
                        </List.Item>))
                    }
                </List>
                <FloatButton iconType="ellipsis" onClick={() => this.showOperationActions()}/>
            </div>
        );
    }

    toSensorDetails(sensor) {
        this.props.history.push({pathname: `/setting/${sensor.address}/sensor-details`});
    }

    componentDidMount() {
        this.props.setTitle('重力传感器设置');
        this.props.fetchSensors();
    }

    toggleElabel(sensor, e) {
        const sensorId = sensor.id;
        this.props.toggleSensorElable(sensorId, e);
    }

    showOperationActions() {
        const buttons = ['重新加载', '取消'];
        ActionSheet.showActionSheetWithOptions({
            title: '操作选择',
            options: buttons,
            cancelButtonIndex: buttons.length - 1,
            destructiveButtonIndex: 0,
        }, index => {
            if (index === 0) {
                this.callReloadSensors();
            }
        })
    }

    callReloadSensors() {
        Modal.alert('重新加载', '确定重新加载，该操作需等到一段时间（30s）才可生效?',
            [
                {
                    text: '取消',
                },
                {
                    text: '确定', onPress: () => {
                        reloadSensors().then(() => {
                            Toast.show('加载成功!', 1, false);
                        })
                    }
                },
            ]);
    }
}

export default connect(mapState2Props, mapAction2Props)(SensorSetting);
