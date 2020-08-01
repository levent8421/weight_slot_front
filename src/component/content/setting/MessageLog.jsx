import React, {Component} from 'react';
import {fetchMessageLog} from '../../../api/systemStatus';
import {Card, List, TextareaItem} from "antd-mobile";
import './MessageLog.sass'

const renderMessageItem = (message, index) => {
    return (<List.Item key={index}>
        <Card className="message-item">
            <Card.Header title={message.action} extra={message.type}/>
            <Card.Body>
                <TextareaItem value={JSON.stringify(message.data)} rows={3}/>
            </Card.Body>
            <Card.Footer content={message.seqNo}/>
        </Card>
    </List.Item>);
};

class MessageLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: []
        };
    }

    componentDidMount() {
        this.refreshLogs();
        this.refreshTimmer = setInterval(() => {
            this.refreshLogs();
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.refreshTimmer);
    }

    refreshLogs() {
        fetchMessageLog().then(res => {
            this.setState({
                logs: res,
            })
        });
    }

    render() {
        const {logs} = this.state;
        return (
            <div className="message-log">
                <List renderHeader={() => 'Message Logs'}>
                    {
                        logs.map(renderMessageItem)
                    }
                </List>
            </div>
        );
    }
}

export default MessageLog;
