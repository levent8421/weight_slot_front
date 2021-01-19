import React, {Component} from 'react';
import {ActionSheet, Checkbox, List, Modal, Toast} from 'antd-mobile';
import {doZeroAll, fetchAllSlots, mergeSlotsByIds, resetSlotBySlots} from '../../../api/slot';
import {withRouter} from 'react-router-dom';
import {setTabBarState, setTitle} from "../../../store/actionCreators";
import {connect} from 'react-redux';
import './SlotSetting.sass';
import FloatButton from '../../commons/FloatButton';

const OperationActions = ['刷新', '全部清零', '合并选中货道', '拆分选中货道', '管理选中货道', '全选', '取消'];
const {Item} = List;
const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTabBarState: (...args) => dispatch(setTabBarState(...args)),
        setTitle: (...args) => dispatch(setTitle(...args)),
    }
};
const isContinueSelected = slots => {
    const selectedMap = {};
    let selectedMinAddress = 999999;
    for (let slot of slots) {
        if (slot.selected) {
            selectedMap[slot.address] = slot;
            if (slot.address < selectedMinAddress) {
                selectedMinAddress = slot.address;
            }
        }
    }
    delete selectedMap[selectedMinAddress];
    while (Object.keys(selectedMap).length > 0) {
        selectedMinAddress++;
        const nextSelected = selectedMap[selectedMinAddress];
        if (!nextSelected) {
            return false;
        }
        delete selectedMap[selectedMinAddress];
    }
    return true;
};

class SlotSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slots: [],
            selectedNums: 0,
            continueSelected: true,
        };
    }

    componentDidMount() {
        this.props.setTabBarState(false);
        this.props.setTitle('重力货道设置');
        this.fetchSlots();
    }

    onItemClick(slot) {
        const {slots} = this.state;
        for (let s of slots) {
            if (s.id === slot.id) {
                s.selected = !s.selected;
            }
        }
        const selectedNums = slots.filter(slot => slot.selected).length;
        const continueSelected = isContinueSelected(slots);
        this.setState({
            slots: slots,
            selectedNums: selectedNums,
            continueSelected: continueSelected,
        });
    }

    renderSlotSensors(sensors) {
        if (sensors.length <= 0) {
            return (<span className="msg">该货道已被合并</span>);
        }
        return sensors.map(sensor => (<span className="sensor-dot" key={sensor.id}>{sensor.address}</span>));
    }

    renderSlotItem(slot) {
        const sensors = slot.sensors || [];
        if (slot.id < 0 && sensors.length <= 0) {
            return
        }
        return (<Item key={slot.id} arrow="horizontal" onClick={() => this.onItemClick(slot)}>
            <div className="slot-item">
                <div className="cb-wrapper">
                    <Checkbox checked={slot.selected}/>
                </div>
                <div className="slot-no">
                    <span>{slot.slotNo}</span>
                </div>
                <div>
                    {
                        this.renderSlotSensors(sensors)
                    }
                </div>
            </div>
        </Item>);
    }

    render() {
        const {slots, selectedNums, continueSelected} = this.state;
        const _this = this;
        const selectedNumStyle = continueSelected ? 'continue' : 'warn';
        return (
            <div className="slot-setting">
                <List renderHeader={() => '重力货道列表'} className="slots">
                    {
                        slots.map(slot => _this.renderSlotItem(slot))
                    }
                </List>
                <FloatButton iconType="ellipsis" onClick={() => this.showOperationSheet()}/>
                <div className="fixed-tips">
                    <p>已选择：
                        <span className={selectedNumStyle}>{selectedNums}</span>
                        个
                        <span className={selectedNumStyle}>{continueSelected ? '连续选择' : '未连续选择'}</span>
                    </p>
                </div>
            </div>
        );
    }

    findSelectedSlots() {
        const {slots} = this.state;
        return slots.filter(slot => slot.selected);
    }

    mergeSlot() {
        const slots = this.findSelectedSlots();
        if (slots.length < 2) {
            Toast.show('请选中一个以上货道', 3, false);
            return;
        }
        const slotNos = slots.map(slot => slot.slotNo).join(',');
        const {continueSelected} = this.state;
        if (!continueSelected) {
            Modal.alert('无法合并不连续货道', '合并货道时需选择地址连续的货道！', [{text: '知道了'}]);
            return;
        }
        Modal.alert('合并货道', `确认合并:${slotNos}?`, [
            {
                text: '取消',
            },
            {
                text: '确定',
                onPress: () => {
                    mergeSlotsByIds(slots.map(slot => slot.id)).then(res => {
                        this.fetchSlots();
                    }).catch(err => {
                        Toast.hide();
                        const {data, status} = err;
                        const {code, msg} = data;
                        if (status === 200 && code === 400) {
                            Modal.alert('操作提醒', msg, [{text: '知道了'}], 'android');
                        }
                    });
                },
            }
        ]);
    }

    resetSlotSensor() {
        const slots = this.findSelectedSlots();
        if (slots.length < 1) {
            Toast.show('请选中至少一个货道', 3, false);
            return;
        }
        const slotNos = slots.map(slot => slot.slotNo).join(',');
        Modal.alert('拆分货道', `确认拆分:${slotNos}?`, [
            {
                text: '取消',
            },
            {
                text: '确定',
                onPress: () => {
                    resetSlotBySlots(slots.map(slot => slot.id)).then(() => {
                        Toast.show('拆分成功', 3, false);
                        this.fetchSlots();
                    });
                },
            }
        ]);
    }

    chooseAllSlotSensor() {
        const {slots} = this.state;
        const selected = slots.filter(slot => slot.selected).length !== slots.length;
        for (let slot of slots) {
            slot.selected = selected;
        }
        this.setState({slots});
    }

    toSelectedSlotDetails() {
        const slots = this.findSelectedSlots();
        if (slots.length !== 1) {
            Toast.show('请选中一个货道', 3, false);
            return;
        }
        const slot = slots[0];
        this.toSlotDetail(slot);
    }

    showOperationSheet() {
        ActionSheet.showActionSheetWithOptions({
            options: OperationActions,
            title: '操作选择',
            cancelButtonIndex: OperationActions.length - 1,
            destructiveButtonIndex: 1,
        }, index => {
            switch (index) {
                case 0:
                    this.fetchSlots();
                    break;
                case 1:
                    this.doZeroAll();
                    break;
                case 2:
                    this.mergeSlot();
                    break;
                case 3:
                    this.resetSlotSensor();
                    break;
                case 4:
                    this.toSelectedSlotDetails();
                    break;
                case 5:
                    this.chooseAllSlotSensor();
                    break;
                default:
                // Do Nothing
            }
        })
    }

    toSlotDetail(slot) {
        this.props.history.push({
            pathname: `/setting/slot-detail/${slot.id}`,
        });
    }

    doZeroAll() {
        Modal.alert('确认清零？', '确认清零全部货道？', [
            {
                text: '清零',
                onPress: () => {
                    doZeroAll().then(() => {
                        Toast.show('全部货道已经被清零!');
                    });
                },
            },
            {
                text: '取消',
            }
        ]);
    }

    fetchSlots() {
        fetchAllSlots().then(res => {
            const slots = res.map(slot => {
                slot.selected = false;
                return slot;
            }).sort((a, b) => a.address - b.address);
            this.setState({slots})
        })
    }
}

export default withRouter(connect(null, mapAction2Props)(SlotSetting));
