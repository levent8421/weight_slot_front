import React from 'react'
import {TabBar} from 'antd-mobile'
import {connect} from 'react-redux';
import './AppTabBar.sass'
import {withRouter} from 'react-router-dom';
import {CodeSandboxCircleFilled as ExtraIcon} from '@ant-design/icons';

const mapStateToProps = (state, props) => {
    return {
        ...props,
        showTabBar: state.showTabBar,
        enableTabBar: state.enableTabBar,
    };
};

class AppTabBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: '/',
        };
    }

    render() {
        const showTabBar = this.props.showTabBar && this.props.enableTabBar;
        const {path} = this.state;
        if (showTabBar) {
            return (
                <div className="appTabBar">
                    <TabBar
                        unselectedTintColor="#949494"
                        tintColor="#33A3F4"
                        barTintColor="white"
                        hidden={!this.props.showTabBar}
                        tabBarPosition="bottom">
                        <TabBar.Item title="看板"
                                     selected={path === '/'}
                                     icon={<i className="iconfont buttonIcon">&#xe64e;</i>}
                                     selectedIcon={<i className="iconfont buttonIcon buttonIconChecked">&#xe64e;</i>}
                                     onPress={() => this.pushPath('/')}/>
                        <TabBar.Item title="扩展"
                                     selected={path === '/extra'}
                                     icon={<ExtraIcon className="buttonIcon"/>}
                                     selectedIcon={<i className="iconfont buttonIcon buttonIconChecked">&#xe60c;</i>}
                                     onPress={() => this.pushPath('/extra')}/>
                        {/*<TabBar.Item title="日志"
                                     selected={path === '/logs'}
                                     icon={<i className="iconfont buttonIcon">&#xe60c;</i>}
                                     selectedIcon={<i className="iconfont buttonIcon buttonIconChecked">&#xe60c;</i>}
                                     onPress={() => this.pushPath('/logs')}/>*/}
                        {/*<TabBar.Item title="编址"
                                     selected={path === '/address'}
                                     icon={<i className="iconfont buttonIcon">&#xe61b;</i>}
                                     selectedIcon={<i className="iconfont buttonIcon buttonIconChecked">&#xe61b;</i>}
                                     onPress={() => this.pushPath('/address')}/>*/}
                        <TabBar.Item title="设置"
                                     selected={path === '/setting'}
                                     icon={<i className="iconfont buttonIcon">&#xe660;</i>}
                                     selectedIcon={<i className="iconfont buttonIcon buttonIconChecked">&#xe660;</i>}
                                     onPress={() => this.pushPath('/setting')}/>
                    </TabBar>
                </div>)
        } else {
            return null;
        }
    }

    pushPath(path) {
        this.setState({
            path,
        });
        this.props.history.push({
            pathname: path,
        })
    }
}

export default withRouter(connect(mapStateToProps)(AppTabBar));
