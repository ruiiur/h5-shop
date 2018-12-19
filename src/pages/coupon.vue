<!--优惠券页面-->
<template>
    <div class="coupon">
       <div class="coupon-con">
           <img class="coupon-img" src="../assets/images/youhuiquan.png" alt="">
           <h2><a href="javascript:;" @click="couponTip=true">立即购买</a></h2>
           <img class="code" :src="codeUrl" alt="">
           <p>扫一扫立即购券</p>
       </div>
       <div class="coupon-alert">
            <alert v-model="couponTip"  hide-on-blur> 
                <p>您将支付<span>{{unitamt*num}}</span>元进行购买  确定购买？</p>
                <img :src="couponUrl" alt="">
                <div class="buy-num">
                    <label for="">购买数量：</label>
                    <p><i class="num-reduce" @click="reduceFun()"></i><em>{{num}}</em><i class="num-add" @click="addFun()"></i></p>
                    <span>￥{{unitamt*num}}元</span>
                </div>
                <h2>可抵{{deductionamt}}元 x{{num}}</h2>
                <a href="javascript:;" class="buy-btn" @click="buyFun()">立即购买</a>
                <a href="javascript:;" class="close" @click="couponTip=false"></a>
            </alert>
       </div>
       <service></service>
    </div>
</template>
<script>
import {
   finProOtherProduct,
   userInfo,
   couponAuthorize,
   getCoupon
} from "../services/index";
import tools from '../common/tools'
import service from '../components/service'
import {Alert } from 'vux'
export default {
    data(){
        return{
            couponTip:false,//优惠券提示框
            modalCoupon:false,//优惠券弹窗
            isHide:false,
            orgId:'',//当前店铺id
            deductionamt:'',//可抵金额
            unitamt:'',//单价
            num:1,//选择个数
            couponUrl:'',//优惠券图片
            codeUrl:'',//二维码图片
        }
    },
    methods: {
        couponInit(){
            if(tools.getLocalStorage('orgId')!=null&&tools.getLocalStorage('orgId')!="null"&&tools.getLocalStorage('orgId')!=undefined){
                // 调取首页接口
               this.orgId=tools.getLocalStorage("orgId");
            }
            else{
                 tools.setLocalStorage('orgId',window.location.hash.split('=')[1]);
                 this.orgId=tools.getLocalStorage("orgId");
            }
            
            // 授权
            if(tools.getSessionStorage('openId')!=null&&tools.getSessionStorage('openId')!="null"&&tools.getSessionStorage('openId')!=undefined){
                // 调取首页接口
                this.couponApi();
            }
            else{
                if(window.location.search.indexOf('code')!=-1){
                    let code=window.location.search.split('=')[1].split('&')[0];
                    console.log('code',code);
                    let params = {
                        'code':code,
                    }
                    console.log(params);
                    if(!tools.getLocalStorage('code')||code!=tools.getLocalStorage('code')){
                        tools.setLocalStorage('code',code);
                        userInfo(params).then((response)=>{
                            console.log(response);
                            if(response.meta.success==true){
                                console.log('获取直客用户信息接口成功');
                                tools.setLocalStorage('userType',response.data.userType);
                                tools.setSessionStorage('openId',response.data.openId);
                                tools.setSessionStorage('nickname',response.data.nickname);
                                tools.setSessionStorage('headImgUrl',response.data.headImgUrl);
                                tools.setSessionStorage('city',response.data.city);
                                tools.setSessionStorage('country',response.data.country);
                                tools.setSessionStorage('province',response.data.province);
                                tools.setSessionStorage('mobile',response.data.mobile);
                                // 调取首页接口
                                this.couponApi();
                            }
                            else{
                                console.log('获取直客用户信息接口失败');
                            }
                        }).catch((err)=>{
                            console.log('获取直客用户信息接口异常',err);
                            // this.$Message.info('获取直客用户信息接口异常');
                        });
                    }
                    else{
                        // 调取首页接口
                        this.couponApi();
                    }
                }
                else{
                    let params = {
                        'orgId':this.orgId,
                    }
                    console.log(params);
                    couponAuthorize(params).then((response)=>{
                        console.log('结果',response);
                        parent.location.href=response;
                    }).catch((err)=>{
                        console.log('直客用户授权接口异常',err);
                        // this.$Message.info('直客用户授权接口异常');
                    });
                }
            }
        },
        // 
        couponApi(){
            finProOtherProduct().then(response => {
                console.log(response);
                if (response.meta.success == true) {
                    console.log("获取优惠券产品接口成功");
                    this.unitamt=response.data.unitamt;//单价
                    this.deductionamt=response.data.deductionamt;//可抵金额
                    this.couponUrl=response.data.picurl;
                } else {
                    console.log("获取优惠券产品接口失败");
                }
            })
            .catch(err => {
                console.log("获取优惠券产品接口异常", err);
            });
            

            // 获取二维码
            let params={
                'orgId':this.orgId
            }
            getCoupon(params).then(response => {
                console.log(response);
                console.log("获取二维码接口成功");
                this.codeUrl=response;
            })
            .catch(err => {
                console.log("获取二维码接口异常", err);
            });
        },
        // 确认购买
        buyFun(){
            tools.setLocalStorage("couponNum",this.num);
            this.$router.push('/coupon-pay');
        },
        // 增加个数
        addFun(){
            this.num++;
        },
        // 减少个数
        reduceFun(){
            this.num--;
        }
    },
    mounted(){
        this.couponInit();
    },
    components: {
        Alert,
        service
    },
}
</script>

