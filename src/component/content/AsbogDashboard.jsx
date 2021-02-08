import React, {Component} from 'react';
import {mapStateAndAction} from '../../store/storeUtils';
import FetcherTask from '../../util/FetcherTask';
import {fetchDashboardDataByPrefix} from '../../api/dashboard';
import {ActionSheet, Modal, Toast, WingBlank} from 'antd-mobile';
import SlotCard from '../commons/SlotCard';
import './AsbogDashboard.sass';
import {tare, tareWithValue} from '../../api/slot';

const FETCHER_DURATION = 1000;
const prefix = "S";
const prettySlotData = data => {
    const {slotData} = data;
    const res = [];
    for (const key in slotData) {
        if (!slotData.hasOwnProperty(key)) {
            continue;
        }
        const slot = slotData[key];
        res.push(slot);
    }
    return res.sort((a, b) => a.slotNo.localeCompare(b.slotNo));
};
const OPERATIONS = [
    '预置皮重',
    '手动去皮',
    '货道清零',
    '单重取样',
    '货道校准',
    '取消',
];

class AsbogDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slotData: [],
        };
    }

    componentDidMount() {
        this.props.showHeader(false);
        this.props.setTabBarState(false);
        this.startFetchData();
    }

    startFetchData() {
        if (this.dataFetcher) {
            this.dataFetcher.stop();
        }
        const _this = this;
        this.dataFetcher = new FetcherTask({
            fetchData() {
                return fetchDashboardDataByPrefix(prefix);
            },
            onNewData(data) {
                const slotData = prettySlotData(data);
                _this.setState({slotData: slotData});
            },
            duration: FETCHER_DURATION,
            onError(err) {
                console.log(err);
            }
        });
        this.dataFetcher.start();
    }

    showSlotOperations(slot) {
        ActionSheet.showActionSheetWithOptions({
            title: '操作',
            options: OPERATIONS,
            cancelButtonIndex: OPERATIONS.length - 1,
        }, key => {
            switch (key) {
                case 0:
                    this.tareWithValue(slot);
                    break;
                case 1:
                    this.tare(slot);
                    break;
                default:
                // Do nothing
            }
        })
    }

    tare(slot) {
        Modal.alert('确认去皮', '确认去皮？', [{text: '取消'}, {
            text: '确认', onPress() {
                tare(slot.id).then(res => {
                    Toast.show(`货道[${slot.slotNo}]去皮成功`, 3, false);
                });
            }
        }]);
    }

    tareWithValue(slot) {
        Modal.prompt('预置皮重', '请输入皮重', tare => {
            if (!tare || !/^\d+\.?\d*$/.test(tare)) {
                Toast.show('请输入合法的重量数据', 3, false);
                return;
            }
            tareWithValue({
                id: slot.id,
                tareValue: tare,
            }).then(res => {
                Toast.show(`货道${res.slotNo}预置皮重成功`, 3, false);
            });
        });
    }

    render() {
        const {slotData} = this.state;
        return (
            <div className="asbog-dashboard">
                <WingBlank className="slots-wrapper">
                    {
                        slotData.map(slot => (
                            <SlotCard key={slot.id}
                                      slot={slot}
                                      onClick={slot => this.showSlotOperations(slot)}
                                      highLight={false}
                                      errorOnly={false}/>))
                    }
                </WingBlank>
            </div>
        );
    }
}

export default mapStateAndAction(AsbogDashboard);
