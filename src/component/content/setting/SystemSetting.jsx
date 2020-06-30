import React, {Component} from 'react';
import {Button, List, Toast} from 'antd-mobile';
import {setTitle} from '../../../store/actionCreators';
import {connect} from 'react-redux';
import {fetchSystemInfo} from '../../../api/dashboard';

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
    };
};

class SystemSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            systemInfo: {},
            killButtonState: true
        };
    }

    componentDidMount() {
        this.props.setTitle('System Infos');
        fetchSystemInfo().then(res => {
            this.setState({
                systemInfo: res,
            })
        });
    }

    render() {
        const {Item} = List;
        const {systemInfo} = this.state;
        return (
            <div className="systemSettings">
                <List renderHeader={() => 'System Infos'}>
                    <Item key="appName" extra={systemInfo.appName}>APPName</Item>
                    <Item key="appVersion" extra={systemInfo.appVersion}>APPVersion</Item>
                    <Item key="dbVersion" extra={systemInfo.dbVersion}>DBVersion</Item>
                    <Item key="pid" extra={systemInfo.pid}>ProcessID</Item>
                    <Item key="kill">
                        <Button type="warning" onClick={() => this.killProcess()}
                                disabled={!this.state.killButtonState}>Kill Process</Button>
                    </Item>
                </List>
            </div>
        );
    }

    killProcess() {
        Toast.show('Do not kill this process!', 1, false);
        this.setState({
            killButtonState: false
        });
    }
}

export default connect(null, mapAction2Props)(SystemSetting);
