import React, {Component} from 'react';
import {object} from 'prop-types';
import './SlotGroup.sass';
import SlotCard from './SlotCard';

const renderSlots = slots => {
    if (!slots) {
        return;
    }
    return slots.map(slot => (<SlotCard slot={slot} key={slot.id}/>));
};

class SlotGroup extends Component {
    static propTypes = {
        group: object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {group} = this.props;
        const {name, slots} = group;
        return (
            <div className="slot-group">
                <div className="group-name">{name}</div>
                <div className="slot-list">
                    {
                        renderSlots(slots)
                    }
                </div>
            </div>
        );
    }
}

export default SlotGroup;
