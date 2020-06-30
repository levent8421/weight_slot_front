import React, {Component} from 'react';
import {ActionSheet, Card, Flex, List, Modal, Switch, Toast} from "antd-mobile";
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
        this.props.setTitle('Sensor Setting');
        this.props.setTabBarState(false);
    }

    render() {
        const {sensors} = this.props;
        return (
            <div className="slotSetting">
                <List renderHeader={() => 'Sensors'}>
                    {
                        sensors.map(sensor => (<List.Item key={sensor.id}>
                            <Card>
                                <Card.Header title={`Address:${sensor.address}`} extra={sensor.deviceSn}/>
                                <Card.Body>
                                    <Flex justify="between">
                                        <span>ELabel</span>
                                        <Switch checked={sensor.hasElable}
                                                onChange={(e) => this.toggleElabel(sensor, e)}/>
                                    </Flex>
                                </Card.Body>
                                <Card.Footer content={`Slot:[${sensor.slot && sensor.slot.slotNo}]`}
                                             extra={sensor.slot && sensor.slot.id}/>
                            </Card>
                        </List.Item>))
                    }
                </List>
                <FloatButton iconType="ellipsis" onClick={() => this.showOperationActions()}/>
            </div>
        );
    }

    componentDidMount() {
        this.props.fetchSensors();
    }

    toggleElabel(sensor, e) {
        this.props.toggleSensorElable(sensor.id, e);
    }

    showOperationActions() {
        const buttons = ['Reload Sensors', 'Cancel'];
        ActionSheet.showActionSheetWithOptions({
            title: 'Operations',
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
        Modal.alert('Reload', 'Are you sure to reload?',
            [
                {
                    text: 'Yes', onPress: () => {
                        reloadSensors().then(() => {
                            Toast.show('Reload Success!', 1, false);
                        })
                    }
                },
                {
                    text: 'Cancel', onPress: () => {
                        Toast.show('Cancel', 1, false);
                    }
                }
            ]);
    }
}

export default connect(mapState2Props, mapAction2Props)(SensorSetting);
