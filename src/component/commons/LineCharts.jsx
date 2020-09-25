import React, {Component} from 'react';
import './LineCharts.sass';
import PropTypes from 'prop-types';
import echarts from 'echarts';

class LineCharts extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        xData: PropTypes.array.isRequired,
        yData: PropTypes.array.isRequired,
    };
    static defaultProps = {
        width: 1000,
        height: 300,
        xData: [],
        yData: [],
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    onCanvasLoad(canvas) {
        if (!canvas || canvas === this.canvas) {
            return;
        }
        this.canvas = canvas;
        this.charts = echarts.init(this.canvas);
        this.refreshCharts();
    }

    refreshCharts() {
        const {xData, yData} = this.props;
        const series = [];
        const names = [];
        for (let y of yData) {
            names.push(y.name);
            series.push({
                ...y,
                type: 'line',
            });
        }
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: names,
            },
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: series,
        };
        this.charts.setOption(option);
    }

    render() {
        const {width, height} = this.props;
        return (
            <canvas ref={canvas => this.onCanvasLoad(canvas)}
                    className="charts"
                    height={height}
                    width={width}/>
        );
    }
}

export default LineCharts;
