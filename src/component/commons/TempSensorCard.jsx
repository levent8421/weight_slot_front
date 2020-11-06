import React, {Component} from 'react';
import {object} from 'prop-types';
import {asStateString, thSensorStateText} from '../../util/DataConvertor';
import './TempSensorCard.sass';

const formatTemp = temp => {
    if (temp === 0) {
        return 0;
    }
    return temp ? temp.toFixed(1) : '--';
};

const CARD_CLASS_TABLE = {
    1: 'temp-sensor-card-online',
    2: 'temp-sensor-card-offline',
    3: 'temp-sensor-card-disable',
    4: 'temp-sensor-card-overload',
    5: 'temp-sensor-card-under-load',
};
const cardClass = state => {
    const res = ['temp-sensor-card'];
    res.push(CARD_CLASS_TABLE[state]);
    return res.join(' ');
};
const BODY_CLASS_TABLE = {
    4: 'body-overflow',
    5: 'body-overflow',
    1: 'body-ok',
};
const bodyClass = state => {
    const res = ['body'];
    res.push(BODY_CLASS_TABLE[state]);
    return res.join(' ');
};

class TempSensorCard extends Component {
    static propTypes = {
        sensor: object.isRequired,
    };

    render() {
        const {sensor} = this.props;
        const {no, data, state} = sensor;
        const {humidity, temperature, temperatureState} = data;
        const stateStr = asStateString(state);
        const temp = formatTemp(temperature);
        const tempState = thSensorStateText(temperatureState);

        const cardClassStr = cardClass(state);
        const bodyClassStr = bodyClass(temperatureState);
        return (
            <div className={cardClassStr}>
                <div className="header">
                    <div className="slot-no">{no}</div>
                    <div className="state">
                        <span className="humidity">({humidity}%)</span>
                        <span className="dot"/>
                        <span className="text">{stateStr}</span>
                    </div>
                </div>
                <div className={bodyClassStr}>
                    <div className="temp">
                        <span className="value">{temp}°C</span>
                        <span className="label">(温度)</span>
                    </div>
                    <div className="delimiter"/>
                    <div className="state">
                        <span className="value">{tempState}</span>
                        <span className="label">(状态)</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default TempSensorCard;
