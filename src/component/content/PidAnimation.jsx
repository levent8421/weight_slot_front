import React, {Component} from 'react';
import {List} from 'antd-mobile';
import './PidAnimation.sass';

const currentColor = '#3171FA';
const targetColor = '#666666';
// 比例参数
const P = 0.6;
// 积分参数
const I = 0.02;
// 微分参数
const D = 0.1;

const CanvasWidth = 300, CanvasHeight = 300;
const PointSize = 4;

class PidAnimation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            target: {
                x: 150,
                y: 150,
            },
            current: {
                x: 150,
                y: 150,
            },
        };
        this.xSum = 0;
        this.lastErrorX = 0;
        this.ySum = 0;
        this.lastErrorY = 0;
    }

    componentDidMount() {
        this.timmer = setInterval(() => {
            this.onTimer();
        }, 10);
    }

    componentWillUnmount() {
        clearInterval(this.timmer);
    }

    render() {
        const {target, current} = this.state;
        return (
            <div className="pid">
                <div className="wrapper">
                    <List renderHeader={() => 'Params'}>
                        <List.Item extra={P}>P</List.Item>
                        <List.Item extra={I}>I</List.Item>
                        <List.Item extra={D}>D</List.Item>
                        <List.Item extra={`${current.x},${current.y}`}>Current</List.Item>
                        <List.Item extra={`${target.x},${target.y}`}>Target</List.Item>
                    </List>
                    <canvas ref={canvas => this.onCanvasLoad(canvas)} width={CanvasWidth} height={CanvasHeight}>
                        Unsupported Canvas
                    </canvas>
                </div>
                <div className="stake">None</div>
            </div>
        );
    }

    onCanvasLoad(canvas) {
        if (!canvas) {
            return;
        }
        if (this.canvas === canvas) {
            return;
        }
        this.canvas = canvas;
        canvas.onclick = e => {
            const {offsetX, offsetY} = e;
            this.onCanvasClick(offsetX, offsetY);
        };
        this.canvasContext = canvas.getContext('2d');
        this.reDrawPoint();
    }

    onCanvasClick(x, y) {
        this.xSum = 0;
        this.ySum = 0;
        this.setState({
            target: {
                x: x,
                y: y,
            }
        });
        this.reDrawPoint();
    }

    reDrawPoint() {
        const {target, current} = this.state;
        this.canvasContext.clearRect(0, 0, CanvasWidth, CanvasHeight);
        this.canvasContext.fillStyle = targetColor;
        this.canvasContext.fillRect(target.x, target.y, PointSize, PointSize);
        this.canvasContext.fillStyle = currentColor;
        this.canvasContext.fillRect(current.x, current.y, PointSize, PointSize);
    }

    onTimer() {
        const {target, current} = this.state;

        const errorX = (target.x - current.x) / 10;
        this.xSum += errorX;
        const derivativeX = (errorX - this.lastErrorX) / 10;
        this.lastErrorX = errorX;

        let outX = current.x + (P * errorX + I * this.xSum + D * derivativeX);
        outX = Math.min(outX, CanvasWidth - PointSize);
        outX = Math.max(outX, 0);
        outX = parseInt(outX);

        const errorY = (target.y - current.y) / 10;
        this.ySum += errorY;
        const derivativeY = (errorY - this.lastErrorY) / 10;
        this.lastErrorY = errorY;

        let outY = current.y + (P * errorY + I * this.ySum + D * derivativeY);
        outY = Math.min(outY, CanvasHeight - PointSize);
        outY = Math.max(outY, 0);
        outY = parseInt(outY);
        if (current.x === outX && current.y === outY) {
            return;
        }
        this.setState({
            current: {
                x: outX,
                y: outY,
            }
        });
        this.reDrawPoint();
    }
}

export default PidAnimation;
