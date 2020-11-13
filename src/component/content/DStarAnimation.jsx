import React, {Component} from 'react';
import './DStarAnimation.sass';
import {mapStateAndAction} from '../../store/storeUtils';
import {Button, List} from 'antd-mobile';
import DStarBoard, {CLICK_ACTION_ADD_WALL, CLICK_ACTION_REMOVE_WALL} from '../../util/DStarBoard';

const CLICK_ACTION_NAMES = {};
CLICK_ACTION_NAMES[CLICK_ACTION_ADD_WALL] = 'Add Wall';
CLICK_ACTION_NAMES[CLICK_ACTION_REMOVE_WALL] = 'Remove Wall';

class DStarAnimation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clickAction: CLICK_ACTION_ADD_WALL,
        };
    }

    componentDidMount() {
        this.props.setTitle('D* Animation');
    }

    onCanvasBind(canvas) {
        if (!canvas) {
            return;
        }
        if (this.board && !this.board.checkCanvasChanged(canvas)) {
            return;
        }
        this.board = new DStarBoard({
            canvas,
            height: 500,
            width: 500,
        });
        this.board.setup();
    }

    changeBoardClickAction() {
        const {clickAction} = this.state;
        if (!this.board) {
            return;
        }
        if (clickAction === CLICK_ACTION_REMOVE_WALL) {
            this.setState({clickAction: CLICK_ACTION_ADD_WALL});
            this.board.setClickAction(CLICK_ACTION_ADD_WALL);
        } else {
            this.setState({clickAction: CLICK_ACTION_REMOVE_WALL});
            this.board.setClickAction(CLICK_ACTION_REMOVE_WALL);
        }
    }

    render() {
        const {clickAction} = this.state;
        const clickActionName = CLICK_ACTION_NAMES[clickAction];
        console.log(clickAction, clickActionName, CLICK_ACTION_NAMES);
        return (
            <div className="d-star">
                <List renderHeader={() => 'State'}>
                    <List.Item extra={1}>
                        Start
                    </List.Item>
                    <List.Item extra={1}>
                        Target
                    </List.Item>
                    <List.Item>
                        <Button type="primary" size="small" onClick={() => this.changeBoardClickAction()}>
                            {clickActionName}
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
