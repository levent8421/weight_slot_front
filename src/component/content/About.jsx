import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setTitle} from '../../store/actionCreators';
import {Carousel, List, WhiteSpace, WingBlank} from 'antd-mobile';
import './About.sass';

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
    };
};

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen: false
        };
    }

    componentDidMount() {
        this.props.setTitle('About');
    }

    render() {
        return (
            <div className="about">
                <WhiteSpace/>
                <WingBlank>
                    <Carousel
                        autoplay={true}
                        infinite
                        className="headerCarousel"
                    >
                        <div className="carouselItem" style={{backgroundColor: '#FF9808'}}>
                            <div className="title">
                                磐石电气（常州）有限公司
                            </div>
                        </div>
                        <div className="carouselItem" style={{backgroundColor: '#3171FA'}}>
                            <div className="title">
                                MonolithIoT
                            </div>
                        </div>
                    </Carousel>
                </WingBlank>
                <WingBlank className="article">
                    <h1 className="title">关于我们</h1>
                    <div className="text">
                        <p>
                            磐石电气(常州)有限公司,是一家高科技智能测量装备研发及生产企业，把传统体积，重量的测量数字化物联网化，可以与WMS,ERP，SAP等企业管理软件相结合，便于企业更直观的管理自己的仓储，物流等。磐石电气下设研发部，工程部，业务部，有较强的设计，研发和生产能力，可为客户提供嵌入式计算机系统产品设计，开发，系统集成，工程实施等服务。
                        </p>
                        <p>
                            随着公司的发展，主要产品有自主研发的智能数字卷尺，智能手动叉车秤，安卓智能称重终端，静态/动态DWS等各种物联网类智能称重量方设备及软件定制系统,可为客户最大程度地提供智能化系统化的测量系统解决方案。产品广泛应用于快递物流、生鲜供应、港口订舱、仓储、工业离散制造及各种以长度(含面
                            积、体积)测量为手段的民用、商用用途中。凭着可靠的产品质量和良好的售后服务，我公司已与顺丰、中国邮政、京东、国际快递DHL、华为等多家知名企业合作。
                        </p>
                        <p>
                            目前公司已申请中国专利24项,美国专利1项，并拥有一支以博士、硕士为主的优秀研发团队，具有较高的研发能力和管理水平，现有多名员工曾在外企作为技术骨干，承传欧美设计制造理念，并采用先进的产品生命周期管理（PLM），重视产品质量，为公司产品的技术引领、技术创新和公司的可持续发展奠定了坚实基础。
                        </p>
                    </div>
                </WingBlank>
                <List renderHeader="TestEntries">
                    <List.Item arrow="horizontal" onClick={() => {
                        this.props.history.push({pathname: '/pid'})
                    }}>
                        PID Animation
                    </List.Item>
                </List>
            </div>
        );
    }
}

export default connect(null, mapAction2Props)(About);
