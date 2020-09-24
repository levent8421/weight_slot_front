import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {fetchDetail, toggleELabelState, updateSlot, zeroOne} from '../../../api/slot';
import {ActionSheet, Button, InputItem, List, Switch, Toast, WingBlank} from 'antd-mobile';
import {setTitle} from "../../../store/actionCreators";
import {connect} from 'react-redux';
import FloatButton from '../../commons/FloatButton';

const ActionButtons = [
    '清零该货道',
    '删除货道',
    '取消',
];
const {Item} = List;
const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
    }
};

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
        return (
            <div className="slotDetail">
                <List renderHeader={() => '货道信息'}>
                    <Item key="slotNo">
                        <InputItem placeholder="逻辑货道号" value={slot.slotNo}
                                   onChange={text => this.setUpdateSlotProp({slotNo: text})}>货道号</InputItem>
                    </Item>
                    <Item key="SkuName">
                        <InputItem placeholder="SKU名称" value={slot.skuName}
                                   onChange={text => this.setUpdateSlotProp({skuName: text})}>SKU名称</InputItem>
                    </Item>
                    <Item key="skuNo">
                        <InputItem placeholder="SKU号" value={slot.skuNo}
                                   onChange={text => this.setUpdateSlotProp({skuNo: text})}>SKU号</InputItem>
                    </Item>
                    <Item key="skuApw">
                        <InputItem placeholder="SKU单重" value={slot.skuApw}
                                   type="number"
                                   onChange={text => this.setUpdateSlotProp({skuApw: text})}>SKU单重</InputItem>
                    </Item>
                    <Item key="skuTolerance">
                        <InputItem placeholder="SKU允差" value={slot.skuTolerance}
                                   type="number"
                                   onChange={text => this.setUpdateSlotProp({skuTolerance: text})}>SKU允差</InputItem>
                    </Item>
                    <Item key="skuShelfLifeOpenDays">
                        <InputItem placeholder="开封后保质天数" value={slot.skuShelfLifeOpenDays}
                                   type="number"
                                   onChange={text => this.setUpdateSlotProp({skuShelfLifeOpenDays: text})}>
                            保质期
                        </InputItem>
                    </Item>
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
                    <List.Item
                        arrow="horizontal"
                        onClick={() => this.props.history.push({pathname: `/setting/slot-sensors/${slot.id}`})}>
                        货道传感器管理
                    </List.Item>
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
                default:
                //Do nothing
            }
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
        updateSlot(this.state.slot).then(() => {
            Toast.show('Apply Success!');
        });
    }

    toggleELabel(hasELabel) {
        toggleELabelState({id: this.slotId, hasELabel}).then(() => {
            Toast.show('Toggle ELabel Success!');
            this.fetchSlotInfo();
        });
    }
}

export default withRouter(connect(null, mapAction2Props)(SlotDetailSetting));
