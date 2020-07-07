import React, {Component} from 'react';
import {asyncFetchDashboardSlotData, setTitle} from '../../store/actionCreators';
import {connect} from 'react-redux';
import './Dashboard.sass'
import {Card, Flex, List, Modal, NoticeBar, SearchBar, Toast, WhiteSpace, WingBlank} from 'antd-mobile';
import {asConnectionType, asKg, isStable, isWarn} from '../../util/DataConvertor';
import {highlightBySku} from '../../api/slot';

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
    };
};

class Dashboard extends Component {
    constructor(props) {
        super(props);
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
        this.searchBarFocus();
        this.startFetchData();
    }

    componentWillUnmount() {
        clearInterval(this.fetchTimer);
    }

    startFetchData() {
        this.props.fetchSlotData();
        this.fetchTimer = setInterval(() => {
            this.props.fetchSlotData();
        }, 1000);
    }

    searchBarFocus() {
        this.searchBar.focus();
    }

    render() {
        const _this = this;
        const slots = this.props.slots;
        const {sensors, operationSlot, sensorModalVisible, searchSkuNo, noticeSlots} = this.state;
        return (
            <div className="dashboard" onClick={() => this.searchBarFocus()}>
                <SearchBar
                    value={searchSkuNo}
                    onSubmit={e => this.triggerHighlight(e)}
                    ref={ref => this.searchBar = ref}
                    onBlur={() => this.searchBarFocus()}
                    onChange={searchSkuNo => this.setState({searchSkuNo})}/>
                {
                    noticeSlots.map(slot =>
                        <NoticeBar key={slot.id}
                                   marqueeProps={{loop: true,}}>
                            {slot.slotNo}:{slot.skuName},请在开封后{slot.skuShelfLifeOpenDays}天使用
                        </NoticeBar>)
                }
                <WhiteSpace/>
                <WingBlank>
                    <Flex wrap="wrap" justify="between">
                        {
                            slots.map(_this.renderSlotCard)
                        }
                    </Flex>
                </WingBlank>
                <Modal visible={sensorModalVisible}
                       title={`${operationSlot.slotNo} Sensors`}
                       maskClosable={true}
                       transparent
                       footer={[{text: 'OK', onPress: () => this.setState({sensorModalVisible: false})}]}>
                    <List>
                        {
                            sensors.map(sensor => (<List.Item key={sensor.id}>
                                <Card className={isWarn(sensor.state) ? 'warnBg' : ''}>
                                    <Card.Header title={sensor.deviceSn} extra={sensor.address485}/>
                                    <Card.Body>
                                        <Flex justify="center">
                                            <Flex.Item>{asConnectionType(sensor.connection.type)}:</Flex.Item>
                                            <Flex.Item>{sensor.connection.target}</Flex.Item>
                                        </Flex>
                                        <Flex justify="between">
                                            <Flex.Item>State:</Flex.Item>
                                            <Flex.Item>{sensor.state}</Flex.Item>
                                        </Flex>
                                    </Card.Body>
                                </Card>
                            </List.Item>))
                        }
                    </List>
                </Modal>
            </div>
        );
    }

    renderSlotCard(slot) {
        const sku = slot.sku || {};
        const data = slot.data || {};
        const warn = isWarn(slot);
        const stable = isStable(slot.data && slot.data.weightState);
        let highlight = false;
        for (const s of this.state.noticeSlots) {
            if (s.id === slot.id) {
                highlight = true;
                break;
            }
        }
        return (<Card
            className={`slotCard ${warn ? 'warnBg' : ''} ${highlight ? 'highlight' : ''}`}
            onClick={() => this.onSlotCardClick(slot)}
            key={slot.id}
            full={true}>
            <Card.Header
                title={sku.name}
            >
            </Card.Header>
            <Card.Body>
                <Flex className="labelLine" justify="between">
                    <span className="pcsTitle">PCS</span>
                    <span className="slotNo">{slot.slotNo}</span>
                </Flex>
                <div className={`pcsValue ${warn ? 'warnText' : ''}`}>
                    {data.count}
                </div>
                <div className={`weightValue ${warn ? 'warnText' : ''}`}>
                    {stable ? '' : '~'}{asKg(data.weight)}kg
                </div>
            </Card.Body>
            <Card.Footer extra={sku.skuNo}/>
        </Card>)
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
}

export default connect(mapState2Props, mapAction2Props)(Dashboard);
