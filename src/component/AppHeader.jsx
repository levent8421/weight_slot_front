import React, {Component} from 'react';
import {Icon, NavBar, Popover} from "antd-mobile";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import './AppHeader.sass';

const mapState2Props = (state, props) => {
    return {
        ...props,
        title: state.globalTitle,
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
            default:
                break;
        }
        this.setState({
            popoverVisible: false
        });
    }
}

export default withRouter(connect(mapState2Props)(AppHeader));
