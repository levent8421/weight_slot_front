import React from 'react'
import {Icon, TabBar} from 'antd-mobile'
import {connect} from 'react-redux';
import './AppTabBar.sass'
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state, props) => {
    return {
        ...props,
        showTabBar: state.showTabBar,
    };
};

class AppTabBar extends React.Component {
    render() {
        const showTabBar = this.props.showTabBar;
        if (showTabBar) {
            return (
                <div className="appTabBar">
                    <TabBar
                        unselectedTintColor="#949494"
                        tintColor="#33A3F4"
                        barTintColor="white"
                        hidden={!this.props.showTabBar}
                        tabBarPosition="bottom">
                        <TabBar.Item title="Dashboard" icon={<Icon type="check-circle"/>}
                                     onPress={() => this.pushPath('/')}/>
                        <TabBar.Item title="Logs" icon={<Icon type="check-circle"/>}
                                     onPress={() => this.pushPath('/logs')}/>
                        <TabBar.Item title="Address" icon={<Icon type="check-circle"/>}
                                     onPress={() => this.pushPath('/address')}/>
                        <TabBar.Item title="Setting" icon={<Icon type="check-circle"/>}
                                     onPress={() => this.pushPath('/setting')}/>
                    </TabBar>
                </div>)
        } else {
            return null;
        }
    }

    pushPath(path) {
        this.props.history.push({
            pathname: path,
        })
    }
}

export default withRouter(connect(mapStateToProps)(AppTabBar));
