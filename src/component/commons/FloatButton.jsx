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
            position: this.defaultPosition,
            down: false,
        };
    }

    static propTypes = {
        iconType: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    };

    render() {
        const {position, down} = this.state;
        return (
            <div className={"floatButton " + (down ? 'move' : '')}
                 style={{...position}}
                 onMouseDown={e => this.onMouseDown(e)}
                 onMouseUp={() => this.onMouseUp()}
                 onMouseMove={e => this.onMouseMove(e)}>
                <Icon type={this.props.iconType} className="icon"/>
            </div>
        );
    }

    callOnClick() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    setDown(down) {
        this.setState({down});
    }

    onMouseDown(e) {
        this.setDown(true);
        this._moved = false;
        this.startPos = {
            x: e.clientX,
            y: e.clientY,
        };
    }

    onMouseUp() {
        this.setDown(false);
        this.defaultPosition = this.state.position;
        if (!this._moved) {
            this.callOnClick();
            this._moved = false;
        }
    }

    onMouseMove(e) {
        if (!this.state.down) {
            return;
        }
        const {clientX, clientY} = e;
        const dx = this.startPos.x - clientX;
        const dy = this.startPos.y - clientY;
        let {right, bottom} = this.defaultPosition;
        right += dx;
        bottom += dy;
        this.setState({
            position: {
                right,
                bottom,
            }
        });
        this._moved = true;
    }
}

export default FloatButton;
