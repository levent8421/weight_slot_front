import React, {Component} from 'react';
import {bool, func, object} from 'prop-types';
import './SlotCard.sass';
import {asKg, asStateString} from '../../util/DataConvertor';

const formatPcs = pcs => {
    if (pcs === 0) {
        return 0;
    }
    return pcs ? pcs : '-';
};
const formatSkuNo = skuNo => {
    return skuNo ? skuNo : '---------';
};

const SLOT_CARD_CLASS_TABLE = {
    1: 'slot-card-online',
    2: 'slot-card-offline',
    3: 'slot-card-disable',
    4: 'slot-card-overload',
    5: 'slot-card-under-load',
};

const slotCardClass = (state, highLight) => {
    const res = ['slot-card'];
    if (highLight) {
        res.push('slot-card-highlight');
    } else {
        res.push(SLOT_CARD_CLASS_TABLE[state]);
    }
    return res.join(' ');
};
const TOLERANCE_STATE_CLASS_TABLE = {
    1: 'count-credible',
    2: 'count-incredible',
};
const pcsClass = state => {
    const res = ['count'];
    res.push(TOLERANCE_STATE_CLASS_TABLE[state]);
    return res.join(' ');
};

class SlotCard extends Component {
    static propTypes = {
        slot: object.isRequired,
        onClick: func.isRequired,
        highLight: bool.isRequired,
    };

    render() {
        const {slot, onClick, highLight} = this.props;
        if (!slot.sensors) {
            return null;
        }
        const {state, data, sku} = slot;
        const {weight, count, toleranceState} = data;
        const weightInKg = asKg(weight);
        const stateStr = asStateString(state);
        const pcs = formatPcs(count);
        const skuNo = formatSkuNo(sku.skuNo);

        const slotCardClassStr = slotCardClass(state, highLight);
        const pcsClassStr = pcsClass(toleranceState);
        return (
            <div className={slotCardClassStr}>
                <div className="header">
                    <div className="slot-no">{slot.slotNo}</div>
                    <div className="state">
                        <span className="weight">({weightInKg}kg)</span>
                        <div className="dot"/>
                        <span className="text">{stateStr}</span>
                    </div>
                </div>
                <div className="body">
                    <div className="sku">
                        <div className="sku-no">
                            <span>SKU:</span>
                            <span>{skuNo}</span>
                        </div>
                        <div className="sku-name">
                            {sku.name}
                        </div>
                    </div>
                    <div className="delimiter"/>
                    <div className={pcsClassStr} onClick={() => onClick(slot)}>
                        <span className="value">
                            {pcs}
                        </span>
                        <span className="label">
                            (数量)
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default SlotCard;
