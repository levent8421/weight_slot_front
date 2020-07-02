import React, {Component} from 'react';
import {asyncFetchDashboardSlotData, setTitle} from '../../store/actionCreators';
import {connect} from 'react-redux';
import './Dashboard.sass'
import {Card, Flex, WhiteSpace, WingBlank} from 'antd-mobile';

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
        this.renderSlotCard = this.renderSlotCard.bind(this);
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
        const _this = this;
        const slots = this.props.slots;
        return (
            <div className="dashboard">
                <WhiteSpace/>
                <WingBlank>
                    <Flex wrap="wrap" justify="between">
                        {
                            slots.map(_this.renderSlotCard)
                        }
                    </Flex>
                </WingBlank>
            </div>
        );
    }

    renderSlotCard(slot) {
        const sku = slot.sku || {};
        const data = slot.data || {};
        return (<Card
            className="slotCard"
            onClick={() => this.onSlotCardClick(slot)}
            key={slot.id}
            full={true}>
            <Card.Header
                title={sku.name}
            >
            </Card.Header>
            <Card.Body>
                <div className="line">
                    <span className="pcsTitle">PCS</span>
                    <span className="slotNo">{slot.slotNo}</span>
                </div>
                <div className="pcsValue">
                    {data.count}
                </div>
                <div className="weightValue">
                    {data.weight}
                </div>
            </Card.Body>
            <Card.Footer extra={sku.skuNo}/>
        </Card>)
    }

    onSlotCardClick(slot) {
        console.log(slot);
    }
}

export default connect(mapState2Props, mapAction2Props)(Dashboard);
