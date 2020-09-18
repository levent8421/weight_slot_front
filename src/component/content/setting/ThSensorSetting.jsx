import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setTitle} from '../../../store/actionCreators';
import {List} from 'antd-mobile';
import {fetchThSensors} from '../../../api/thSensor';

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
    }
};

class ThSensorSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensors: [],
        };
    }

    componentDidMount() {
        this.props.setTitle('温湿度传感器');
        this.refreshSensors();
    }

    refreshSensors() {
        fetchThSensors().then(res => {
            this.setState({
                sensors: res
            });
        });
    }

    toDetail(sensor) {
        this.props.history.push({
            pathname: `/setting/${sensor.id}/th-detail`,
        });
    }

    render() {
        const {sensors} = this.state;
        return (
            <div className="th-sensors">
                <List renderHeader={() => '温湿度传感器'}>
                    {
                        sensors.map(sensor => (
                            <List.Item key={sensor.id} arrow="horizontal" onClick={() => this.toDetail(sensor)}>
                                {sensor.no} [{sensor.address}]
                            </List.Item>))
                    }
                </List>
            </div>
        );
    }
}

export default connect(null, mapAction2Props)(ThSensorSetting);
