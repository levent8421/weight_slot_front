import React, {Component} from 'react';
import {mapStateAndAction} from '../../store/storeUtils';
import {List} from 'antd-mobile';
import './SlideAnimation.sass';
import SlideDemoCanvas from '../../util/SlideDemoCanvas';

class SlideAnimation extends Component {
    componentDidMount() {
        this.props.setTitle('Slide Animation');
    }

    onSlideAnimationCanvasBind(canvas) {
        if (!canvas) {
            return;
        }
        if (this.slideCanvas || this.slideCanvas !== canvas) {
            if (this.slideDemoBoard) {
                this.slideDemoBoard.stop();
            }
            this.slideCanvas = canvas;
            this.slideDemoBoard = new SlideDemoCanvas(canvas);
            this.slideDemoBoard.setup();
            this.slideDemoBoard.play();
        }
    }

    componentWillUnmount() {
        if (this.slideDemoBoard) {
            this.slideDemoBoard.stop();
        }
    }

    render() {
        return (
            <div className="slide-animation">
                <List renderHeader={() => 'Slide Animation Demo'}>
                    <List.Item extra="Wold!">
                        Hello
                    </List.Item>
                </List>
                <div className="canvas-wrapper">
                    <canvas ref={canvas => this.onSlideAnimationCanvasBind(canvas)} width="128" height="64">
                        Unsupported Canvas
                    </canvas>
                </div>
            </div>
        );
    }
}

export default mapStateAndAction(SlideAnimation);