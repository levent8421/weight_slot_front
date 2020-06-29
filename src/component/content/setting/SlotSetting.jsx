import React, {Component} from 'react';
import {ActionSheet, Flex, Icon, List, Toast} from 'antd-mobile';
import {doZeroAll, fetchAllSlots} from '../../../api/slot';
import {withRouter} from 'react-router-dom';
import {setTabBarState, setTitle} from "../../../store/actionCreators";
import {connect} from 'react-redux';
import './SlotSetting.sass';
import FloatButton from '../../commons/FloatButton';

const OperationActions = ['Refresh', 'Do Zero All', 'Cancel'];
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
        this.props.setTitle('Slot Settings');
        this.fetchSlots();
    }

    render() {
        const {slots} = this.state;
        return (
            <div className="slotSetting">
                <List renderHeader={() => 'Slot List'}>
                    {
                        slots.map(slot => (
                            <Item key={slot.id} extra={<Icon type="right"/>} onClick={() => this.toSlotDetail(slot)}>
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
            title: 'Operations',
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
            Toast.show('All Zeroed!');
        })
    }

    fetchSlots() {
        fetchAllSlots().then(res => {
            this.setState({slots: res})
        })
    }
}

export default withRouter(connect(null, mapAction2Props)(SlotSetting));
