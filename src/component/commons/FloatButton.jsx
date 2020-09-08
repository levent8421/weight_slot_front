import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd-mobile';
import './FloatButton.sass';

class FloatButton extends Component {
    constructor(props) {
        super(props);
        this.defaultPosition = {
            right: 20,
            bottom: 100,
        };
        this.state = {
            down: false,
        };
    }

    static propTypes = {
        iconType: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    };

    render() {
        const {down} = this.state;
        return (
            <div className={"floatButton " + (down ? 'move' : '')}
                 style={this.defaultPosition}
                 onClick={e => this.callOnClick(e)}
            >
                <Icon type={this.props.iconType} className="icon"/>
            </div>
        );
    }

    callOnClick(e) {
        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }
}

export default FloatButton;
