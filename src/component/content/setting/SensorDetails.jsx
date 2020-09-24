import React, {Component} from 'react';
import {setTabBarState, setTitle} from '../../../store/actionCreators';
import {connect} from 'react-redux';
import {sensorParams} from '../../../api/systemStatus';
import {ActionSheet, List} from 'antd-mobile';
import FloatButton from "../../commons/FloatButton";

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
        setTabBarState: (...args) => dispatch(setTabBarState(...args)),
    };
};
const operations = ['刷新', '取消'];

class SensorDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensor: {},
            slot: {},
            sensorParams: []
        };
    }

    componentDidMount() {
        this.props.setTitle('传感器详细参数');
        this.props.setTabBarState(false);
        const address = this.props.match.params.address;
        this.refreshParams(address);
    }

    refreshParams(address) {
        sensorParams(address).then(res => {
            const {slot, sensor} = res;
            delete res.slot;
            delete res.sensor;
            const params = [];
            for (let name in res) {
                if (!res.hasOwnProperty(name)) {
                    continue;
                }
                params.push({
                    name: name,
                    value: res[name],
                });
            }
            this.setState({
                sensor: sensor,
                slot: slot,
                sensorParams: params,
            });
        })
    }

    render() {
        const {sensor, slot, sensorParams} = this.state;
        return (
            <div className="sensor-details">
                <List renderHeader={() => '传感器基本信息'}>
                    <List.Item extra={sensor.deviceSn}>序列号</List.Item>
                    <List.Item extra={sensor.hasElabel ? 'yes' : 'no'}>电子标签</List.Item>
                    <List.Item extra={sensor.address}>地址</List.Item>
                    <List.Item extra={sensor.zeroReference}>零点偏移</List.Item>
                    <List.Item extra={slot.slotNo}>绑定货道号</List.Item>
                    <List.Item extra={slot.skuApw}>SKU单重</List.Item>
                    <List.Item extra={slot.skuName}>SKU名称</List.Item>
                    <List.Item extra={slot.skuTolerance}>SKU允差</List.Item>
                    <List.Item extra={slot.skuNo}>SKU号</List.Item>
                </List>
                <List renderHeader={() => '传感器硬件信息'}>
                    {
                        sensorParams.map(param => (
                            <List.Item key={param.name} extra={JSON.stringify(param.value)}>
                                {param.name}
                            </List.Item>))
                    }
                </List>
                <FloatButton iconType="ellipsis" onClick={() => this.showOperations()}/>
            </div>
        );
    }

    showOperations() {
        ActionSheet.showActionSheetWithOptions({
            options: operations,
            title: '操作选择',
            cancelButtonIndex: operations.length - 1,
            destructiveButtonIndex: 0,
        }, index => {
            switch (index) {
                case 0:
                    this.refreshParams(this.props.match.params.address);
                    break;
                case 1:
                    //Cancel
                    break;
                default:
                //Do nothing
            }
        });
    }
}

export default connect(null, mapAction2Props)(SensorDetails);
