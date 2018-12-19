<!--这是定制游第一步页面-->
<template>
    <div class="custom-first">
        <!-- <img src="../assets/images/custom-bg.png" alt="">
        <div class="custom-con">
            <p class="demand-type">
                <a href="javascript:;" :class="demandIndex==1?'active':''" @click.stop.prevent="demandIndex=1">个人定制</a>
                <a href="javascript:;" :class="demandIndex==2?'active':''" @click.stop.prevent="demandIndex=2">公司定制</a>
            </p>
            <div class="change-city">
                <p @click="goOriginFun()">{{departure}}</p>
                <span></span>
                <p @click="goDestinationFun()"><span v-for="index in selectedDesList.length">{{selectedDesList[index-1]}}</span></p>
            </div>
            <div class="choose-date">
                <datetime v-model="startDay" @on-confirm="onStartDateConfirm">
                </datetime>
                <span>至</span>
                <datetime
                    v-model="endDay"
                    @on-confirm="onDateConfirm"
                >
                </datetime>
                <span>{{sumDay}}天</span>
            </div>
            <div class="choose-num">
                <popup-picker :data="numList" v-model="numDefault" popup-title="选择人数" placeholder= "请选择"></popup-picker>
            </div>
            <div class="capita">
                <input  v-model="capita" :max="9" type="tel" placeholder="预估人均预算（选填）">
            </div>
            <p class="step-submit">
                <a href="javavscript:;" @click="nextFun()">下一步</a>
            </p>
       </div> -->
       <div class="custom-top">
            <img src="../assets/images/custom-bg.png" alt="">
            <ul>
              <li :class="demandIndex==1?'active':''" @click.stop.prevent="demandIndex=1"><p>个人定制</p><i></i></li>
              <li :class="demandIndex==2?'active':''" @click.stop.prevent="demandIndex=2"><p>公司定制</p><i></i></li>
            </ul> 
       </div>
       <p class="custom-color"></p>
       <div class="custom-basic">
           <h2>基本信息</h2>
           <div>
                <div>
                    <label for="">出发地</label>
                    <p @click="goOriginFun()"><i v-if="departure==''">请输入您的出发地</i><span>{{departure}}</span></p>
                </div>
                <div>
                    <label for="">目的地</label>
                    <p @click="goDestinationFun()"><i v-if="selectedDesList.length==0">请选择您的目的地</i><span v-for="index in selectedDesList.length"> {{selectedDesList[index-1]}}</span></p>
                </div>
                <div class="choose-date">
                    <label for="">游玩日期</label>
                    <datetime v-model="startDay" @on-confirm="onStartDateConfirm" placeholder="出发日期"></datetime>
                    <span>至</span>
                    <datetime v-model="endDay" @on-confirm="onDateConfirm"></datetime>
                    <span>{{sumDay}}天</span>
                </div>
                <div class="choose-num">
                    <label for="">出行人数</label>
                    <popup-picker :data="numList" v-model="numDefault" popup-title="选择人数" placeholder= "请选择出行人数"></popup-picker>
                </div>
                <div class="capita">
                    <label for="">人均预算</label>
                    <input  v-model="capita" :max="9" type="tel" placeholder="请输入您的预算（选填）">
                </div>
           </div>
        </div>
        <p class="step-submit">
            <a href="javavscript:;" @click="nextFun()">下一步</a>
        </p>
       <toast v-model="showTip" type="text">{{tipText}}</toast>
       <service></service>
    </div>
