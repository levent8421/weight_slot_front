import React, {Component} from 'react';
import './DStarAnimation.sass';
import {mapStateAndAction} from '../../store/storeUtils';
import {Button, List} from 'antd-mobile';
import DStarBoard, {
    CLICK_ACTION_ADD_WALL,
    CLICK_ACTION_MARK_TARGET,
    CLICK_ACTION_REMOVE_WALL
} from '../../util/DStarBoard';

const CLICK_ACTION_NAMES = {};
CLICK_ACTION_NAMES[CLICK_ACTION_ADD_WALL] = 'Add Wall';
CLICK_ACTION_NAMES[CLICK_ACTION_REMOVE_WALL] = 'Remove Wall';
CLICK_ACTION_NAMES[CLICK_ACTION_MARK_TARGET] = 'Mark Target';

class DStarAnimation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clickAction: CLICK_ACTION_ADD_WALL,
            message: '',
            rePlanSteps: 0,
        };
    }

    componentDidMount() {
        this.props.setTitle('D* Animation');
    }

    onCanvasBind(canvas) {
        const _this = this;
        if (!canvas) {
            return;
        }
        if (this.board && !this.board.checkCanvasChanged(canvas)) {
            return;
        }
        if (this.board) {
            this.board.shutdown();
            this.board = null;
        }
        this.board = new DStarBoard({
            canvas,
            height: 500,
            width: 500,
            onMessage(msg) {
                _this.setState({message: msg})
            },
            onRePlan(pathList) {
                _this.setState({rePlanSteps: pathList.length})
            }
        });
        this.board.setup();
    }

    changeBoardClickAction() {
        let {clickAction} = this.state;
        if (!this.board) {
            return;
        }
        clickAction++;
        clickAction = clickAction % 3;
        this.setState({clickAction: clickAction});
        this.board.setClickAction(clickAction);
    }

    render() {
        const {clickAction, message, rePlanSteps} = this.state;
        const clickActionName = CLICK_ACTION_NAMES[clickAction];
        return (
            <div className="d-star">
                <List renderHeader={() => 'State'}>
                    <List.Item extra={rePlanSteps}>
                        RePlanSteps
                    </List.Item>
                    <List.Item extra={message}>
                        Message
                    </List.Item>
                    <List.Item extra="click to change" onClick={() => this.changeBoardClickAction()}>
                        Click Action : ({clickActionName})
                    </List.Item>
                    <List.Item>
                        <Button type="primary" onClick={() => this.board.setupTimer()}>
                            Start
                        </Button>
                    </List.Item>
                </List>
                <canvas className="board-canvas" width={500} height={500} ref={canvas => this.onCanvasBind(canvas)}>
                    Unsupported Canvas
                </canvas>
            </div>
        );
    }
}

export default mapStateAndAction(DStarAnimation);
