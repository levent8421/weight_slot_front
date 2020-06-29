import React, {Component} from 'react';
import {Icon, NavBar} from "antd-mobile";
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
    render() {
        const {title} = this.props;
        return (
            <div className="appHeader">
                <NavBar
                    leftContent={<Icon type="left" onClick={() => this.onBackClick()}/>}
                    rightContent={<Icon type="ellipsis"/>}
                    mode="light"
                >{title}</NavBar>
            </div>
        );
    }

    onBackClick() {
        this.props.history.goBack();
    }
}

export default withRouter(connect(mapState2Props)(AppHeader));
