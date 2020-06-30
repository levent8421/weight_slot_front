import React, {Component} from 'react';
import {Flex, Icon, List, WhiteSpace} from "antd-mobile";
import {withRouter} from 'react-router-dom';
import {setTabBarState, setTitle} from "../../../store/actionCreators";
import {connect} from 'react-redux';

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
        setTabBarState: (...args) => dispatch(setTabBarState(...args)),
    };
};

class SettingMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.props.setTitle('Setting');
    }

    componentDidMount() {
        this.props.setTabBarState(true);
    }

    render() {
        return (
            <div className="setting">
                <List renderHeader={() => 'Settings:'}>
                    <List.Item onClick={() => this.go('/setting/sensor')}>
                        <WhiteSpace/>
                        <Flex justify="between">
                            <span>Sensors</span>
                            <Icon type="right"/>
                        </Flex>
                        <WhiteSpace/>
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/slot')}>
                        <WhiteSpace/>
                        <Flex justify="between">
                            <span>Slots</span>
                            <Icon type="right"/>
                        </Flex>
                        <WhiteSpace/>
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/connection')}>
                        <WhiteSpace/>
                        <Flex justify="between">
                            <span>Connections</span>
                            <Icon type="right"/>
                        </Flex>
                        <WhiteSpace/>
                    </List.Item>
                    <List.Item onClick={() => this.go('/setting/system')}>
                        <WhiteSpace/>
                        <Flex justify="between">
                            <span>System</span>
                            <Icon type="right"/>
                        </Flex>
                        <WhiteSpace/>
                    </List.Item>
                </List>
            </div>
        );
    }

    go(path) {
        this.props.history.push({
            pathname: path
        });
    }
}

export default withRouter(connect(null, mapAction2Props)(SettingMenu));
