import React, {Component} from 'react';
import {dumpAll} from '../../../api/sensor';
import {Button, List, Modal, TextareaItem, WingBlank} from 'antd-mobile';

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensors: []
        };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        dumpAll().then(res => {
            const sensors = res.sort((a, b) => a.address - b.address);
            this.setState({sensors})
        });
    }

    render() {
        const {sensors} = this.state;
        return (
            <div className="overview">
                <List renderHeader={() => 'All Sensors'}>
                    {
                        sensors.map(sensor => (
                            <List.Item key={sensor.id}>
                                {this.renderSensorItem(sensor)}
                            </List.Item>
                        ))
                    }
                </List>
                <WingBlank>
                    <Button onClick={() => this.refresh()} type="primary">刷新</Button>
                </WingBlank>
            </div>
        );
    }

    renderSensorItem(sensor) {
        const {slot, connection} = sensor;
        return (<div onClick={() => this.onSensorClick(sensor)}>
            传感器:[id:{sensor.id}/address:{sensor.address}]
            货道:[id:{slot && slot.id}/No:{slot && slot.slotNo}]
            连接:[id:{connection && connection.id}/{connection && connection.target}]
        </div>);
    }

    onSensorClick(sensor) {
        const {connection, slot} = sensor;
        sensor.slot = null;
        sensor.connection = null;
        const list = (<List renderHeader={() => '传感器'}>
            <TextareaItem value={JSON.stringify(sensor)} autoHeight/>
            <TextareaItem value={JSON.stringify(connection)} autoHeight/>
            <TextareaItem value={JSON.stringify(slot)} autoHeight/>
        </List>);
        Modal.alert('Sensor', list);
    }
}

export default Overview;
