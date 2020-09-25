import React, {Component} from 'react';
import {fetchOneSensor, setRange} from '../../../api/thSensor';
import {reloadSensors} from '../../../api/sensor';
import {connect} from 'react-redux';
import {setTitle} from '../../../store/actionCreators';
import {Button, Card, Flex, InputItem, List, Modal, Toast} from 'antd-mobile';
import {fetchSensorDataLog} from '../../../api/tempHumidityLog';
import LineCharts from '../../commons/LineCharts';
import {thSensorStateText} from '../../../util/DataConvertor';

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
            dataLogs: [],
            chartsXData: [],
            chartsYData: [],
        };
    }

    refreshDataLog() {
        fetchSensorDataLog(this.sensorId).then(res => {
            const xData = [];
            const tempData = [];
            // const humiData = [];
            // const maxHumiData = [];
            // const minHumiData = [];
            const maxTempData = [];
            const minTempData = [];
            for (let log of res) {
                const {
                    createTime,
                    temperature,
                    // humidity,
                    // maxHumidity, minHumidity,
                    maxTemperature, minTemperature
                } = log;
                const date = new Date(createTime);
                const timeStr = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                xData.push(timeStr);
                tempData.push(temperature);
                // humiData.push(humidity);
                // maxHumiData.push(maxHumidity);
                // minHumiData.push(minHumidity);
                maxTempData.push(maxTemperature);
                minTempData.push(minTemperature);
            }
            const yData = [
                {name: '温度', data: tempData},
                // {name: '湿度', data: humiData},
                // maxHumiData, minHumiData,
                {name: '温度上限', data: maxTempData}, {name: '温度下限', data: minTempData},
            ];
            this.setState({
                dataLogs: res,
                chartsXData: xData,
                chartsYData: yData,
            });
            this.charts.refreshCharts();
        });
    }

    componentDidMount() {
        const {id} = this.props.match.params;
        this.sensorId = id;
        this.props.setTitle('温湿度传感器报警范围');
        this.refreshDataLog();
        fetchOneSensor(id).then(res => {
            this.setState({
                sensor: res,
            });
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
        const {sensor, dataLogs, chartsXData, chartsYData} = this.state;
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
                <Card>
                    <Card.Header title="历史数据"/>
                    <Card.Body>
                        <LineCharts width={500} height={300} xData={chartsXData} yData={chartsYData}
                                    ref={charts => this.charts = charts}/>
                    </Card.Body>
                    <Card.Footer content={dataLogs.length}/>
                </Card>
                <List renderHeader={() => '温湿度日志'}>
                    {
                        dataLogs.map(log => (<List.Item key={log.id}>
                            <Flex>
                                <Flex.Item>{log.createTime}</Flex.Item>
                                <Flex.Item>温度:{log.temperature}°C({thSensorStateText(log.temperatureState)})</Flex.Item>
                                {/*<Flex.Item>湿度:{log.humidity}%({thSensorStateText(log.humidityState)})</Flex.Item>*/}
                            </Flex>
                        </List.Item>))
                    }
                </List>
            </div>
        );
    }

    updateRange() {
        setRange(this.state.sensor).then(res => {
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
