import React, {Component} from 'react';
import {fetchOneSensor, setRange} from '../../../api/thSensor';
import {reloadSensors} from '../../../api/sensor';
import {connect} from 'react-redux';
import {setTitle} from '../../../store/actionCreators';
import {Button, InputItem, List, Modal, Toast} from 'antd-mobile';

const maxAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
    };
};

class ThSensorDetailsSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensor: {},
        };
    }

    componentDidMount() {
        const {id} = this.props.match.params;
        this.props.setTitle('温湿度传感器报警范围');
        fetchOneSensor(id).then(res => {
            this.setState({
                sensor: res,
            })
        })
    }

    setSensorData(data) {
        const {sensor} = this.state;
        this.setState({
            sensor: {
                ...sensor,
                ...data,
            }
        });
    }

    render() {
        const {sensor} = this.state;
        console.log(sensor);
        return (
            <div className="th-sensor-detail">
                <List renderHeader={() => '报警范围'}>
                    <InputItem value={sensor.maxTemperature} labelNumber={10}
                               onChange={text => this.setSensorData({maxTemperature: text})}>温度上限(°C)：</InputItem>
                    <InputItem value={sensor.minTemperature} labelNumber={10}
                               onChange={text => this.setSensorData({minTemperature: text})}>温度下限(°C)：</InputItem>
                    <InputItem value={sensor.maxHumidity} labelNumber={10}
                               onChange={text => this.setSensorData({maxHumidity: text})}>湿度上限( %)：</InputItem>
                    <InputItem value={sensor.minHumidity} labelNumber={10}
                               onChange={text => this.setSensorData({minHumidity: text})}>湿度下限( %)：</InputItem>
                    <List.Item>
                        <Button type="primary" onClick={() => this.updateRange()}>保存</Button>
                    </List.Item>
                </List>
            </div>
        );
    }

    updateRange() {
        setRange(this.state.sensor).then(res => {
            console.log(res);
            this.setState({sensor: res});
            this.showReloadConfirm();
        });
    }

    showReloadConfirm() {
        Modal.alert('重新加载', '数据已更新，是否重新加载生效？', [
            {
                text: 'No'
            },
            {
                text: 'Yes',
                onPress: () => {
                    reloadSensors().then(() => {
                        Toast.show('重新加载成功', 1, false);
                    });
                }
            }
        ]);
    }
}

export default connect(null, maxAction2Props)(ThSensorDetailsSetting);
