import React, {Component} from 'react';
import {Button, InputItem, List, Toast} from "antd-mobile";
import {setTitle} from '../../store/actionCreators';
import {connect} from 'react-redux';
import './Address.sass';

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args))
    }
};

class Address extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.props.setTitle('设备编址');
    }

    render() {
        return (
            <div className="address">
                <List renderHeader={() => '编址'}>
                    <InputItem>设备SN</InputItem>
                    <InputItem>地址</InputItem>
                    <List.Item>
                        <Button type="primary">编址</Button>
                    </List.Item>
                </List>
            </div>
        );
    }

    componentDidMount() {
        Toast.info('开发中', 1, null, false);
    }
}

export default connect(null, mapAction2Props)(Address);
