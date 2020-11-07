import React, {Component} from 'react';
import {func, object} from 'prop-types';
import './SlotGroup.sass';
import SlotCard from './SlotCard';

const isHighLight = (slot, highLightSlotTable) => {
    const {id} = slot;
    return highLightSlotTable.hasOwnProperty(id);
};

const renderSlots = (slots, onCardClick, highLightSlotTable) => {
    if (!slots) {
        return;
    }
    return slots.map(slot => (
        <SlotCard
            highLight={isHighLight(slot, highLightSlotTable)}
            slot={slot}
            key={slot.id}
            onClick={slot => onCardClick(slot)}/>));
};

class SlotGroup extends Component {
    static propTypes = {
        group: object.isRequired,
        onCardClick: func.isRequired,
        highlightSlotTable: object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {group, onCardClick, highlightSlotTable} = this.props;
        const {name, slots} = group;
        return (
            <div className="slot-group">
                <div className="group-name">{name}</div>
                <div className="slot-list">
                    {
                        renderSlots(slots, onCardClick, highlightSlotTable)
                    }
                </div>
            </div>
        );
    }
}

export default SlotGroup;
