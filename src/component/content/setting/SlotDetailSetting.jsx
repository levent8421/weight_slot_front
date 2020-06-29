import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {fetchDetail, updateSlot, zeroOne, toggleELabelState} from '../../../api/slot';
import {ActionSheet, Button, InputItem, List, Switch, Toast, WingBlank} from 'antd-mobile';
import {setTitle} from "../../../store/actionCreators";
import {connect} from 'react-redux';
import FloatButton from '../../commons/FloatButton';

const ActionButtons = [
    'Do Zero',
    'Delete',
    'Cancel',
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
        this.props.setTitle(`${this.slotId} Settings`);
        this.fetchSlotInfo();
    }

    fetchSlotInfo() {
        fetchDetail(this.slotId).then(res => {
            this.setState({slot: res});
            this.props.setTitle(`${res.slotNo} Settings`);
        })
    }

    render() {
        const {slot} = this.state;
        return (
            <div className="slotDetail">
                <List renderHeader={() => 'Slot Info'}>
                    <Item key="slotNo">
                        <InputItem placeholder="Slot No" value={slot.slotNo}
                                   onChange={text => this.setUpdateSlotProp({slotNo: text})}>SlotNo</InputItem>
                    </Item>
                    <Item key="SkuName">
                        <InputItem placeholder="Sku Name" value={slot.skuName}
                                   onChange={text => this.setUpdateSlotProp({skuName: text})}>SKUName</InputItem>
                    </Item>
                    <Item key="skuNo">
                        <InputItem placeholder="SKU No" value={slot.skuNo}
                                   onChange={text => this.setUpdateSlotProp({skuNo: text})}>SKUNo</InputItem>
                    </Item>
                    <Item key="skuApw">
                        <InputItem placeholder="SKU Apw" value={slot.skuApw}
                                   onChange={text => this.setUpdateSlotProp({skuApw: text})}>SKUApw</InputItem>
                    </Item>
                    <Item key="skuTolerance">
                        <InputItem placeholder="SKU Apw" value={slot.skuTolerance}
                                   onChange={text => this.setUpdateSlotProp({skuTolerance: text})}>SKUTolerance</InputItem>
                    </Item>
                </List>
                <WingBlank><Button type="primary" onClick={() => this.applyModify()}>Apply Modify</Button></WingBlank>
                <List renderHeader={() => 'ELabel'}>
                    <List.Item
                        key="hasELabel"
                        extra={<Switch checked={slot.hasElabel} onChange={state => this.toggleELabel(state)}/>}>
                        Enable ELabel
                    </List.Item>
                </List>
                <FloatButton iconType="ellipsis" onClick={() => this.openOperation()}/>
            </div>
        );
    }

    openOperation() {
        ActionSheet.showActionSheetWithOptions({
            title: 'Operations',
            options: ActionButtons,
            destructiveButtonIndex: 1,
            cancelButtonIndex: ActionButtons.length - 1,
        }, buttonIndex => {
            const button = ActionButtons[buttonIndex];
            if (button === 'Do Zero') {
                this.doZero();
            } else if (button === 'Delete') {
                Toast.show('Unable To Delete!');
            }
        });
    }

    doZero() {
        const {slot} = this.state;
        zeroOne(slot.slotNo).then(() => {
            Toast.show('Do Zero Success!');
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
