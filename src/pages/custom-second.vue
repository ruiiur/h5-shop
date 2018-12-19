<!--这是定制游第二步页面-->
<template>
    <div class="custom-second">
        <!-- 联系人信息 -->
       <div class="contact-info">
            <p>联系人信息</p>
            <group>
                <x-input type="text" title="联系人" v-model="travellerName"  placeholder="请输入联系人姓名"></x-input>
                <x-input type="tel" title="手机号码" v-model="travellerTel" placeholder="请输入手机号码" ></x-input>
                <x-input type="text" title="电子邮箱" v-model="travellerEmail"  placeholder="选填，方便接收行程相关资料" ></x-input>
                <x-input type="text" title="微信号"  v-model="travellerWechat"  placeholder="选填，方便定制师联系您" ></x-input>
            </group>
       </div>
       <p class="custom-color"></p>
       <!-- 定制师选择 -->
       <div class="custom-division">
           <p>最多几位定制师联系我</p>
           <div>
                <a href="javascript:;" @click.stop.prevent="serviceIndex=1" :class="serviceIndex==1?'active':''">1位</a>
                <a href="javascript:;" @click.stop.prevent="serviceIndex=2" :class="serviceIndex==2?'active':''">2位</a>
            </div>
       </div>
       <p class="custom-color"></p>
       <!-- 服务选择 -->
       <div class="provide-services">
           <p>需要提供的服务（多选）</p>
           <ul class="character-list">
                <li href="javascript:;" v-for="(demand,index) in demandList" :class="demand.selected==true?'active':''" @click.stop.prevent="serviceSelected(demand)">{{demand.servicename}}</li>
            </ul>
            <div href="javascript:;"></div>
       </div>
       <p class="custom-color"></p>
       <!-- 定制游标签 -->
        <div class="provide-services">
           <p>定制游标签（多选）</p>
           <ul class="character-list">
                <li href="javascript:;" v-for="(tag,index) in allTagList" :class="tag.selected==true?'active':''" @click.stop.prevent="tagSelected(tag)">{{tag.tagname}}</li>
            </ul>
            <div href="javascript:;"></div>
       </div>
       <p class="custom-color"></p>
       <!-- 个性化需求 -->
        <div class="other">
            <p>更多个性化需求</p>
            <textarea v-model="otherRequire" placeholder="选填，您可以在此输入更多个性化需求。"></textarea>
        </div>
        <p>
            <a href="javascript:;" @click="demandSubmitFun()">免费获取方案</a>
        </p>
        <!-- 订单提交后的提示框 -->
        <div class="demand-tip" v-transfer-dom>
            <alert v-model="demandSubmitTip"  @on-show="demandTipShow" @on-hide="demandTipHide" hide-on-blur> 
               <img src="../assets/images/custom-submit.png" alt="" v-if="submitState==true">
               <img src="../assets/images/submit-fail.png" alt="" v-if="submitState==false">
               <p v-if="submitState==true">订单提交成功！</p>
               <p v-if="submitState==false" class="fail">订单提交失败！</p>
               <h2 v-if="submitState==true">需求单号：{{demandNo}}</h2>
               <h2 v-if="submitState==false">请核对信息重新提交</h2>
               <a v-if="submitState==true" :href="'#/home?orgId='+orgId">返回首页</a>
            </alert>
        </div>
        <toast v-model="showTip" type="text">{{tipText}}</toast>
        <service></service>
    </div>
