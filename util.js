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
                tar[key] = -1;
                break;
            case 'Array':
                tar[key] = [];
                break;
            case 'Boolean':
                tar[key] = null;
                break;
            case 'Object':
                tar[key] = {};
                break;
            default:
                tar[key] = null;
        }
    }
}

/* ---------------------------------------------- 设置默认值 --------------------------------------------- */

export const setDefaultValue = (tar,defaultObj = {},defaultValue = '--') => {
    if(typeof defaultObj !== 'object'){
        defaultValue = defaultObj;
        defaultObj = {};
    }
    for (let key in tar) {
        let v = tar[key];
        if (!v) { tar[key] = defaultValue; }
    }
    return Object.assign({},tar,defaultObj);
};

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
    Example:
    obj = {
        appointType:0,
        appointStatus:1
    }
    After normalize:
    obj = {
        $ref_appointType:'出租',
        $ref_appointStatus:'待带看',
        appointType:0,
        appointStatus:1
    }
*/

export const normalizeType = (tar,prefix = '$ref_') => {
    if (Array.isArray(tar) && !tar.length) { return; }
    if (!Array.isArray(tar)) { tar = [tar]; }
    let resolveType = Object.keys(tar[0]).filter(key => Reflect.has(typeCollection, key));
    tar.forEach(v => resolveType.forEach(key => v[`${prefix}${key}`] = v[key] === null ? null : typeCollection[key][v[key]]));
};

/* ----------------------------------------------- 日期切割 --------------------------------------------- */

export const normalizeDate = (tar, key) => {
    tar.forEach(v => {
        let tmp = v[key].split(' ');
        v[`$ref_${key}_day`] = tmp[0];
        v[`$ref_${key}_time`] = tmp[1];
    });
};

/* ----------------------------------------------- element-ui表单正则 --------------------------------------------- */

export const elRegFnGenerator = {
    number_reg(m, n, msg) {
        const reg = new RegExp(`^[1-9]{1}[0-9]{0,${m-1}}(?:\\.[0-9]{1,${n}})?$|^0\\.[0-9]{1,${n}}$`);
        return (rule, value, callback) => {
            if (msg && !value) { return callback(new Error(msg)); }
            if (!msg && !value) { return callback(); }
            if (!reg.test(value)) { return callback(new Error(`请输入至多${m}位正整数，小数最多${n}位`)); }
            callback();
        }
    },
    unsigned_number_reg(n) {
        const reg = new RegExp(`^[1-9]{1}[0-9]{0,${n-1}}$`);
        return (rule, value, callback) => {
            if (!value && !rule.required)
                return callback();
            else if (!reg.test(value))
                return callback(new Error(`请输入至多${n}位正整数`));
            callback();
        }
    },
    percentage_reg() {
        const reg = /^(100|[0-9]{0,2})$/;
        return (rule, value, callback) => {
            if (!value) { callback() }
            if (!reg.test(value)) { return callback(new Error('请输入0-100的整数')); }
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
            if (!value) { return callback(new Error('请输入电话号码')); }
            if (!reg.test(value)) { return callback(new Error('电话号码格式错误')); }
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
