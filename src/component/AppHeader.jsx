import React, {Component} from 'react';
import {Icon, Modal, NavBar, Popover, Toast} from "antd-mobile";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import './AppHeader.sass';
import {reloadSensors} from "../api/sensor";

const mapState2Props = (state, props) => {
    return {
        ...props,
        title: state.globalTitle,
        showHeader: state.showHeader,
    };
};

class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popoverVisible: false
        };
    }

    render() {
        if (!this.props.showHeader) {
            return null;
        }
        const {title} = this.props;
        return (
            <div className="appHeader">
                <NavBar
                    leftContent={<Icon type="left" onClick={() => this.onBackClick()}/>}
                    rightContent={this.rightContent()}
                    mode="light"
                >{title}</NavBar>
            </div>
        );
    }

    rightContent() {
        const {popoverVisible} = this.state;
        const Item = Popover.Item;
        return (<Popover mask
                         visible={popoverVisible}
                         overlay={[
                             (<Item key="about" value="about"
                                    data-seed="logId">About</Item>),
                             (<Item key="settings" value="settings"
                                    style={{whiteSpace: 'nowrap'}}>Settings</Item>),
                             (<Item key="reload" value="reload"
                                    style={{whiteSpace: 'nowrap'}}>Reload</Item>),
                         ]}
                         onSelect={e => this.onPopoverSelect(e)}
        >
            <Icon type="ellipsis"/>
        </Popover>);
    }

    onBackClick() {
        this.props.history.goBack();
    }

    onPopoverSelect(e) {
        switch (e.key) {
            case 'about':
                this.props.history.push({
                    pathname: '/about',
                });
                break;
            case 'settings':
                this.props.history.push({
                    pathname: '/setting/',
                });
                break;
            case 'reload':
                this.doReloadSensors();
                break;
            default:
                break;
        }
        this.setState({
            popoverVisible: false
        });
    }

    doReloadSensors() {
        Modal.alert('Reload Sensors', 'Reload sensors from database into weightService',
            [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        reloadSensors().then(() => {
                            Toast.show('Reload Success!');
                        });
                    },
                },
            ]);
    }
}

export default withRouter(connect(mapState2Props)(AppHeader));