</template>
<script>
import service from '../components/service'
import tools from '../common/tools'
import Vue from 'vue'
import { PopupPicker,Popup,Datetime,Toast } from 'vux'
export default {
    data(){
        return{
            departure:'',//出发地
            demandIndex:1,//定制游类型默认值
            capita:'',//预估人均预算
            selectedDesList:[],//选择的目的地
            // adultList:[],//成人数量
            // childList:[],//儿童数量
            numDefault: [1+'成人', 0+'儿童'],//默认成人儿童人数
            numList: [],//成人和儿童列表
            show:false,
            startDay:'',//开始日期
            endDay:'',//结束日期
            showTip:false,//提示框显隐
            tipText:'',//提示框文字
            sumDay:'',//总共天数
        }
    },
    methods: {
         //popup框显示
        onShow () {
            console.log('on show');
            this.openCity=!this.openCity;
        },
        //popup框隐藏
        onHide (type) {
            console.log('on hide', type);
             this.openCity=!this.openCity;
        },
        //popup框值改变
        onChange (val) {
            console.log('val change', val)
        },
        // 选择开始日期时
        onStartDateConfirm(val){
            if(this.endDay!=''){
                this.endDay='';
                this.showTip=true;
                this.tipText='请重新选择结束日期';
            }
        },
        // 选择结束日期
        onDateConfirm (val) {
            if(this.startDay==''){
                this.showTip=true;
                this.endDay='';
                this.tipText='请先选择开始日期';
                return;
            }
            console.log(this.startDay);
            console.log(val);
            if(this.startDay!=''){
                if(parseInt(this.startDay.split('-')[0])>parseInt(val.split('-')[0])){
                    this.showTip=true;
                    this.endDay='';
                    this.tipText='结束日期不能早于开始日期';
                    return;
                }
                else if(parseInt(this.startDay.split('-')[0])<=parseInt(val.split('-')[0])&&parseInt(this.startDay.split('-')[1])>parseInt(val.split('-')[1])){
                    this.showTip=true;
                    this.endDay='';
                    this.tipText='结束日期不能早于开始日期';
                    return;
                }
                else if(parseInt(this.startDay.split('-')[0])<=parseInt(val.split('-')[0])&&parseInt(this.startDay.split('-')[1])<=parseInt(val.split('-')[1])&&parseInt(this.startDay.split('-')[2])>parseInt(val.split('-')[2])){
                    this.showTip=true;
                    this.endDay='';
                    this.tipText='结束日期不能早于开始日期';
                    return;
                }
                else{
                    let date1=new Date(this.startDay);
                    let date2=new Date(val);
                    this.sumDay=parseInt((date2.getTime()-date1.getTime()) / (24 * 60 * 60 * 1000)) +1;
                    // this.sumDay=parseInt(val.split('-')[2]) - parseInt(this.startDay.split('-')[2]) +1;
                }
                
            }
        },
        log (str) {
        console.log(str)
        },
        goOriginFun(){
            this.$router.push('/custom-origin');
        },
        goDestinationFun(){
             this.$router.push('/custom-destination');
        },
        customFirstInit(){
            // 初始化定制游类型
            if(tools.getLocalStorage('demandIndex')){
                this.demandIndex=tools.getLocalStorage('demandIndex');
            }
            // 初始化出发地
            if(tools.getLocalStorage('departure')){
                this.departure=tools.getLocalStorage('departure');
            }
            // 初始化目的地
            if(tools.getLocalStorage('selectedDesList')){
                this.selectedDesList=JSON.parse(tools.getLocalStorage('selectedDesList'));
            }
            // 初始化开始日期
            if(tools.getLocalStorage('startDay')){
                // alert('1');
            
                this.startDay=tools.getLocalStorage('startDay');
                console.log(this.startDay);
            }
            // 初始化结束日期
            if(tools.getLocalStorage('endDay')){
                this.endDay=tools.getLocalStorage('endDay');
            }
            // 初始化成人和儿童人数
            if(tools.getLocalStorage('adultnum')&&tools.getLocalStorage('childnum')){
                this.numDefault=[];
                this.numDefault.push(tools.getLocalStorage('adultnum')+'成人');
                this.numDefault.push(tools.getLocalStorage('childnum')+'儿童');
            }
            // 初始化预估
            if(tools.getLocalStorage('capita')){
                this.capita=tools.getLocalStorage('capita');
            }
            // 初始化儿童和成人列表
            let adultArr=[];
            let childArr=[];
            for(let i=0;i<100;i++){
                adultArr.push(parseInt(i+1)+'成人');
                childArr.push(i+'儿童');
            }
            adultArr.push(100+'+'+'成人');
            childArr.push(100+'儿童');
            childArr.push(100+'+'+'儿童');
            this.numList.push(adultArr);
            this.numList.push(childArr);
        },
        // 下一步
        nextFun(){
            if(this.departure==''){
                this.showTip=true;
                this.tipText='请先选择出发地';
                return;
            }
            if(this.selectedDesList.length==0){
                this.showTip=true;
                this.tipText='请先选择目的地';
                return;
            }
            if(this.startDay==''){
                this.showTip=true;
                this.tipText='请选择开始日期';
                return;
            }
            if(this.endDay==''){
                this.showTip=true;
                this.tipText='请选择结束日期';
                return;
            }
            let adultnum=this.numDefault[0].split('成人')[0];//成人数
            let childnum=this.numDefault[1].split('儿童')[0];//儿童数
            tools.setLocalStorage('demandIndex',this.demandIndex);
            tools.setLocalStorage('startDay',this.startDay);
            tools.setLocalStorage('endDay',this.endDay);
            tools.setLocalStorage('adultnum',adultnum);
            tools.setLocalStorage('childnum',childnum);
            tools.setLocalStorage('capita',this.capita);
            this.$router.push('/custom-second/');
           
        }
    },
    created(){
        this.customFirstInit();
    },
    components: {
        PopupPicker,
        Popup,
        Datetime,
        Toast,
        service
    },
}
</script>