<style lang="scss">
.coupon-alert{
    .weui-dialog{
        border-radius: toRem(6px);
        max-width:toRem(655px);
        width:90%;
    }
    .weui-dialog__hd{
      padding-top: toRem(30px);  
    }
    .weui-dialog__bd{
        padding-bottom: toRem(50px);
        position: relative;
        .close{
            position: absolute;
            @include wh(toRem(40px),toRem(40px));
            background: url('../assets/images/guanbi.png') no-repeat center;
            background-size: toRem(17px) toRem(18px);
            right:toRem(10px);
            top:toRem(-40px);
        }
        >p{
            @include sc(toRem(28px),#333);
            >span{
                 @include sc(toRem(30px),#ffa100);
            }
        }
        >img{
            @include wh(toRem(380px),toRem(196px));
            margin: toRem(40px) 0; 
        }
        .buy-num{
            >label{
               @include sc(toRem(28px),#333); 
               display: inline-block;
               vertical-align: top;
               margin-top: toRem(7px);
            }
            >p{
               display: inline-block;
               line-height: toRem(56px);
               height: toRem(56px);
               font-size: 0;
                > i {
                    display: inline-block;
                    vertical-align: middle;
                    @include wh(toRem(53px), toRem(56px));
                }
                .num-reduce {
                    background: url("../assets/images/jian1.png") no-repeat;
                    background-size: 100%;
                }
                .num-add {
                    background: url("../assets/images/jia1.png") no-repeat;
                    background-size: 100%;
                }
                > em {
                    display: inline-block;
                    vertical-align: middle;
                    @include wh(toRem(63px), toRem(56px));
                    @include sc(toRem(28px),#fff);
                    line-height: toRem(56px);
                    background-image: linear-gradient(36deg, #5280eb 0%, #83b4fc 100%), linear-gradient(#ff2727, #ff2727);
                    text-align: center;
                } 
            }
            >span{
                @include sc(toRem(28px),#ffa100);
                margin-left: toRem(10px);
                display: inline-block;
                vertical-align: top;
                margin-top: toRem(7px);
            }
        }
        .buy-btn{
           @include wh(toRem(168px),toRem(65px));
           border-radius: toRem(6px);
           line-height: toRem(65px);
           text-align: center; 
           @include sc(toRem(28px),#fff);
           background-color: #ffba00;
           display: inline-block;
           margin-top: toRem(30px);
        }
        >h2{
            @include sc(toRem(28px),#333);
            margin-top: toRem(10px);
        }
    }
    .weui-dialog__btn{
        display: none;
    }
}
.coupon{
    background: url('../assets/images/coupon-bg.png') no-repeat;
    background-size: 100% 100%;
    min-height: calc(100vh - #{toRem(80px)});
    padding: toRem(350px) toRem(30px) 0 toRem(30px);
    box-sizing: border-box;
    .coupon-con{
        height: toRem(772px);
        background: url('../assets/images/coupon.png') no-repeat;
        background-size: 100% 100%;
        padding: toRem(80px) toRem(35px) 0 toRem(35px);
        box-sizing: border-box;
        text-align: center;
        .coupon-img{
            @include wh(toRem(605px),toRem(222px));
        }
        .code{
            @include wh(toRem(170px),toRem(170px));
        }
        >h2{
            line-height: toRem(42px);
            margin: toRem(50px) 0;
            >a{
                display: inline-block;
                background-image: linear-gradient(69deg, #5b8cfe 0%, #73aafc 100%);
                box-shadow: toRem(4px) toRem(4px) toRem(7px) 0px rgba(157, 189, 251, 0.75);
                @include wh(toRem(282px),toRem(70px));
                @include sc(toRem(42px),#fff);
                line-height: toRem(70px);
                border-radius: toRem(5px);
                text-align: center;
                background-size: cover;
            }
        }
        >p{
            @include sc(toRem(28px),#333);
            text-align: center;
        }
    }
}
</style>