</template>
<script>
import service from '../components/service'
import tools from '../common/tools'
import {getServcieType,insertCustom,getAllTag} from '../services/index'
import { PopupPicker,XInput,Group,Popup,Alert,TransferDomDirective as TransferDom,Toast } from 'vux'
export default {
    data(){
        return{
            serviceIndex:1,//定制师人数
            demandList:[],//服务类型列表
            demandSelectedList:[],// 服务类型选择列表
            demandIdList:[],// 服务类型id列表
            demandSubmitTip:false,//订单提交后的提示框的显隐
            submitState:false,//订单提交状态
            travellerName:'',//联系人姓名
            travellerTel:'',//联系人手机
            travellerEmail:'',//联系人邮箱
            travellerWechat:'',//联系人微信号
            otherRequire:'',//其他需求
            demandNo:'',//需求单号
            showTip:false,//提示框显隐
            tipText:'',//提示框文字
            allTagList:[],//所有标签列表
            allTagIdList:[],//标签列表
            orgId:'',
        }
    },
    methods: {
        // 提示框显隐方法
        demandTipHide () {
            console.log('on hide')
        },
        demandTipShow () {
            console.log('on show')
        },
        // 定制游步骤二初始化
        customSecondInit(){
            this.orgId=tools.getLocalStorage('orgId');
            // 获取url中的id
            this.demandIndex=this.$route.params.type;
            console.log(this.demandIndex);
            getServcieType().then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('服务类型数据获取成功');
                    this.demandList=response.data;
                    // demandIdList
                    for(let i=0;i<this.demandList.length;i++){
                        this.$set(this.demandList[i], 'selected', true);
                        this.demandIdList.push(this.demandList[i].id);
                        this.demandSelectedList.push(this.demandList[i].servicename);
                    }
                }
                else{
                    console.log('服务类型数据获取失败');
                }
            }).catch((err)=>{
                console.log('服务类型接口获取异常',err);
                // this.$Message.info('服务类型接口获取异常');
            });

            // 定制游标签
            getAllTag().then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('定制游标签获取成功');
                    this.allTagList=response.data;
                    // // demandIdList
                    for(let i=0;i<this.allTagList.length;i++){
                        this.$set(this.allTagList[i], 'selected', false);
                        this.allTagIdList.push(this.allTagList[i].id);
                        // this.demandSelectedList.push(this.demandList[i].servicename);
                    }
                }
                else{
                    console.log('定制游标签获取失败');
                }
            }).catch((err)=>{
                console.log('定制游标签获取异常',err);
            });
        },
        // 服务类型选择
        serviceSelected(obj){
            obj.selected=!obj.selected;
            console.log(this.demandList);
            this.demandIdList=[];
            this.demandSelectedList=[];
            if(this.demandList.length!=0){
                for(let i=0;i<this.demandList.length;i++){
                    if(this.demandList[i].selected==true){
                        this.demandIdList.push(this.demandList[i].id);
                        this.demandSelectedList.push(this.demandList[i].servicename);
                    }
                }
            }
            // console.log(this.demandSelectedList);
        },

        // 定制游标签选择
        tagSelected(obj){
            obj.selected=!obj.selected;
            this.allTagIdList=[];
            if(this.allTagList.length!=0){
                for(let i=0;i<this.allTagList.length;i++){
                    if(this.allTagList[i].selected==true){
                        this.allTagIdList.push(this.allTagList[i].id);
                    }
                }
            }
            console.log(this.allTagIdList);
        },
        //判断联系人订单是否填写
        judgePersonIsCorrect() {
            if(tools.trim(this.travellerName) == ''){
                this.showTip=true;
                this.tipText = '姓名不能为空';
                return false;
            }
            if(tools.trim(this.travellerTel) == '') {
                this.showTip=true;
                this.tipText = '手机号码不能为空';
                return false;
            }
            let pattern = /^[1][3,4,5,7,8][0-9]{9}$/;
            if(!pattern.test(this.travellerTel)){
                this.showTip=true;
                this.tipText = '请输入正确的手机号码';
                return false;
            }
            let patternEmail=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
            if(!patternEmail.test(this.travellerEmail)&&this.travellerEmail!=''){
                this.showTip=true;
                this.tipText = '请输入正确的邮箱';
                return false;
            }
            let patternWechat=/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/;
            if(!patternWechat.test(this.travellerWechat)&&this.travellerWechat!=''){
                this.showTip=true;
                this.tipText = '请输入正确的微信号';
                return false;
            }
       },
        // 提交方法
        demandSubmitFun(){
            if(this.judgePersonIsCorrect()==false){
                return ;
            }
            let params={
                "adultnum":tools.getLocalStorage('adultnum'), 
                "budget":tools.getLocalStorage('capita'),
                "childnum":tools.getLocalStorage('childnum'),
                "customernum":this.serviceIndex,
                "custype":tools.getLocalStorage('demandIndex'),
                "siteid":tools.getSessionStorage('siteId'),
                "departure":tools.getLocalStorage('departure'),
                "departureid":tools.getLocalStorage('departureId'),
                "destinations":JSON.parse(tools.getLocalStorage('selectedDesList')),
                "destinationids":JSON.parse(tools.getLocalStorage('selectedDesIdList')),
                "email":this.travellerEmail,
                "mobile":this.travellerTel,
                "otherrequire":this.otherRequire,
                "servicetypes":this.demandIdList,
                "startDateStr":tools.getLocalStorage('startDay'),
                "endDateStr":tools.getLocalStorage('endDay'),
                "travellername":this.travellerName,
                "wechat":this.travellerWechat,
                "tags":this.allTagIdList,
                'supplierid': tools.getLocalStorage("orgId"),
                'transferSupplierNames':tools.getSessionStorage('travelAgencyName'),
            }
            //  需求数据存入接口
            insertCustom(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('需求数据存入成功');
                    tools.setLocalStorage('demandNo',response.meta.message);
                    this.demandNo=response.meta.message;
                    this.submitState=true;
                    this.demandSubmitTip=true;
                    // this.$Message.info('保存数据成功');
                    // this.$router.push('/process/4');
                }
                else{
                    console.log('需求数据存入失败');
                    this.submitState=false;
                    this.demandSubmitTip=true;
                }
            }).catch((err)=>{
                console.log('需求数据存入接口异常',err);
                // this.$Message.info('需求数据存入接口异常');
            });
        }
    },
    mounted(){
        this.customSecondInit();
    },
    directives: {
        TransferDom
    },
    components: {
        XInput,
        Group,
        Alert,
        Toast,
        service
    },
}
</script>

