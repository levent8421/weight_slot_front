import React, {Component} from 'react';
import {func, object} from 'prop-types';
import {Modal, Toast} from 'antd-mobile';
import './SlotOperationModal.sass';
import {asStateString} from '../../util/DataConvertor';
import {zeroOne} from '../../api/slot';

const renderSensor = sensor => {
    const state = asStateString(sensor.state);
    return <div key={sensor.id} className="item">
        <div className="address">
            {sensor.address485}
        </div>
        <div className="state">
            {state}
        </div>
    </div>
};
const renderSensors = sensors => {
    if (!sensors || sensors.length <= 0) {
        return null;
    }
    return sensors.map(renderSensor);
};

class SlotOperationModal extends Component {
    static propTypes = {
        slot: object.isRequired,
        onClose: func.isRequired,
    };

    doZero() {
        const {slot} = this.props;
        const {slotNo} = slot;
        Modal.alert('清零确认', `确认清零货道[${slotNo}]？`, [
            {
                text: '取消',
            },
            {
                text: '确认',
                onPress() {
                    zeroOne(slotNo).then(() => {
                        Toast.show('清零成功', 3, false);
                    });
                },
            }
        ]);
    }

    render() {
        const _this = this;
        const {slot, onClose} = this.props;
        const title = `货道[${slot.slotNo}]操作`;
        const {sensors} = slot;
        return (
            <Modal className="slot-operation-modal"
                   visible={true}
                   maskClosable={true}
                   title={title}
                   transparent={true}
                   onClose={onClose}
                   footer={
                       [
                           {
                               text: '关闭',
                               onPress: onClose,
                           },
                           {
                               text: '清零',
                               onPress() {
                                   _this.doZero()
                               }
                           }
                       ]
                   }>
                <div className="slot">
                    {slot.slotNo}
                </div>
                <div className="sensors">
                    {
                        renderSensors(sensors)
                    }
                </div>
            </Modal>
        );
    }
}

export default SlotOperationModal;
