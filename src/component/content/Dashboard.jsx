import React, {Component} from 'react';
import {asyncFetchDashboardSlotData, setTabBarState, setTitle, showHeader} from '../../store/actionCreators';
import {connect} from 'react-redux';
import './Dashboard.sass'
import {Flex, List, Modal, NoticeBar, SearchBar, Tabs, Toast, WingBlank} from 'antd-mobile';
import {asStateString, groupSlots, isDisable, isIncredible, isOffline, isWan} from '../../util/DataConvertor';
import {highlightBySku} from '../../api/slot';
import {withRouter} from 'react-router-dom';

const mapState2Props = (state, props) => {
    return {
        ...props,
        slots: state.dashboardSlots
    };
};
const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        fetchSlotData: (...args) => dispatch(asyncFetchDashboardSlotData(...args)),
        setTitle: (...args) => dispatch(setTitle(...args)),
        showHeader: (...args) => dispatch(showHeader(...args)),
        showTabBar: (...args) => dispatch(setTabBarState(...args)),
    };
};

const TabItems = [
    {
        title: '重力货道数据',
        key: 'dashboard',
    },
    {
        title: '重力货道配置',
        key: 'settings',
    }
];

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.rootEle = document;
        this.state = {
            sensors: [],
            sensorModalVisible: false,
            operationSlot: {},
            searchSkuNo: '',
            noticeSlots: [],
        };
        this.props.setTitle('Dashboard');
        this.renderSlotCard = this.renderSlotCard.bind(this);
    }

    componentDidMount() {
        this.startFetchData();
        this.props.showHeader(false);
        this.props.showTabBar(false);
        this.listenKeyPress();
    }

    listenKeyPress() {
        this.rootEle.onkeypress = e => {
            const sourceTagName = e.target.tagName.toLowerCase();
            if (sourceTagName !== 'body') {
                return;
            }
            const keyCode = e.keyCode;
            if (keyCode === 13) {
                this.triggerHighlight(this.state.searchSkuNo);
            } else {
                this.appendSearchSku(String.fromCharCode(keyCode));
            }
        };
    }

    appendSearchSku(c) {
        const {searchSkuNo} = this.state;
        this.setState({
            searchSkuNo: searchSkuNo + c,
        })
    }

    componentWillUnmount() {
        clearInterval(this.fetchTimer);
        this.props.showHeader(true);
        this.props.showTabBar(true);
        this.cancelKeyPress();
    }

    cancelKeyPress() {
        this.rootEle.onkeypress = null;
    }

    startFetchData() {
        this.props.fetchSlotData();
        this.fetchTimer = setInterval(() => {
            this.props.fetchSlotData();
        }, 1000);
    }

    render() {
        const slots = this.props.slots;
        const {searchSkuNo, noticeSlots, sensorModalVisible, operationSlot, sensors} = this.state;
        const groupedSlots = groupSlots(slots);
        this.highlightSlotIds = {};
        for (let slot of noticeSlots) {
            this.highlightSlotIds[slot.id] = true;
        }
        const firstNoticeSlot = noticeSlots ? noticeSlots[0] : null;
        return (
            <div className="dashboard">
                <Tabs tabs={TabItems} onChange={(tab, index) => this.onTabChange(tab, index)}/>
                <SearchBar
                    value={searchSkuNo}
                    onSubmit={e => this.triggerHighlight(e)}
                    onChange={searchSkuNo => this.setState({searchSkuNo})}/>
                <div className="notice-list">
                    {
                        this.renderNoticeBar(firstNoticeSlot)
                    }
                </div>
                <div className="slot-groups">
                    {
                        groupedSlots.map(group => this.renderGroupItem(group))
                    }
                </div>
                <Modal visible={sensorModalVisible}
                       title={`Sensors for ${operationSlot.slotNo}`}
                       transparent
                       maskClosable={true}
                       footer={[{text: 'OK', onPress: () => this.setState({sensorModalVisible: false})}]}>
                    <List renderHeader={() => 'Sensors'}>
                        {
                            sensors ? sensors.map(sensor => (<List.Item
                                    extra={asStateString(sensor.state)}
                                    key={sensor.id}>
                                    {sensor.deviceSn}
                                    <List.Item.Brief>{sensor.address485}</List.Item.Brief>
                                </List.Item>)) :
                                <List.Item>Empty List</List.Item>
                        }
                    </List>
                </Modal>
            </div>
        );
    }

    renderNoticeBar(slot) {
        if (!slot) {
            return;
        }
        const content = [];
        content.push(slot.skuName);
        if (slot.skuShelfLifeOpenDays) {
            content.push('，开封后保质期');
            content.push((<span className="days">{slot.skuShelfLifeOpenDays}</span>));
            content.push('天');
        } else {
            content.push('，开封后保质期未设置！');
        }
        return (<NoticeBar className="notice">
            {content}
        </NoticeBar>)
    }

    renderGroupItem(group) {
        return (<div className="group-item" key={group.name}>
            <p className="group-name">
                {group.name}
            </p>
            <WingBlank>
                <Flex className="slots" wrap={"wrap"} justify="between">
                    {
                        group.slots.map(slot => this.renderSlotCard(slot))
                    }
                </Flex>
            </WingBlank>
        </div>)
    }

    renderSlotCard(slot) {
        const sku = slot.sku || {};
        const data = slot.data || {};
        let slotCardClassName = 'slot-card';
        if (slot.id in this.highlightSlotIds) {
            slotCardClassName += ' slot-card-highlight';
        } else {
            if (isWan(slot.state)) {
                if (isDisable(slot.state)) {
                    slotCardClassName += ' slot-card-disable';
                } else if (isOffline(slot.state)) {
                    slotCardClassName += ' slot-card-offline';
                } else {
                    slotCardClassName += ' slot-card-warn';
                }
            }
        }
        const incredible = isIncredible(data.toleranceState);
        const state = asStateString(slot.state);
        return (<div key={slot.id}
                     className={slotCardClassName}
                     onClick={() => this.onSlotCardClick(slot)}>
            <Flex className="card-header" justify="between">
                <div className="slot-no">
                    {slot.slotNo}
                </div>
                <div className="state">
                    <span className="dot"/>
                    <span>{state}</span>
                </div>
            </Flex>
            <Flex className="card-body" justify="between">
                <div className="left">
                    <div className="sku-no">SKU:{sku.skuNo}</div>
                    <div className="sku-name">{sku.name}</div>
                </div>
                <div className="delimiter"/>
                <div className={`right ${incredible ? 'right-incredible' : ''}`}>
                    <span className="pcs-value">{data.count}</span>
                    <span className="pcs-unit">(数量)</span>
                </div>
            </Flex>
        </div>);
    }

    onSlotCardClick(slot) {
        this.setState({
            operationSlot: slot,
            sensors: slot.sensors,
            sensorModalVisible: true,
        });
    }

    triggerHighlight(skuNo) {
        if (skuNo === '' || skuNo.trim() === '') {
            Toast.show('Please Type a SkuNo!', 1, false);
            return;
        }
        highlightBySku(skuNo).then(res => {
            this.setState({
                noticeSlots: res
            });
            setTimeout(() => this.setState({noticeSlots: [], searchSkuNo: '',}), 5000);
        }).catch(() => {
            this.setState({
                searchSkuNo: '',
            });
        });
    }

    onTabChange(tab, index) {
        switch (index) {
            case 0:
                // dashboard
                this.props.history.push({
                    pathname: '/dashboard'
                });
                break;
            case 1:
                // settings
                this.props.history.push({
                    pathname: '/setting/'
                });
                break;
            default:
                break;
        }
    }
}

const component = connect(mapState2Props, mapAction2Props)(Dashboard);
export default withRouter(component);
