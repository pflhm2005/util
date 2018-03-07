const fs = require('fs');

let tableData = {
    data: 'table_data',
    eventName: 'clickTable',
    sourceData: [
        { label: '用户名', value: 'a' },
        { label: '手机号码', value: 'a' },
        { label: '员工编号', value: 'a' },
        { label: '角色', value: 'a' },
        { label: '最后登录时间', value: 'a', time: true },
        { label: '登录次数', value: 'a' },
        { label: '创建时间', value: 'a', time: true },
        { label: '状态', value: 'a' },
        { label: '操作', value: 'a', btn: ['编辑', '重置密码', '禁用', '删除'] },
    ],
    pagEventName: 'changePage',
};

const generateTemplate = (o) => {
    let startStr = `<template>
    <div class="table-content">
        <el-table
        :data=`;
    let endStr = `\t\t</el-table>
    </div>
</template>\n`;
    const addLine = (str, tabs) => {
        let tabStr = '';
        while (tabs--) { tabStr += `\t`; }
        startStr += tabStr + str + '\n';
    };
    addLine(`\"${o.data}\"`);
    if (o.eventName) { addLine(`@row-dblclick='${o.eventName}'`, 2) }
    addLine(`border style="width: 100%">
            <el-table-column type="index"></el-table-column>`, 2);
    let s = o.sourceData;
    let l = s.length;
    for (let i = 0; i < l; i++) {
        if (s[i].time) {
            addLine(`<el-table-column label="${s[i].label}">
                <template slot-scope='scope'>
                    <p>{{scope.row.y_${s[i].value}}}</p>
                    <p>{{scope.row.t_${s[i].value}}}</p>
                </template>
            </el-table-column>`, 3);
        } else if (s[i].btn) {
            addLine(`<el-table-column label="操作">
                <template slot-scope='scope'>`, 3);
            s[i].btn.forEach(v => addLine(`<el-button size='small'>${v}</el-button>`, 5));
            addLine(`</template>
            </el-table-column>`, 4);
        } else {
            addLine(`<el-table-column prop="${s[i].value}" label="${s[i].label}"></el-table-column>`, 3)
        }
    }
    addLine(`<div class="pag-container" v-if="!!${o.data}">
                <div class="pag">
                    <el-pagination
                        layout="prev, pager, next"
                        :total="${o.data}"
                        :current-page='cur_iter'
                        @current-change='${o.pagEventName}'>
                    </el-pagination>
                </div>
            </div>`, 3);
    return startStr + endStr;
}

let scriptData = {
    components: [
        { name: 'top', source: 'new_top' },
        { name: 'foot', source: 'foot' }
    ],
    util: ['normalizeDate', 'normalizeType'],
    getAPIUrl: 'getAgentStatusList',
    pagEventName: 'changePage'
}

const generateScript = (o) => {
    let startStr = `<script>\n`;
    let endStr = `}\n</script>`;
    const addLine = (str, tabs) => {
        let tabStr = '';
        while (tabs--) { tabStr += `\t`; }
        startStr += tabStr + str + '\n';
    };
    // import
    o.components.forEach(v => addLine(`import ${v.name} from '${v.source}'`));
    addLine(`import { ${o.util.join(',')} } from 'util'`);
    addLine(`export default {`);
    addLine(`components:{`, 1);
    o.components.forEach(v => addLine(`${v.name}:${v.name},`, 2));
    addLine(`},`, 1);
    addLine(`data(){
        return {
            table_data:[],
            table_total:0,
            cur_iter:1,
        }
    },`, 1);
    addLine(`methods:{
        init(){
            this.getList();
        },
        doFilter(){

        },
        changeTab(i){
            this.cur_status = i;
            this.cur_iter = 1;
            this.getList();
        },
        getList(){
            this.$store.commit('doInit');
            ${o.getAPIUrl}(this.cur_iter).then(r=>{
                this.table_total = r.data.total;
                let l = r.data.list;
                normalizeType(l);
                this.table_data = l;
                this.$store.commit('initComplete');
            });
        },
        ${o.pagEventName}(i){
            this.cur_iter = i;
            this.getList();
        }
    },
    activated(){
        this.init();
    }`, 1);
    return startStr + endStr;
}
fs.writeFile('./test.vue', generateTemplate(tableData) + generateScript(scriptData), (err) => {
    if (err) throw err;
    console.log('complete');
});
