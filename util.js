const type = (tar) => Object.prototype.toString.call(tar).slice(8, -1);

/* ----------------------------------------------- 表单清空 --------------------------------------------- */

export const clearOption = (tar) => {
    for (let key in tar) {
        let v = tar[key];
        switch (type(v)) {
            case 'String':
                tar[key] = '';
                break;
            case 'Number':
                tar[key] = 0;
                break;
            case 'Array':
                tar[key] = [];
                break;
            case 'Boolean':
                tar[key] = false;
                break;
            case 'Object':
                tar[key] = {};
                break;
            default:
                tar[key] = null;
        }
    }
}

/* ----------------------------------------------- 类型判断 --------------------------------------------- */

export const typeUtil = {
    isString(tar) { return type(tar) === 'String' },
    isNumber(tar) { return type(tar) === 'Number'; },
    isArray(tar) { return type(tar) === 'Array'; },
    isObject(tar) { return type(tar) === 'Object'; },
    isBoolean(tar) { return type(tar) === 'Boolean' }
}

/* ----------------------------------------------- 数据格式化 --------------------------------------------- */

/*
    const typeCollection = {
        'appointType': ['出租', '出售'],
        'appointStatus': ['待确认', '待带看', '跟进中', '已关闭'],
        'resource': ['一键建站', '中介端'],
        'recordType': ['园区跟进', '中介跟进'],
        'flagUse': ['否', '是'],
        'flagFirst': ['否', '是']
    };
*/

export const normalizeType = (tar) => {
    if (!tar.length) { return; }
    let resolveType = Object.keys(tar[0]).filter(key => Reflect.has(typeCollection, key));
    tar.forEach(v => resolveType.forEach(key => v[`$ref_${key}`] = v[key] === null ? null : typeCollection[key][v[key]]));
};

/* ----------------------------------------------- 日期切割 --------------------------------------------- */

export const normalizeDate = (tar, key) => {
    tar.forEach(v => {
        key.forEach(v2 => {
            let tmp = v[v2].split(' ');
            v['y_' + v2] = tmp[0];
            v['t_' + v2] = tmp[1];
        });
    });
};

/* ----------------------------------------------- element-ui表单正则 --------------------------------------------- */

export const elRegFnGenerator = {
    double_reg(n) {
        const reg = /^[1-9]{1}[0-9]*(?:\.[0-9]{1,4})?$|^0\.[0-9]{1,4}$/;
        return (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入正整数或至多4位小数正整数'));
            }
            if (String(value).length > n) {
                return callback(new Error('长度为1-' + n + '位'));
            }
            callback();
        }
    },
    unsigned_int_reg(n) {
        const reg = new RegExp('^' + '\\d{1,' + n + '}' + '$');
        return (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入1-' + n + '位正整数'));
            }
            callback();
        }
    },
    signed_int_reg(n) {
        const reg = new RegExp('^' + '-?\\d{1,' + n + '}' + '$');
        return (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入1-' + n + '位整数'));
            }
            callback();
        }
    },
    telephone_reg() {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        return (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入正确的手机号码'));
            }
            callback();
        }
    },
    phone_reg() {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$|^(?:0[0-9]{2,3}-)?[2-9][0-9]{7}(?:-[0-9]{1,4})?$|^400[0-9]{7}$/;
        return (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入正确的电话号码'));
            }
            callback();
        }
    },
    email_reg() {
        const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        return (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入正确的邮箱'));
            }
            callback();
        }
    },
    checkbox_empty() {
        return (rule, value, callback) => {
            if (!value[0]) {
                return callback(new Error('请选择'));
            }
            callback();
        }
    }
}

/* ----------------------------------------------- 自定义table(略) --------------------------------------------- */
export const transformRoomTable = (u) => {
    let curIter = 0,
        iter = -1,
        i = 0,
        roomType,
        table = [];
    u.forEach((v) => {
        if (v.roomFloor !== curIter) {
            i = 0;
            curIter = v.roomFloor;
            table.push([]);
            iter++;
        }
        i++;
        roomType = 0;
        if (v.flagRent) { roomType = 1; }
        if (v.flagSell) { roomType = 2; }
        if (v.flagRent && v.flagSell) { roomType = 3; }
        table[iter].push({
            roomFloor: v.roomFloor,
            roomNumber: v.roomNumber,
            roomStatus: v.roomStatus,
            status: v.roomStatus,
            roomId: v.roomId,
            roomType,
        });
    });
    return table;
}
