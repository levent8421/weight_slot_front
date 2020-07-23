import React, {Component} from 'react';
import {dumpAll} from '../../../api/sensor';
import {List, Modal, TextareaItem} from 'antd-mobile';

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
            this.setState({sensors: res})
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
            </div>
        );
    }

    renderSensorItem(sensor) {
        const {slot, connection} = sensor;
        return (<div onClick={() => this.onSensorClick(sensor)}>
            WS:[{sensor.id},{sensor.address}]
            S:[{slot && slot.id},{slot && slot.slotNo}]
            C:[{connection && connection.id},{connection && connection.target}]
        </div>);
    }

    onSensorClick(sensor) {
        const {connection, slot} = sensor;
        sensor.slot = null;
        sensor.connection = null;
        const list = (<List renderHeader={() => 'Sensor'}>
            <TextareaItem value={JSON.stringify(sensor)} autoHeight/>
            <TextareaItem value={JSON.stringify(connection)} autoHeight/>
            <TextareaItem value={JSON.stringify(slot)} autoHeight/>
        </List>);
        Modal.alert('Sensor', list);
    }
}

export default Overview;
