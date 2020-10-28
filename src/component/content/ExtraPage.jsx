import React, {Component} from 'react';
import './ExtraPage.sass';
import {fetchExtraPageUri} from '../../api/config';
import {NoticeBar} from 'antd-mobile';
import {WarningOutlined} from '@ant-design/icons';

class ExtraPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageUri: false,
        };
    }

    componentDidMount() {
        fetchExtraPageUri().then(res => {
            this.setState({
                pageUri: res.value,
            })
        });
    }

    renderFrame() {
        const {pageUri} = this.state;
        if (pageUri) {
            return (<iframe title="inner" src={pageUri}>IFrame</iframe>);
        } else {
            return (<NoticeBar icon={<WarningOutlined/>}>页面地址未设置</NoticeBar>);
        }
    }

    render() {


        return (
            <div className="extra">
                {
                    this.renderFrame()
                }
            </div>
        );
    }
}

export default ExtraPage;
