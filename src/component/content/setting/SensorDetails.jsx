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
const operations = ['Refresh', 'Cancel'];

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
        this.props.setTitle('Sensor Params');
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
                <List renderHeader={() => 'Sensor Info'}>
                    <List.Item extra={sensor.deviceSn}>SN</List.Item>
                    <List.Item extra={sensor.hasElabel ? 'yes' : 'no'}>ELabel</List.Item>
                    <List.Item extra={sensor.address}>Address</List.Item>
                    <List.Item extra={sensor.zeroReference}>ZeroReference</List.Item>
                    <List.Item extra={slot.slotNo}>SlotNo</List.Item>
                    <List.Item extra={slot.skuApw}>SkuApw</List.Item>
                    <List.Item extra={slot.skuName}>SkuName</List.Item>
                    <List.Item extra={slot.skuTolerance}>SkuTolerance</List.Item>
                    <List.Item extra={slot.skuNo}>SkuNo</List.Item>
                </List>
                <List renderHeader={() => 'Sensor Params'}>
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
            title: 'Operations',
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
