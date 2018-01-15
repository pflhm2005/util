const type = (tar) => {
    return Object.prototype.toString.call(tar).slice(8, -1);
}

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

export const typeUtil = {
    isString(tar) { return type(tar) === 'String' },
    isNumber(tar) { return type(tar) === 'Number'; },
    isArray(tar) { return type(tar) === 'Array'; },
    isObject(tar) { return type(tar) === 'Object'; },
    isBoolean(tar) { return type(tar) === 'Boolean' }
}

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
    let resolveType = Object.keys(tar[0]).filter(key => Object.keys(typeCollection).indexOf(key) >= 0);
    tar.forEach(v => resolveType.forEach(key => v[`$ref_${key}`] = typeCollection[key][v[key]]));
};

// 内部使用
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
