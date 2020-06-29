import {httpRequest} from '../util/httpUtils';
import {Toast} from 'antd-mobile'

const showLoading = () => {
    Toast.loading('Loading', 0);
};
const hideLoading = () => {
    Toast.hide();
};
const showError = (msg) => {
    Toast.fail(msg);
};


export function request(options) {
    if (!options.hideLoading) {
        showLoading();
    }
    return new Promise((resolve, reject) => {
        httpRequest(options)
            .then(res => {
                hideLoading();
                if (res.status !== 200) {
                    showError(`Http Response Status:${res.status}`);
                    reject(res);
                    return;
                }
                const body = res.data;
                if (body.code !== 200) {
                    showError(`Error [${body.code}]:${body.msg}`);
                    reject(res);
                    return;
                }
                resolve(body.data);
            }).catch(err => {
                hideLoading();
                const errStr = err.toString();
                showError(errStr);
                reject(err);
            }
        );
    })
}
