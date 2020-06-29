import React, {Component} from 'react';
import {asyncFetchDashboardSlotData, setTitle} from '../../store/actionCreators';
import {connect} from 'react-redux';
import {Card, Flex, List} from 'antd-mobile';
import './Dashboard.sass'
import {asKg, isStable, isWarn} from '../../util/DataConvertor';

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
        this.state = {};
        this.props.setTitle('Dashboard');
    }

    componentDidMount() {
        this.startFetchData();
    }

    componentWillUnmount() {
        clearInterval(this.fetchTimer);
    }

    startFetchData() {
        this.props.fetchSlotData();
        this.fetchTimer = setInterval(() => {
            this.props.fetchSlotData();
        }, 3000);
    }

    render() {
        const slots = this.props.slots;
        const {Item} = List;
        return (
            <div className="dashboard">
                <List renderHeader={() => 'SLOT LIST'}>
                    {slots.map(slot => (<Item key={slot.slotNo}>
                        <Card className={isWarn(slot) ? 'warn' : ''}>
                            <Card.Header title={slot.slotNo} extra={slot.sku && slot.sku.name}/>
                            <Card.Body>
                                <Flex className="slotCard" justify="center">
                                    <div className="count">
                                        <span
                                            className={isWarn(slot) ? 'warn value' : 'value'}>{slot.data && slot.data.count}</span>
                                        <span className="unit">pis</span>
                                    </div>
                                    <div
                                        className={isStable(slot.data && slot.data.weightState) ? 'weight' : 'weight warn'}>
                                        <span
                                            className={isWarn(slot) ? 'warn value' : 'value'}>{isStable(slot.data && slot.data.weightState) ? '' : '~'}{slot.data && asKg(slot.data.weight)}</span>
                                        <span className="unit">kg</span>
                                    </div>
                                </Flex>
                            </Card.Body>
                            <Card.Footer content={slot.sku && slot.sku.skuNo}/>
                        </Card>
                    </Item>))}
                </List>
            </div>
        );
    }
}

export default connect(mapState2Props, mapAction2Props)(Dashboard);
