import React, {Component} from 'react';
import {ActionSheet, Flex, List, Toast} from 'antd-mobile';
import {doZeroAll, fetchAllSlots} from '../../../api/slot';
import {withRouter} from 'react-router-dom';
import {setTabBarState, setTitle} from "../../../store/actionCreators";
import {connect} from 'react-redux';
import './SlotSetting.sass';
import FloatButton from '../../commons/FloatButton';

const OperationActions = ['刷新', '全部清零', '取消'];
const {Item} = List;
const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTabBarState: (...args) => dispatch(setTabBarState(...args)),
        setTitle: (...args) => dispatch(setTitle(...args)),
    }
};

class SlotSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slots: [],
        };
    }

    componentDidMount() {
        this.props.setTabBarState(false);
        this.props.setTitle('重力货道设置');
        this.fetchSlots();
    }

    render() {
        const {slots} = this.state;
        return (
            <div className="slotSetting">
                <List renderHeader={() => '重力货道列表'}>
                    {
                        slots.map(slot => (
                            <Item key={slot.id} arrow="horizontal" onClick={() => this.toSlotDetail(slot)}>
                                <Flex justify="between">
                                    <span className="slotNo">{slot.slotNo}</span>
                                    <span className="name">{slot.skuName}</span>
                                </Flex>
                            </Item>))
                    }
                </List>
                <FloatButton iconType="ellipsis" onClick={() => this.showOperationSheet()}/>
            </div>
        );
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
        doZeroAll().then(() => {
            Toast.show('全部货道已经被清零!');
        })
    }

    fetchSlots() {
        fetchAllSlots().then(res => {
            const slots = res.sort((a, b) => a.slotNo.localeCompare(b.slotNo));
            this.setState({slots})
        })
    }
}

export default withRouter(connect(null, mapAction2Props)(SlotSetting));