<style lang="scss">
.demand-tip{
    .weui-dialog{
        border-radius: toRem(10px);
        max-width:toRem(690px);
        width:90%;
    }
    .weui-dialog__ft,.weui-dialog__hd{
        display: none;
    }
    .weui-dialog__bd{
        padding: toRem(20px) 0 toRem(40px) 0;
        >img{
            @include wh(toRem(200px),toRem(168px));
            margin-bottom: toRem(40px);
        }
        >p{
            @include sc(toRem(26px),$main-color);
            &.fail{
               @include sc(toRem(26px),#e6182d); 
            }
        }
        >h2{
            @include sc(toRem(26px),#999); 
            line-height: toRem(26px);
            margin: toRem(20px) 0 toRem(40px) 0;
        }
        >a{
            display: inline-block;
            background-image: $main-bg;
	        border-radius: toRem(10px);
            width:toRem(220px);
            height: toRem(60px);
            line-height: toRem(60px);
            @include sc(toRem(24px),#fff);
        }
    }
}
.custom-second{
    // padding: toRem(20px) toRem(30px) toRem(20px);
    .custom-color{
        height: toRem(18px);
        background:#f4f7fa; 
    }
    >div:not(.vux-toast){
        // box-shadow: 0px 0px toRem(20px) 0px rgba(0, 0, 0, 0.1);
	    // border-radius: toRem(20px);
        margin-bottom: toRem(20px);
        // padding:0 toRem(40px) 0 toRem(28px);
        >p{
            height: toRem(74px); 
            border-bottom:1px solid #e1e1e1;
            @include sc(toRem(32px),#333);
            line-height: toRem(73px);
            padding-left: toRem(22px);
            &::before{
                content: '';
                display: inline-block;
                @include wh(toRem(4px),toRem(19px));
                background:$main-color; 
                margin-right: toRem(16px);
            }
        }
    }
    .contact-info{
        >div{
            .weui-cells{
                margin-top: 0 !important;
            }
            .weui-cell{
                padding-left: toRem(21px);
                padding-top: toRem(25px);
                padding-bottom: toRem(26px);
            }
            .weui-cells:before{
                content: " ";
                height: 0 !important;
                border-top:none;
            }
            .weui-cells:after{
                left: toRem(10px);
            }
            .weui-cell:before{
                left: toRem(10px);
            }
            .weui-label{
                display: inline-block;
                width:toRem(120px) !important;
                @include sc(toRem(28px),#333);
                margin-right: toRem(43px);
            }
            .weui-input:-moz-placeholder{
                @include sc(toRem(28px),#7d7d7d);
            }
            .weui-input{
                 -webkit-tap-highlight-color:rgba(255,0,0,0);
                @include sc(toRem(28px),#333);
            }
        }

    }
    .custom-division{
        >div{
            margin-top: toRem(30px); 
            padding-left: toRem(20px);
            >a{
                display: inline-block;
                vertical-align: top;
                width: toRem(140px);
                height: toRem(68px);
                line-height: toRem(68px);
                text-align: center;
                border: solid 1px #e1e1e1;
                border-radius: toRem(10px);
                @include sc(toRem(26px),#333);
                margin-right: toRem(20px);
                box-sizing: border-box;
               &:last-child{
                     margin-right: 0;
                }
                &.active{
                    background-image: $main-bg;
                    @include sc(toRem(26px),#fff);
                    border:none;
                    line-height: toRem(68px);
                }
            }
        }
    }
    .provide-services{
        padding-bottom: 0;
        .character-list{
            margin-top: toRem(30px);
             padding-left: toRem(20px);
            >li{
                float: left;
                width: toRem(147px);
                height: toRem(68px);
                // padding: 0 toRem(10px);
                line-height: toRem(66px);
                text-align: center;
                border: solid 1px #e1e1e1;
                border-radius: toRem(10px);
                @include sc(toRem(26px),#333);
                margin-right: toRem(35px);
                margin-bottom: toRem(25px);
                box-sizing: border-box;
                &:nth-child(4),&:last-child{
                     margin-right: 0;
                }
                &.active{
                    background-image: $main-bg;
                    @include sc(toRem(26px),#fff);
                    border:none;
                    line-height: toRem(68px);
                }
            }
        }
        >div{
            clear: both;
        }
    }
    .other{
        // height: toRem(240px);
        box-sizing: border-box;
        >textarea{
            width: calc(100% - #{toRem(40px)});
            margin: toRem(40px) toRem(20px) 0;
            padding: toRem(24px);
            @include sc(toRem(26px),#333);
            resize: none;
            height: toRem(350px);
            box-sizing: border-box;
            border: solid 1px #e1e1e1;
            // border:none;
            outline: none;
            border-radius: toRem(6px);
            &:-moz-placeholder{
                @include sc(toRem(26px),#7d7d7d);

            }
        }
    }
    >p{
        text-align: center;
        margin-top: toRem(28px);
        margin-bottom: toRem(20px);
        >a{
            display: inline-block;
            background-image:$main-bg;
            border-radius: toRem(10px);
            padding: 0 toRem(215px);
            height:toRem(80px);
            line-height: toRem(80px);
            text-align: center;
            @include sc(toRem(28px),#fff);
        }
    }
}
</style>

