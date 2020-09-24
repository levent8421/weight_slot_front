import React, {Component} from 'react';
import {fetchAllWithSensors, fetchDetail} from '../../../api/slot';
import {setSlotByIds} from '../../../api/sensor';
import {connect} from 'react-redux';
import {setTitle} from '../../../store/actionCreators';
import {ActionSheet, Button, Flex, List, Modal, Picker, Toast, WingBlank} from "antd-mobile";
import './SlotSensorsSetting.sass'

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
    };
};
const SENSOR_OPERATIONS = ['移除', '取消'];

class SlotSensorsSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slot: {},
            sensors: [],
            sensorRemoveMode: false,
            allSlots: [],
            sensorPickerData: [],
        };
    }

    componentDidMount() {
        this.props.setTitle('货道传感器管理');
        const {id} = this.props.match.params;
        fetchDetail(id).then(res => {
            const sensors = res.sensors;
            for (let sensor of sensors) {
                sensor.changed = false;
            }
            this.setState({
                slot: res,
                sensors: sensors,
            });
            this.props.setTitle(`传感器管理[${res.slotNo}]`);
        });
        fetchAllWithSensors().then(res => {
            const pickerData = [];
            for (let slot of res) {
                const sensors = slot.sensors;
                const children = [];
                for (let sensor of sensors) {
                    children.push({
                        value: sensor.id,
                        label: sensor.address,
                    });
                }
                pickerData.push({
                    value: slot.id,
                    label: slot.slotNo,
                    children: children,
                });
            }
            this.setState({allSlots: res, sensorPickerData: pickerData,});
        });
    }

    renderSensorItem(sensor) {
        const {sensorRemoveMode, sensorPickerData} = this.state;
        const sensorItem = (
            <List.Item key={sensor.id}
                       arrow="horizontal"
                       className={`sensor-item ${sensor.changed ? 'sensor-item-changed' : ''}`}
                       onClick={() => this.openSensorOperations(sensor)}
                       extra={sensorRemoveMode ? '点击删除' : ''}>
                {sensor.deviceSn}
            </List.Item>);
        if (sensorRemoveMode) {
            return sensorItem;
        } else {
            return (<Picker
                data={sensorPickerData}
                key={sensor.id}
                value={[sensor.slotId, sensor.id]}
                cols={2}
                onChange={v => this.onSelectSensor(sensor, v)}>{sensorItem}</Picker>)
        }
    }

    onSelectSensor(oldSensor, selected) {
        const slotId = selected[0];
        const sensorId = selected[1];
        let index = -1;
        const selectedSensors = this.state.sensors;
        for (let i in selectedSensors) {
            if (!selectedSensors.hasOwnProperty(i)) {
                continue;
            }
            const sensor = selectedSensors[i];
            if (sensor.id === oldSensor.id) {
                index = i;
            }
        }
        let selectedSensor;
        for (let slot of this.state.allSlots) {
            if (slot.id === slotId) {
                for (let sensor of slot.sensors) {
                    if (sensor.id === sensorId) {
                        sensor.changed = true;
                        selectedSensor = sensor;
                    }
                }
                break;
            }
        }
        for (let s of selectedSensors) {
            if (s.id === selectedSensor.id) {
                Toast.show('传感器重复!', 1, false);
                return;
            }
        }
        selectedSensors[index] = selectedSensor;
        this.setState({sensors: selectedSensors,})
    }

    render() {
        const {slot, sensors, sensorRemoveMode} = this.state;
        return (
            <div>
                <List renderHeader={() => '货道信息'}>
                    <List.Item extra={slot.slotNo}>货道号</List.Item>
                    <List.Item extra={slot.skuName}>SKU名称</List.Item>
                    <List.Item extra={slot.skuNo}>SKU号</List.Item>
                </List>
                <List renderHeader={() => 'Sensors'}>
                    {
                        sensors.map(sensor => this.renderSensorItem(sensor))
                    }
                    <List.Item>
                        <WingBlank>
                            <Flex justify={"between"}>
                                <Flex.Item>
                                    <Button type="warning"
                                            onClick={() => this.setState({sensorRemoveMode: !this.state.sensorRemoveMode})}>
                                        {sensorRemoveMode ? '退出删除' : '删除'}
                                    </Button>
                                </Flex.Item>
                                <Flex.Item>
                                    <Button type="ghost" onClick={() => this.addSensor()}
                                            disabled={sensorRemoveMode}>添加</Button>
                                </Flex.Item>
                                <Flex.Item>
                                    <Button type="primary" disabled={sensorRemoveMode}
                                            onClick={() => this.applySensors()}>保存</Button>
                                </Flex.Item>
                            </Flex>
                        </WingBlank>
                    </List.Item>
                </List>
            </div>
        );
    }

    addSensor() {
        for (let sensor of this.state.sensors) {
            if (sensor.id < 0) {
                Toast.show('请选择一个传感器!', 1, false);
                return;
            }
        }
        const {sensors} = this.state;
        sensors.push({
            id: -1,
            deviceSn: '未选择',
            changed: true,
        });
        this.setState({sensors});
    }

    openSensorOperations(sensor) {
        const {sensorRemoveMode} = this.state;
        if (!sensorRemoveMode) {
            return;
        }
        ActionSheet.showActionSheetWithOptions(
            {
                options: SENSOR_OPERATIONS,
                title: `传感器 ${sensor.deviceSn}`,
                cancelButtonIndex: 2,
                destructiveButtonIndex: 0,
            },
            index => {
                if (index === 0) {
                    Modal.alert('移除传感器',
                        `移除传感器 ${sensor.deviceSn}?`,
                        [
                            {text: '取消'},
                            {
                                text: '移除',
                                onPress: () => this.removeSensor(sensor),
                            }
                        ]);
                }
            })
    }

    removeSensor(sensor) {
        const {sensors} = this.state;
        const newSensors = [];
        for (let i in sensors) {
            if (!sensors.hasOwnProperty(i)) {
                continue;
            }
            const s = sensors[i];
            if (s.id === sensor.id) {
                continue;
            }
            newSensors.push(s);
        }
        this.setState({sensors: newSensors});
    }

    applySensors() {
        const sensorIds = this.state.sensors.map(v => v.id);
        for (let id of sensorIds) {
            if (id <= 0) {
                Toast.show('Any sensor not selected!', 1, false);
                return;
            }
        }
        const slot = this.state.slot;
        Modal.alert('Apply Sensor Setting', 'Do you want to apply this changes?', [{text: 'Cancel'}, {
            text: 'Apply',
            onPress: () => {
                setSlotByIds(sensorIds, slot.id).then(res => {
                    Toast.show('Apply Success!');
                    const {sensors} = this.state;
                    for (let s of sensors) {
                        s.changed = false;
                    }
                    this.setState({sensors});
                })
            }
        }])
    }
}

export default connect(null, mapAction2Props)(SlotSensorsSetting);
