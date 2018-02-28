/*
  Example:
  <check-dialog 
  v-if="checkDialog_iter"
  title=''
  :visible='checkDialog_iter'
  @close='checkDialog_iter = false'>
      <div class="content">
          
      </div>
      <div class="dialog-btn" slot='btn'>
          <div class="kx-button submit" @click='submitCheck'>确认</div>
          <div class="kx-button cancel" @click='checkDialog_iter = false'>取消</div>
      </div>
  </check-dialog>
*/

<template>
    <transition name="fade">
        <div class="check-container" @click.self='close' v-show="visible">
            <div class="check-content" :style='styleObj'>
                <div class="dialog-head">
                    <p class='title'>{{title}}</p>
                    <i class='icon el-icon-close' @click='close'></i>
                </div>
                <div class="dialog-content">
                    <slot></slot>
                </div>
                <slot name='btn'></slot>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    name:'checkDialog',
    props:{
        visible: Boolean,
        title:{
            type: String,
            default:''
        },
        height: {
            type: String,
            default: '425px'
        },
        width: {
            type: String,
            default: '720px'
        },
        top: {
            type: String,
            default: '240px'
        }
    },
    data(){
        return {
            maskDom:null,
        }
    },
    watch:{
        
    },
    computed:{
        styleObj(){
            return {
                width: this.width,
                height: this.height,
                marginTop: this.top
            };
        }
    },
    methods:{
        close(){
            this.$emit('close');
        }
    },
    created(){
        if(!this.maskDom){
            const mask = document.createElement('div');
            mask.style = 'position:fixed;left:0;top:0;width:100%;height:100%;opacity:0.5;background:#000;z-index:2000;';
            this.maskDom = mask;
        }
    },
    mounted(){
        document.body.appendChild(this.maskDom);
    },
    destroyed(){
        document.body.removeChild(this.maskDom);
    }
}
</script>
<style lang="less">
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    .check-container{
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 2001;
        .check-content{
            position: relative;
            margin-left: 600px;
            background-color: #fff;
        }
        .dialog-head{
            background-color: #e3f2ff;
            height: 64px;
            width: 100%;
            line-height: 64px;
            .title{
                float: left;
                margin-left: 32px;
                font-size: 18px;
                color:#000a12;
                font-weight: bold;
            }
            .icon{
                margin-right: 32px;
                margin-top: 25px;
                float: right;
                font-weight: bold;
                cursor: pointer;
            }
        }
        .radio-content{
            margin-top: 120px;
            margin-left: 148px;
            .el-radio__label{
                font-size: 16px;
                color:#000a12;
            }
            .el-radio__inner{
                width: 18px;
                height: 18px;
            }
            .el-radio+.el-radio{
                margin-left: 300px;
            }
        }
        .dialog-btn{
            margin-top: 48px;
            margin-left: 230px;
            >div+div{
                margin-left: 40px;
            }
        }
    }
    .mask{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: .5;
    }
</style>
