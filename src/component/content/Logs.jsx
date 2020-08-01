import React, {Component} from 'react';
import {setTitle} from "../../store/actionCreators";
import {connect} from 'react-redux';
import MessageLog from './setting/MessageLog';

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
            <MessageLog/>
        );
    }

}

export default connect(null, mapAction2Props)(Logs);
