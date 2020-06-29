import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd-mobile';
import './FloatButton.sass';

class FloatButton extends Component {
    static propTypes = {
        iconType: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    };

    render() {
        return (
            <div className="floatButton" onClick={() => this.onClick()}>
                <Icon type={this.props.iconType} className="icon"/>
            </div>
        );
    }

    onClick() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }
}

export default FloatButton;