<style lang="scss" >
.custom-first{
    // overflow: scroll;
    // background: require(url('../assets/images/custom-bg.png')) no-repeat;
    // background-size: 100%;
    // padding: toRem(369px) toRem(30px) 0 toRem(30px);
    // position: relative;
    // >img{
    //     width:100%;
    //     position: absolute;
    //     top:0;
    //     z-index: -1;
    // }
    // .custom-con{
    //     box-shadow: 0px 0px toRem(50px) 0px rgba(0, 0, 0, 0.3);
    //     border-radius: toRem(20px);
    //     background: #fff;
    //     padding: toRem(20px) toRem(40px); 
    //     .demand-type{
    //         font-size: 0;
    //         text-align: center;
    //         >a{
    //             display: inline-block;
    //             @include wh(toRem(230px),toRem(70px));
    //             @include sc(toRem(26px),#999);
    //             line-height: toRem(70px);
    //             text-align: center;
    //             border: solid toRem(2px) #dddddd;
    //             &.active{
    //                 background-image:$main-bg;
    //                 @include sc(toRem(26px),#fff);
    //                 border:solid toRem(2px) transparent;
    //             }
    //             &:nth-child(1){
    //                 border-radius: toRem(34px) 0 0 toRem(34px);
    //             }
    //             &:nth-child(2){
    //                 border-radius: 0px toRem(34px) toRem(34px) 0px;
    //             }
    //         }
    //     }
    //     .change-city{
    //         margin-top: toRem(50px);
    //         font-size: 0;
    //         margin-bottom: toRem(25px);
    //         >p{
    //             display: inline-block;
    //             vertical-align: top;
    //             @include sc(toRem(24px),#18191a);
    //             border-bottom: toRem(2px) solid #d9d9d9;
    //             width:toRem(280px);
    //             padding-bottom: toRem(8px);
    //             height: toRem(24px);
    //             -webkit-tap-highlight-color:rgba(255,0,0,0);
    //             &:nth-child(3){
    //                 text-align: right;
    //                 overflow: hidden;
    //                 text-overflow: ellipsis;
    //                 // display: -webkit-box;
    //                 white-space:nowrap; 
    //                 >span{
    //                     @include sc(toRem(24px),#18191a);
    //                     &:after{
    //                         content: "";
    //                     } 
    //                     &:last-child{
    //                         &:after{
    //                             content: "";
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         >span{
    //             display: inline-block;
    //             vertical-align: middle;
    //             width:toRem(22px);
    //             height: toRem(6px);
    //             background: url('../assets/images/to.png') no-repeat;
    //             background-size: 100%;
    //             margin: 0 toRem(13px);
    //         }
    //     }
    //     .choose-date{
    //         padding:0 0 toRem(25px) 0;
    //         border-bottom:1px solid #d9d9d9;
    //         font-size:0;
    //         >span{
    //             display: inline-block;
    //             // vertical-align: top;
    //             @include sc(toRem(24px),#18191a);
    //             margin:toRem(3px) toRem(10px) 0 toRem(10px);
    //         }
    //         .vux-datetime{
    //             display: inline-block;
    //             vertical-align: top;
    //             width:toRem(150px);
    //             border:toRem(1px) solid #d9d9d9;
    //             .weui-cell__ft:after{
    //                 display: none;
    //             }
    //             .vux-cell-value{
    //                 display: inline-block;
    //                 width:toRem(150px);
    //                 @include sc(toRem(24px),#18191a);
    //             }
    //         }
    //         .weui-cell{
    //             font-size: 0;
    //             padding: 0;
    //             height: toRem(40px);
    //             line-height: toRem(30px);
    //             text-align: center;
    //             line-height: toRem(40px);
    //         }
    //         .weui-cell:before{
    //             border-top:none;
    //             height: 0;
    //         }
    //         .weui-cell__ft{
    //             text-align: center;
    //         }
    //     }
    //     .choose-num{
    //         border-bottom:1px solid #d9d9d9;
    //         font-size: 0;
    //         padding: toRem(25px) 0;
    //         .vux-popup-picker-select{
    //             text-align: left !important;
    //         }
    //         .vux-popup-picker-value{
    //             @include sc(toRem(24px),#18191a);
    //         }
    //         .weui-cell{
    //             padding: 0;
    //         }
    //     }
    //     .capita{
    //         font-size: 0;
    //         border-bottom:1px solid #d9d9d9;
    //         padding: toRem(40px) 0 toRem(15px) 0;
    //         >input{
    //             width:100%;
    //             -webkit-tap-highlight-color:rgba(255,0,0,0);
    //             @include sc(toRem(24px),#18191a);
    //             border:none;
    //             outline: none;
    //             &::placeholder{
    //                 @include sc(toRem(24px),#999);
    //             }
    //         }
    //     }
    // }
    .custom-top{
        text-align: center;
        >img{
            @include wh(toRem(549px),toRem(329px));
        }
        >ul{
            font-size: 0;
            padding: 0 toRem(30px);
            >li{
                display: inline-block;
                vertical-align: top;
                width: 50%;
                >p{
                    @include sc(toRem(28px),#333);  
                    margin-bottom: toRem(25px);
                }
                >i{
                    display: inline-block;
                    @include wh(toRem(47px),toRem(2px));
                    background: #fff;
                    border-radius: toRem(1px);
                }
                &.active{
                    >p{
                        @include sc(toRem(28px),$main-color);  
                    }
                    >i{
                        background: $main-color;
                    }
                }
            }
        }
    }
    .custom-color{
       height: toRem(18px);
       background:#f4f7fa; 
    }
    .custom-basic{
        >h2{
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
        >div{
            >div{
                padding-left: toRem(24px);
                height: toRem(90px);
                line-height: toRem(90px);
                border-bottom:1px solid #e1e1e1;
                font-size: 0;
                >label{
                    @include sc(toRem(28px),#333);
                    width:toRem(120px);
                    display: inline-block;
                    margin-right: toRem(49px);
                }
                >p{
                    display: inline-block;
                    >i{
                       @include sc(toRem(28px),#7d7d7d); 
                    }
                    >span{
                        @include sc(toRem(28px),#333);
                    }
                }
            }
            .choose-date{
                // padding:0 0 toRem(25px) 0;
                // border-bottom:1px solid #d9d9d9;
                font-size:0;
                >span{
                    display: inline-block;
                    // vertical-align: top;
                    @include sc(toRem(28px),#333);
                    margin:0 toRem(15px) 0 toRem(15px);
                }
                .vux-datetime{
                    display: inline-block;
                    vertical-align: top;
                    width:toRem(150px);
                    border:toRem(1px) solid #d9d9d9;
                    margin-top: toRem(25px);
                    .weui-cell__ft:after{
                        display: none;
                    }
                    .vux-cell-value{
                        display: inline-block;
                        width:toRem(150px);
                        @include sc(toRem(24px),#18191a);
                    }
                }
                .weui-cell{
                    font-size: 0;
                    padding: 0;
                    height: toRem(40px);
                    line-height: toRem(30px);
                    text-align: center;
                    line-height: toRem(40px);
                }
                .weui-cell:before{
                    border-top:none;
                    height: 0;
                }
                .weui-cell__ft{
                    text-align: center;
                }
            }
            .choose-num{
                // border-bottom:1px solid #d9d9d9;
                font-size: 0;
                // padding: toRem(25px) 0;
                .vux-popup-picker-select{
                    text-align: left !important;
                }
                .vux-popup-picker-value{
                    @include sc(toRem(28px),#333);
                }
                .weui-cell{
                    padding: 0;
                }
                .vux-cell-box{
                    display: inline-block;
                    height: toRem(90px);
                    &::before{
                       height: 0;
                       border-top: none; 
                    }
                }
                .weui-cell__ft{
                    display: none;
                }
            }
            .capita{
                font-size: 0;
                // border-bottom:1px solid #d9d9d9;
                // padding: toRem(40px) 0 toRem(15px) 0;
                >input{
                    // width:100%;
                    -webkit-tap-highlight-color:rgba(255,0,0,0);
                    @include sc(toRem(28px),#333);
                    border:none;
                    outline: none;
                    &::placeholder{
                        @include sc(toRem(28px),#7d7d7d);
                    }
                }
            }
        }
    }
    .step-submit{
        text-align: center;
        margin-top: toRem(120px);
        padding: 0 toRem(45px);
        width: 100%;
        box-sizing: border-box;
        margin-bottom: toRem(20px);
        >a{
            width: 100%;
            display: inline-block;
            background-image:$main-bg;
            border-radius: toRem(6px);
            height:toRem(80px);
            line-height: toRem(80px);
            text-align: center;
            @include sc(toRem(28px),#fff);
        }
    }
    .vux-popup-header-title{
        color:red;
    }
}
</style>


