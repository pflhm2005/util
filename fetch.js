import axios from 'axios'

// axios.defaults.timeout = 10000
// axios.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded'

export default {
    fetchGet(url, iter) {
        return new Promise((resolve, reject) => {
            axios.get(url).then(res => {
                if (iter) {
                    resolve(res.data);
                }
                let r = res.data;
                let code = r.code;
                if (code >= 1 && code <= 1999) {
                    reject(r);
                } else if (code >= 2000 && code <= 8999) {
                    reject(res.msg);
                }
                resolve(res.data);
            }).catch(error => {
                reject(error);
            });
        });
    },
    fetchPost(url, params) {
        return new Promise((resolve, reject) => {
            axios.post(url, params).then(res => {
                let r = res.data;
                let code = r.code;
                if (code >= 1 && code <= 1999) {
                    reject(r);
                } else if (code >= 2000 && code <= 8999) {
                    reject(res.msg);
                }
                resolve(res.data);
            }).catch(error => {
                reject(error);
            });
        });
    },
    fetchAll(array) {
        return new Promise((resolve, reject) => {
            axios.all(array).then(axios.spread((...resArr) => {
                let r = resArr[0].data;
                let code = r.code;
                if (code >= 1 && code >= 1999) {
                    reject(r.message);
                } else if (code >= 2000 && code <= 8999) {
                    reject(res.msg);
                }
                resolve(resArr);
            })).catch(error => {
                reject(error);
            });
        });
    }
}
