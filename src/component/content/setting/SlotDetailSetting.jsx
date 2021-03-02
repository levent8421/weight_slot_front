import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {fetchDetail, toggleELabelState, toggleEnableState, updateSlot, zeroOne, lockSlot} from '../../../api/slot';
import {ActionSheet, Button, InputItem, List, Modal, Switch, Toast, WingBlank} from 'antd-mobile';
import {setTitle} from "../../../store/actionCreators";
import {connect} from 'react-redux';
import FloatButton from '../../commons/FloatButton';
import './SlotDetailSetting.sass';

const ActionButtons = [
    '清零该货道',
    '删除货道',
    '停用/启用货道',
    "锁定该货道",
    '取消',
];
const {Item} = List;
const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
    }
};
const CAN_UPDATE_SLOT_INFO = false;


class SlotDetailSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slot: {}
        };
        this.slotId = this.props.match.params.id;
    }

    componentDidMount() {
        this.props.setTitle(`${this.slotId} 货道设置`);
        this.fetchSlotInfo();
    }

    fetchSlotInfo() {
        fetchDetail(this.slotId).then(res => {
            this.setState({slot: res});
            this.props.setTitle(`${res.slotNo} 货道设置`);
        })
    }

    render() {
        const {slot} = this.state;
        const sensors = slot.sensors || [];
        return (
            <div className="slotDetail">
                <List renderHeader={() => '货道信息'}>
                    <InputItem placeholder="逻辑货道号" value={slot.slotNo}
                               onChange={text => this.setUpdateSlotProp({slotNo: text})}>货道号</InputItem>
                    <InputItem placeholder="SKU名称" value={slot.skuName}
                               onChange={text => this.setUpdateSlotProp({skuName: text})}>SKU名称</InputItem>
                    <InputItem placeholder="SKU号" value={slot.skuNo}
                               onChange={text => this.setUpdateSlotProp({skuNo: text})}>SKU号</InputItem>
                    <InputItem placeholder="SKU单重" value={slot.skuApw}
                               type="money"
                               onChange={text => this.setUpdateSlotProp({skuApw: text})}>SKU单重</InputItem>
                    <InputItem placeholder="SKU允差" value={slot.skuTolerance}
                               type="money"
                               onChange={text => this.setUpdateSlotProp({skuTolerance: text})}>SKU允差</InputItem>
                    <InputItem placeholder="开封后保质天数" value={slot.skuShelfLifeOpenDays}
                               type="number"
                               onChange={text => this.setUpdateSlotProp({skuShelfLifeOpenDays: text})}>
                        保质期
                    </InputItem>
                    <Item key="applyBtn">
                        <WingBlank><Button type="primary" onClick={() => this.applyModify()}>保存</Button></WingBlank>
                    </Item>
                </List>
                <List renderHeader={() => 'Operations'}>
                    <List.Item
                        key="hasELabel"
                        extra={<Switch
                            checked={slot.hasElabel}
                            onChange={state => this.toggleELabel(state)}
                            platform="android"/>}>
                        启用电子标签
                    </List.Item>
                    {/*<List.Item
                        arrow="horizontal"
                        onClick={() => this.props.history.push({pathname: `/setting/slot-sensors/${slot.id}`})}>
                        货道传感器管理
                    </List.Item>*/}
                </List>
                <List renderHeader={() => '传感器列表'}>
                    {
                        sensors.map(sensor => (<List.Item key={sensor.id} extra={sensor.deviceSn}>
                            {sensor.address}
                        </List.Item>))
                    }
                </List>
                <FloatButton iconType="ellipsis" onClick={() => this.openOperation()}/>
            </div>
        );
    }

    openOperation() {
        ActionSheet.showActionSheetWithOptions({
            title: '操作选择',
            options: ActionButtons,
            destructiveButtonIndex: 1,
            cancelButtonIndex: ActionButtons.length - 1,
        }, buttonIndex => {
            switch (buttonIndex) {
                case 0:
                    this.doZero();
                    break;
                case 1:
                    Toast.show('暂时不能删除货道', 2, false);
                    break;
                case 2:
                    this.toggleEnableState();
                    break;
                case 3:
                    this.showLockModal();
                    break;
                default:
                //Do nothing
            }
        });
    }

    showLockModal() {
        const _this = this;
        Modal.prompt('输入锁定密码？', '确认标记该货道为不可拆分货道？\r\n注意：该操作不可逆！',
            [
                {
                    text: '取消'
                },
                {
                    text: '确认',
                    onPress(password) {
                        lockSlot(password,_this.slotId).then(res => {
                            alert("锁定成功了"+res+"个货道")
                        });
                    }
                }], 'secure-text', null, '请输入操作密码');
    }

    toggleEnableState() {
        toggleEnableState(this.slotId).then(res => {
            Toast.show(`${res.slotNo}货道操作成功`, 3, false);
        });
    }

    doZero() {
        const {slot} = this.state;
        zeroOne(slot.slotNo).then(() => {
            Toast.show('清零成功!');
        });
    }

    setUpdateSlotProp(props) {
        const slot = {
            ...this.state.slot,
            ...props
        };
        this.setState({slot});
    }

    applyModify() {
        Modal.alert("确认保存", "确认强制手动更新货道及物料信息？", [
            {text: '取消'},
            {
                text: '更新',
                onPress() {
                    if (!CAN_UPDATE_SLOT_INFO) {
                        Modal.alert("不支持该操作", "暂不支持在平板上更新货道信息", [{text: '知道了'}]);
                        return;
                    }
                    updateSlot(this.state.slot).then(() => {
                        Toast.show('Apply Success!');
                    });
                }
            },
        ]);
    }

    toggleELabel(hasELabel) {
        toggleELabelState({id: this.slotId, hasELabel}).then(() => {
            Toast.show('Toggle ELabel Success!');
            this.fetchSlotInfo();
        });
    }
}

export default withRouter(connect(null, mapAction2Props)(SlotDetailSetting));
