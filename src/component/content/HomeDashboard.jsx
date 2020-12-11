import React, {Component} from 'react';
import {mapStateAndAction} from '../../store/storeUtils';
import './HomeDashboard.sass';
import SlotGroup from '../commons/SlotGroup';
import {NoticeBar, SearchBar, Toast, WingBlank} from 'antd-mobile';
import {ScanOutlined, WarningOutlined} from '@ant-design/icons';
import {highlightBySku} from '../../api/slot';
import {fetchDashboardData} from '../../api/dashboard';
import {groupSlots, lastHighlightSlot} from '../../util/DataConvertor';
import FetcherTask from '../../util/FetcherTask';
import TempSensorCard from '../commons/TempSensorCard';
import SlotOperationModal from '../commons/SlotOperationModal';

const SEARCH_NOTICE_BAR_AUTO_CLEAN_DURATION = 5000;
const asHighlightSlotTable = slots => {
    const res = {};
    for (let slot of slots) {
        res[slot.id] = slot;
    }
    return res;
};
const renderNoticeBar = slot => {
    if (!slot) {
        return;
    }
    const msg = [];
    const {skuName, skuShelfLifeOpenDays} = slot;
    msg.push(<span key={1}>{skuName}</span>);
    if (skuShelfLifeOpenDays) {
        msg.push(
            <span key={2}>
                ，开封后保质期
                <b className="days">{skuShelfLifeOpenDays}</b>
                天
            </span>
        );
    }
    return (<NoticeBar
        className="search-notice"
        icon={<ScanOutlined/>}>
        {
            msg
        }
    </NoticeBar>);
};

const dict2List = dict => {
    const res = [];
    for (let key in dict) {
        if (dict.hasOwnProperty(key)) {
            res.push(dict[key]);
        }
    }
    return res;
};

const renderTempSensors = sensors => {
    if (!sensors || sensors.length <= 0) {
        return null;
    }
    return (<>
        <p className="group-name">温湿度传感器</p>
        <div className="sensors">
            {
                sensors.map(sensor => (<TempSensorCard sensor={sensor} key={sensor.id}/>))
            }
        </div>
    </>);
};
const SETTING_PAGE_DELAY = 500;
const ENTER_CHAR_CODE = 13;

class HomeDashboard extends Component {
    constructor(props) {
        super(props);
        this.rootDom = document;
        this.state = {
            searchValue: '',
            highlightSlotTable: {},
            noticeSlot: null,
            groupedSlots: [],
            tempSensors: [],
            currentTab: 0,
            slotOperationVisible: false,
            selectedSlot: {},
            errorNotice: null,
            showErrorOnly: false,
        };
    }

    componentDidMount() {
        const {setTitle, setTabBarState, showHeader} = this.props;
        setTitle('数据看板');
        setTabBarState(false);
        showHeader(false);
        this.initFetcher();
        this.registerKeyPressHandler();
    }

    componentWillUnmount() {
        if (this.fetcherTask) {
            this.fetcherTask.stop();
        }
        this.cancelKeyPressHandler();
    }

    cancelKeyPressHandler() {
        this.rootDom.onkeypress = null;
    }

    registerKeyPressHandler() {
        const _this = this;
        this.rootDom.onkeypress = e => {
            const {tagName} = e.target;
            if (tagName.toLowerCase() !== 'body') {
                return;
            }
            const {keyCode} = e;
            if (keyCode === ENTER_CHAR_CODE) {
                _this.submitSearch();
                return;
            }
            const char = String.fromCharCode(keyCode);
            const {searchValue} = _this.state;
            _this.setState({
                searchValue: searchValue + char,
            });
        };
    }

    submitSearch() {
        const {searchValue} = this.state;
        this.searchSku(searchValue);
    }

    initFetcher() {
        const _this = this;
        this.fetcherTask = new FetcherTask({
            fetchData: fetchDashboardData,
            onNewData(data) {
                _this.onDashboardDataRefresh(data);
            },
            duration: 1000,
            onError(err) {
                _this.onFetcherError(err);
            }
        });
        this.fetcherTask.start();
    }

    onFetcherError(err) {
        console.error('Error on fetch dashboard data!', err);
        this.setState({errorNotice: err.toString()})
    }

