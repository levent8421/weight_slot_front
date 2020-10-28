import React, {Component} from 'react';
import {asyncFetchDashboardSlotData, setTabBarState, setTitle, showHeader} from '../../store/actionCreators';
import {connect} from 'react-redux';
import './Dashboard.sass'
import {Flex, List, Modal, NoticeBar, SearchBar, Tabs, Toast, WingBlank} from 'antd-mobile';
import {
    asCount,
    asKg,
    asStateString,
    groupSlots,
    isDisable,
    isIncredible,
    isOffline,
    isWan,
    thSensorStateText,
    thSensorStateWarn,
} from '../../util/DataConvertor';
import {highlightBySku, zeroOne} from '../../api/slot';
import {withRouter} from 'react-router-dom';
import {fetchDashboardData} from "../../api/dashboard";
import {parseDate} from '../../util/datetimeUtils';

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
const findLastNoticeSlot = slots => {
    let lastTime = 0;
    let res = null;
    for (let slot of slots) {
        const ts = parseDate(slot.updateTime);
        if (ts > lastTime) {
            lastTime = ts;
            res = slot;
        }
    }
    return res;
};

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.rootEle = document;
        this.state = {
            slots: [],
            groupedSlots: [],
            thSensors: [],
            sensors: [],
            sensorModalVisible: false,
            operationSlot: {},
            searchSkuNo: '',
            noticeSlots: [],
            lastNoticeSlot: null,
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
        });
    }

    componentWillUnmount() {
        if (this.fetchTimer) {
            clearInterval(this.fetchTimer);
        }
        this.props.showHeader(true);
        this.props.showTabBar(true);
        this.cancelKeyPress();
    }

    cancelKeyPress() {
        this.rootEle.onkeypress = null;
    }

    startFetchData() {
        this.fetchTimer = setInterval(() => {
            fetchDashboardData().then(res => {
                const slotData = res.slotData;
                const thData = res.temperatureHumidityData;
                const slots = [];
                const thSensors = [];
                for (let slotNo in slotData) {
                    if (slotData.hasOwnProperty(slotNo)) {
                        slots.push(slotData[slotNo]);
                    }
                }
                for (let id in thData) {
                    if (thData.hasOwnProperty(id)) {
                        thSensors.push(thData[id]);
                    }
                }
                const groupedSlots = groupSlots(slots);
                this.setState({
                    slots: slots,
                    thSensors: thSensors,
                    groupedSlots: groupedSlots,
                });
            });
        }, 1000);
    }

    renderThSensorCard(sensor) {
        const {data} = sensor;
        let {temperature, humidity} = data;
        temperature = temperature && temperature.toFixed(1);
        const tempStateText = thSensorStateText(data.temperatureState);
        const tempWarn = thSensorStateWarn(data.temperatureState);
        const humidityText = humidity && humidity.toFixed(1);
        const tempClass = ['value'];
        if (tempWarn) {
            tempClass.push('warn');
        } else {
            tempClass.push('ok');
        }

        return (<div className="th-card" key={sensor.id}>
            <div className="card-header">
                <div className="no">{sensor.no}</div>
                <div className="state"><span>{humidityText}%</span><span className="dot"/>使用中</div>
            </div>
            <div className="card-body">
                <div className="inner">
                    <div className="item">
                        <span className="name">温度:</span>
                        <span className={tempClass.join(' ')}>{temperature}°C</span>
                    </div>
                    <div className="delimiter"/>
                    <div className="item">
                        <span className="name">状态</span>
                        <span className={tempClass.join(' ')}>{tempStateText}</span>
                    </div>
                </div>
            </div>
        </div>);
    }

    renderThSensors() {
        const {thSensors} = this.state;
        return (<div className="th-sensor-group">
            <div className="title">温湿度传感器</div>
            <WingBlank className="sensors">
                {
                    thSensors.map(sensor => this.renderThSensorCard(sensor))
                }
            </WingBlank>
        </div>);
    }

    render() {
        const {lastNoticeSlot, searchSkuNo, noticeSlots, sensorModalVisible, operationSlot, sensors, groupedSlots} = this.state;
        this.highlightSlotIds = {};
        for (let slot of noticeSlots) {
            this.highlightSlotIds[slot.id] = true;
        }
        return (
            <div className="dashboard">
                <Tabs tabs={TabItems} onChange={(tab, index) => this.onTabChange(tab, index)}/>
                <SearchBar
                    value={searchSkuNo}
                    onSubmit={e => this.triggerHighlight(e)}
                    onChange={searchSkuNo => this.setState({searchSkuNo})}/>
                <div className="notice-list">
                    {
                        this.renderNoticeBar(lastNoticeSlot)
                    }
                </div>
                <div className="slot-groups">
                    {
                        groupedSlots.map(group => this.renderGroupItem(group))
                    }
                </div>
                <div className="th-sensors">
                    {
                        this.renderThSensors()
                    }
                </div>
                <Modal visible={sensorModalVisible}
                       title={`货道[${operationSlot.slotNo}]传感器`}
                       transparent
                       footer={[
                           {
                               text: '清零', onPress: () => this.doSlotZero(this.state.operationSlot)
                           },
                           {text: '关闭', onPress: () => this.setState({sensorModalVisible: false})},
                       ]}
                       onClose={() => this.setState({sensorModalVisible: false})}>
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
                <div className="clear-float"/>
                <div className="bottom-white">
                    留白
                </div>
            </div>
        );
    }

    renderNoticeBar(slot) {
        if (!slot) {
            return;
        }
        const content = [];
        content.push(<span key={0}>{slot.skuName}</span>);
        if (slot.skuShelfLifeOpenDays) {
            content.push(<span key={1}>，开封后保质期</span>);
            content.push((<span key={2} className="days">{slot.skuShelfLifeOpenDays}</span>));
            content.push(<span key={3}>天</span>);
        } else {
            content.push(<span key={1}>，开封后保质期未设置！</span>);
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
        const sensors = slot.sensors;
        if (!sensors) {
            return null;
        }
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
        const weightInKg = asKg(data.weight);
        const count = asCount(data);
        return (<div key={slot.id}
                     className={slotCardClassName}>
            <Flex className="card-header" justify="between">
                <div className="slot-no">
                    {slot.slotNo}
                </div>
                <div className="state">
                    <span className="weight">({weightInKg}kg)</span>
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
                <div className={`right ${incredible ? 'right-incredible' : ''}`}
                     onClick={() => this.onSlotCardClick(slot)}>
                    <span className="pcs-value">{count}</span>
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
            const lastNoticeSlot = findLastNoticeSlot(res);
            this.setState({
                noticeSlots: res,
                lastNoticeSlot: lastNoticeSlot,
            });
            setTimeout(() => this.setState({noticeSlots: [], searchSkuNo: '', lastNoticeSlot: null}), 5000);
        }).catch(err => {
            this.setState({
                searchSkuNo: '',
            });
            const {data} = err;
            Modal.alert(`无法查询物料:${data.code}`, `无法查询物料号[${skuNo}]!(${data.msg})`);
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

    doSlotZero(slot) {
        const {slotNo} = slot;
        Modal.alert(`清零${slotNo}?`, `确定清零货道[${slotNo}]?`, [
            {text: '取消'},
            {text: '确定', onPress: () => this.callDoZero(slotNo)}
        ])
    }

    callDoZero(slotNo) {
        zeroOne(slotNo).then(() => {
            Toast.show(`slot[${slotNo}] Zero success!`, 3, false);
        });
    }
}

const component = connect(mapState2Props, mapAction2Props)(Dashboard);
export default withRouter(component);
