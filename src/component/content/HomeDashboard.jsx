import React, {Component} from 'react';
import {mapStateAndAction} from '../../store/storeUtils';
import './HomeDashboard.sass';
import SlotGroup from '../commons/SlotGroup';
import {NoticeBar, SearchBar, Toast, WingBlank} from 'antd-mobile';
import {ScanOutlined} from '@ant-design/icons';
import {highlightBySku} from '../../api/slot';
import {fetchDashboardData} from '../../api/dashboard';
import {groupSlots, lastHighlightSlot} from '../../util/DataConvertor';
import FetcherTask from '../../util/FetcherTask';
import TempSensorCard from '../commons/TempSensorCard';

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
    if (!sensors) {
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

class HomeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            highlightSlotTable: {},
            noticeSlot: null,
            groupedSlots: [],
            tempSensors: [],
        };
    }

    componentDidMount() {
        const {setTitle, setTabBarState, showHeader} = this.props;
        setTitle('数据看板');
        setTabBarState(false);
        showHeader(false);
        this.initFetcher();
    }

    componentWillUnmount() {
        if (this.fetcherTask) {
            this.fetcherTask.stop();
        }
    }

    initFetcher() {
        const _this = this;
        this.fetcherTask = new FetcherTask({
            fetchData: fetchDashboardData,
            onNewData(data) {
                _this.onDashboardDataRefresh(data);
            },
            duration: 1000,
        });
        this.fetcherTask.start();
    }

    onDashboardDataRefresh(data) {
        const {slotData, temperatureHumidityData} = data;
        const groupedSlots = groupSlots(dict2List(slotData));
        const tempSensors = dict2List(temperatureHumidityData);
        this.setState({
            groupedSlots,
            tempSensors,
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

    render() {
        const {searchValue, noticeSlot, groupedSlots, tempSensors} = this.state;
        return (
            <div className="home-dashboard">
                <div className="tabs">
                    <div className="item">
                        <div className="text">看板</div>
                        <div className="focus"/>
                    </div>
                    <div className="item">
                        <div className="text">配置</div>
                        <div className="focus"/>
                    </div>
                </div>
                <SearchBar value={searchValue}
                           placeholder="请输入搜索的SKU号或扫描二维码"
                           onSubmit={text => this.searchSku(text)}
                           onChange={text => this.setState({searchValue: text})}/>
                {
                    renderNoticeBar(noticeSlot)
                }
                <WingBlank className="slots">
                    {
                        groupedSlots.map(group => <SlotGroup group={group} key={group.name}/>)
                    }
                </WingBlank>
                <WingBlank className="temp-sensors">
                    {
                        renderTempSensors(tempSensors)
                    }
                </WingBlank>
                <div className="blank">-</div>
            </div>
        );
    }
}

export default mapStateAndAction(HomeDashboard);
