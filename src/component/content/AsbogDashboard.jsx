import React, {Component} from 'react';
import {mapStateAndAction} from '../../store/storeUtils';
import FetcherTask from '../../util/FetcherTask';
import {fetchDashboardDataByPrefix} from '../../api/dashboard';
import {ActionSheet, InputItem, Modal, Steps, Toast, WingBlank} from 'antd-mobile';
import SlotCard from '../commons/SlotCard';
import './AsbogDashboard.sass';
import {tare, tareWithValue, zeroOne} from '../../api/slot';
import {calibrateWithSpan, calibrateZero} from '../../api/sensor';

const FETCHER_DURATION = 1000;
const prefix = "#";
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
            calibrateVisible: false,
            calibrateStep: 0,
            calibrateSlot: {},
            calibrateSpan: 10.00,
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
                case 2:
                    zeroOne(slot.slotNo).then(() => {
                        Toast.show('货道清零成功', 3, false);
                    });
                    break;
                case 4:
                    this.showCalibrate(true, slot);
                    break;
                default:
                // Do nothing
            }
        })
    }

    showCalibrate(show, slot) {
        if (show && slot.sensors.length !== 1) {
            Toast.show('暂不支持组合货道标定', 3, false);
            return;
        }
        this.setState({calibrateVisible: show, calibrateSlot: slot, calibrateStep: 0,});
    }

    tare(slot) {
        Modal.alert('确认去皮', '确认去皮？', [{text: '取消'}, {
            text: '确认', onPress() {
                tare(slot.id).then(res => {
                    Toast.show(`货道[${res.slotNo}]去皮成功`, 3, false);
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

    onCalibrateNext() {
        const {calibrateStep, calibrateSlot, calibrateSpan} = this.state;
        if (calibrateStep >= 2) {
            this.showCalibrate(false, {});
            return;
        }
        const _this = this;
        const sensor = calibrateSlot.sensors[0];
        switch (calibrateStep) {
            case 0:
                calibrateZero(sensor.id).then(res => {
                    Toast.show(`传感器${res.address}零点校准成功`, 3, false);
                    _this.setState({calibrateStep: calibrateStep + 1});
                });
                break;
            case 1:
                calibrateWithSpan({id: sensor.id, span: calibrateSpan}).then(res => {
                    Toast.show(`传感器${res.address}砝码校准成功`, 3, false);
                    _this.setState({calibrateStep: calibrateStep + 1});
                });
                break;
            default:
            // Do nothing
        }
    }

    render() {
        const _this = this;
        const {slotData, calibrateStep, calibrateVisible, calibrateSpan, calibrateSlot} = this.state;
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
                <Modal visible={calibrateVisible} title={`货道[${calibrateSlot.slotNo}]标定`} transparent
                       maskClosable={false}
                       footer={[{
                           text: '退出', onPress: () => _this.showCalibrate(false, {})
                       }, {
                           text: calibrateStep === 2 ? '完成' : '下一步', onPress: () => _this.onCalibrateNext()
                       }]}>
                    标定进度
                    <Steps current={calibrateStep}>
                        <Steps.Step title="零点标定"/>
                        <Steps.Step title="砝码标定"/>
                        <Steps.Step title="标定完成"/>
                    </Steps>
                    <div className="span-wrapper">
                        <InputItem placeholder="请输入砝码重量" value={calibrateSpan}
                                   onChange={text => this.setState({calibrateSpan: text})}>砝码(kg):</InputItem>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default mapStateAndAction(AsbogDashboard);