    onDashboardDataRefresh(data) {
        const {slotData, temperatureHumidityData} = data;
        const groupedSlots = groupSlots(dict2List(slotData));
        const tempSensors = dict2List(temperatureHumidityData);
        this.setState({
            groupedSlots,
            tempSensors,
            errorNotice: null,
        });
    }

    searchSku(skuNo) {
        if (!skuNo || !skuNo.trim()) {
            Toast.show('请输入SKU', 1, false);
            return;
        }
        this.setState({searchValue: ''});
        highlightBySku(skuNo).then(res => {
            this.setState({
                highlightSlotTable: asHighlightSlotTable(res),
                noticeSlot: lastHighlightSlot(res),
            });
            setTimeout(() => {
                this.setState({
                    highlightSlotTable: {},
                    noticeSlot: null,
                });
            }, SEARCH_NOTICE_BAR_AUTO_CLEAN_DURATION);
        });
    }

    switchPageWithDelay(path) {
        this.setState({currentTab: 1});
        Toast.loading('跳转中', 1, null, true);
        const {history} = this.props;
        setTimeout(() => {
            history.push({
                pathname: path,
            });
        }, SETTING_PAGE_DELAY);
    }

    onSlotCardClick(slot) {
        this.setState({
            selectedSlot: slot,
            slotOperationVisible: true,
        })
    }

    renderErrorNotice() {
        const {errorNotice} = this.state;
        if (!errorNotice) {
            return null;
        }
        return (<NoticeBar icon={<WarningOutlined/>}>
            {errorNotice}
        </NoticeBar>)
    }

    renderSlotOperationModal() {
        const {slotOperationVisible, selectedSlot} = this.state;
        if (!slotOperationVisible) {
            return null;
        }
        return (<SlotOperationModal
            slot={selectedSlot}
            onClose={() => this.setState({slotOperationVisible: false})}/>);
    }

    renderTabs() {
        const {currentTab} = this.state;
        const tab0Class = ['item'];
        const tab1Class = ['item'];
        const tab2Class = ['item'];
        const tabsClass = [tab0Class, tab1Class, tab2Class];
        tabsClass[currentTab].push('item-focus');
        return (<div className="tabs-wrapper">
            <div className="tabs">
                <div className={tab0Class.join(' ')}
                     onClick={() => this.setState({currentTab: 0, showErrorOnly: false,})}>
                    <div className="text">重力货道数据</div>
                    <div className="focus"/>
                </div>
                <div className={tab1Class.join(' ')} onClick={() => this.switchPageWithDelay('/setting/')}>
                    <div className="text">重力货道配置</div>
                    <div className="focus"/>
                </div>
                <div className={tab2Class.join(' ')}
                     onClick={() => this.setState({currentTab: 2, showErrorOnly: true})}>
                    <div className="text">异常货道排查</div>
                    <div className="focus"/>
                </div>
            </div>
        </div>);
    }

    render() {
        const {searchValue, noticeSlot, groupedSlots, tempSensors, highlightSlotTable, showErrorOnly} = this.state;
        return (
            <div className="home-dashboard">
                {
                    this.renderErrorNotice()
                }
                {
                    this.renderTabs()
                }
                <SearchBar value={searchValue}
                           placeholder="请输入搜索的SKU号或扫描二维码"
                           onSubmit={text => this.searchSku(text)}
                           onChange={text => this.setState({searchValue: text})}/>
                {
                    renderNoticeBar(noticeSlot)
                }
                <WingBlank className="slots">
                    {
                        groupedSlots.map(group => <SlotGroup group={group}
                                                             highlightSlotTable={highlightSlotTable}
                                                             onCardClick={slot => this.onSlotCardClick(slot)}
                                                             key={group.name}
                                                             errorOnly={showErrorOnly}/>)
                    }
                </WingBlank>
                <WingBlank className="temp-sensors">
                    {
                        renderTempSensors(tempSensors)
                    }
                </WingBlank>
                <div className="blank">-</div>
                {
                    this.renderSlotOperationModal()
                }
            </div>
        );
    }
}

export default mapStateAndAction(HomeDashboard);
