import React, {Component} from 'react';
import {Icon, Result, Toast} from 'antd-mobile';
import {setTitle} from "../../store/actionCreators";
import {connect} from 'react-redux';

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args))
    }
};

class Logs extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.props.setTitle('Logs');
    }

    render() {
        return (
            <div>
                <Result
                    img={<Icon type="check-circle" size="lg" style={{fill: '#1F90E6'}}/>}
                    title="开发中"
                    message="开发中"/>
            </div>
        );
    }

    componentDidMount() {
        Toast.info('开发中',1, null, false);
    }
}

export default connect(null, mapAction2Props)(Logs);
