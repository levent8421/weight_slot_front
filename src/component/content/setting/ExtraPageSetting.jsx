import React, {Component} from 'react';
import {Button, Card, List, Modal, TextareaItem, Toast} from 'antd-mobile';
import {setTitle} from '../../../store/actionCreators';
import {connect} from 'react-redux';
import {fetchExtraPageUri, setExtraPageUri} from '../../../api/config';

const mapAction2Props = (dispatch, props) => {
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
    };
};

class ExtraPageSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageUri: '',
        };
    }

    componentDidMount() {
        this.props.setTitle('扩展页面配置');
        fetchExtraPageUri().then(res => {
            this.setState({
                pageUri: res.value,
            });
        }).catch(err => {
            const data = err.data;
            if (data) {
                const {code} = data;
                if (code === 404) {
                    this.setState({
                        pageUri: '页面路径未设置',
                    })
                }
            }
        });
    }

    setPageUri() {
        const {pageUri} = this.state;
        const pattern = /^[a-zA-z]+:\/\/[^\\s]*$/;
        if (!pageUri.match(pattern)) {
            Modal.alert('输入提示', '请输入正确的URI!', [{text: '知道了'}]);
            return;
        }
        setExtraPageUri(pageUri).then(res => {
            Toast.show('配置成功', 3, false);
        });
    }

    gotoExtraPage() {
        this.props.history.push({
            pathname: '/extra',
        });
    }

    render() {
        const {pageUri} = this.state;
        return (
            <div className="extra-page-setting">
                <Card>
                    <Card.Header
                        title="页面配置"
                        extra="页面路径配置"/>
                    <Card.Body>
                        <List>
                            <TextareaItem title="页面路径"
                                          autoHeight
                                          value={pageUri}
                                          onChange={text => this.setState({pageUri: text})}/>
                            <List.Item>
                                <Button type="primary" onClick={() => this.setPageUri()}>保存</Button>
                            </List.Item>
                        </List>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header
                        title="页面入口"/>
                    <Card.Body>
                        <List>
                            <List.Item arrow="horizontal" onClick={() => this.gotoExtraPage()}>
                                进入扩展页面
                            </List.Item>
                        </List>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default connect(null, mapAction2Props)(ExtraPageSetting);
