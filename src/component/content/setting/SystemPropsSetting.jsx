import React, {Component} from 'react';
import {fetchSystemProps} from '../.././../api/dashboard';
import {List, TextareaItem} from 'antd-mobile';
import {connect} from 'react-redux';
import {setTitle} from '../../../store/actionCreators';

const mapAction2Props = (dispatch, props) => {
    console.log(props, dispatch);
    return {
        ...props,
        setTitle: (...args) => dispatch(setTitle(...args)),
    };
};
const {Item} = List;

class SystemPropsSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            systemProps: [],
        };
    }

    componentDidMount() {
        this.props.setTitle('JVM环境变量');
        fetchSystemProps().then(res => {
            const propList = [];
            for (const name in res) {
                if (res.hasOwnProperty(name)) {
                    propList.push({
                        name,
                        value: res[name],
                    });
                }
            }
            this.setState({
                systemProps: propList
            });
        });
    }

    render() {
        const {systemProps} = this.state;
        return (
            <div className="systemProps">
                <List renderHeader={() => 'System Properties'}>
                    {
                        systemProps.map(p => (<Item key={p.name}>
                            <div>{p.name}</div>
                            <TextareaItem value={p.value} autoHeight labelNumber={5}/>
                        </Item>))
                    }
                </List>
            </div>
        );
    }
}

export default connect(null, mapAction2Props)(SystemPropsSetting);
