<!--这是订单详情页面-->
<template>
    <div class="order-details">
       <div class="order-information">
           <h2 v-if="orderInfo.datastatus==1" class="wait">待付款<a href="javascript:;" @click="toPayFun">去支付<i></i></a></h2>
           <!-- 暂时隐藏 -->
           <!-- <div class="order-title">
                <p>{{orderInfo.ordername}}</p>
                <a :href="'#/details/'+proId+'/'+orderInfo.siteid">查看详情<i></i></a>
           </div> -->
           <div class="order-trip">
               <div>
                   <h2>{{orderInfo.depname}}</h2>
                   <p>出发地</p>
               </div>
               <div class="trip-icon">
                   <p>{{orderInfo.routetypename}}</p>
                   <i></i>
               </div>
               <div>
                   <h2>{{orderInfo.destname}}</h2>
                   <p>目的地</p>
               </div>
           </div>
           <div class="order-other">
               <p><label for="">总价</label><i>￥{{orderInfo.payableamt}}</i></p>
               <p><label for="">订单编号</label><span id="order-no">{{orderInfo.orderno}}</span><a href="javascript:;" data-clipboard-target="#order-no" ref="copy" class="copy" @click="copy">复制</a></p>
               <p><label for="">下单时间</label><span>{{orderInfo.createddate}}</span></p>
               <p>
                    <label for="">订单状态</label>
                    <span v-if="orderInfo.datastatus==0 || orderInfo.datastatus==2">待确认</span>
                    <span v-if="orderInfo.datastatus==1">待付款</span>
                    <span v-if="orderInfo.datastatus==4">已支付</span>
                    <span v-if="orderInfo.datastatus==3">支付待确认</span>
                    <span v-if="orderInfo.datastatus==-1">已取消</span>
                </p>
           </div>
       </div>
       <p class="margin-color"></p>
       <div class="contact-information">
           <h2>游客联系人信息</h2>
           <div>
               <p><label for="">联系人：</label><span>{{orderInfo.contact}}</span></p>
               <p><label for="">联系号码：</label><span>{{orderInfo.mobile}}</span></p>
               <p><label for="">备注：</label><span> {{orderInfo.comment}}</span></p>
           </div>
       </div>
        <p class="margin-color"></p>
       <div class="tour-information">
           <h2>游客信息</h2>
           <div>
               <div v-for="(tour,_index) in orderTourList" class="tour-con">
                    <div>
                        <label for="">姓名：</label>
                        <span> {{tour.guestname}}</span>
                    </div>
                    <div class="tourist-sex">
                        <label for="">性别：</label>
                        <span>{{tour.guestsex}}</span>
                    </div>
                    <div>
                        <label for="">证件号码：</label>
                        <span>{{tour.guestcard}}</span>
                    </div>
                    <div>
                        <label for="">手机：</label>
                        <span>{{tour.guesttelphone}}</span>
                    </div>
                    <div>
                        <label for="">接送地点：</label>
                        <span>{{tour.pickname}}</span>
                    </div>
                </div>
           </div>
       </div>
       <toast v-model="showTip" type="text">{{tipText}}</toast>
       <service></service>
    </div>
</template>
<script>
import tools from '../common/tools'
import { Toast } from 'vux'
import { getOrderInfoDetail } from "../services/index";
import service from '../components/service'
export default {
    data(){
        return{
            orderTourList:[],//游客信息
            orderInfo:'',//订单信息
            proId:'',
            showTip:false,//弹框是否显示
            tipText:'',//弹框内容
        }
    },
    methods: {
        // 去订单支付页面
        toPayFun(){
            this.$router.push('/payment/'+this.$route.params.id+'/'+tools.getLocalStorage('orgId'));
        },
        // 复制订单号
        copy() {  
            console.log('复制');
            let clipboard = this.copyBtn;
            clipboard.on('success', e => {  
                this.showTip=true;
                this.tipText="复制成功";
                // 释放内存  
                clipboard.destroy()  
                })  
            clipboard.on('error', e => {  
                // 不支持复制  
                this.showTip=true;
                this.tipText="该浏览器不支持自动复制";
                console.log('该浏览器不支持自动复制')  
                // 释放内存  
                clipboard.destroy()  
            })  
        },
        orderDetailsInit(){
            // 订单详情接口
            let params = this.$route.params.id;
            getOrderInfoDetail(params).then((response) => {
                console.log(response);
                console.log('订单详情');
                this.orderTourList=response.ordOrderTourists;
                this.orderInfo=response.ordOrderinfo;
                this.proId=response.proId;
                }).catch(err => {
                    console.log("订单详情接口获取异常", err);
            });
        }
    },
    mounted(){
        this.orderDetailsInit();
        this.copyBtn = new this.clipboard(this.$refs.copy);
    },
    components: {
      Toast,
      service
    },
}
</script>

<style lang="scss">
.order-details{
    .margin-color{
        height: toRem(17px);
        background: #f0f1f5;
    }
    .order-information{
        .wait{
            height: toRem(66px);
            line-height: toRem(66px);
            padding: 0 toRem(22px);
            @include sc(toRem(30px),#333);
            background: #f0f1f5;
            font-weight: bold;
            >a{
                @include sc(toRem(24px),#333);
                float: right;
                font-weight: normal;
                >i{
                    display: inline-block;
                    @include wh(toRem(14px),toRem(24px));
                    margin-left: toRem(23px);
                    background: url('../assets/images/pay-right.png') no-repeat;
                    background-size: 100%;
                    vertical-align: top;
                    margin-top: toRem(20px);
                }
            }
        }
        .order-title{
            padding: toRem(24px) toRem(28px);
            >p{
                line-height: toRem(40px);
                @include sc(toRem(28px),#333);
                width:toRem(504px);
                display: inline-block;
                vertical-align: middle;
                margin-right: toRem(40px);
            }
            >a{
                display: inline-block;
                vertical-align: middle;
               @include sc(toRem(24px),#ffba00);
                >i{
                    display: inline-block;
                    @include wh(toRem(12px),toRem(20px));
                    background: url('../assets/images/about.png') no-repeat;
                    background-size:100%;
                    margin-left: toRem(20px);
                } 
            }
        }
        .order-trip{
            height: toRem(114px);
            // border-top:1px solid #e1e1e1;
            border-bottom:1px solid #e1e1e1;
            padding: toRem(24px) 0 0;
            box-sizing: border-box;
            >div{
                display: inline-block;
                vertical-align: top;
                text-align: center;
                width:32%;
                >h2{
                    @include sc(toRem(28px),#333);  
                }
                >p{
                    @include sc(toRem(23px),#7d7d7d);  
                }
                &:last-child{
                    float: right;
                }
            }
            .trip-icon{
                position: relative; 
                >i{
                    width:toRem(182px);
                    height: toRem(22px);
                    display: inline-block;
                    // margin-top: toRem(40px);
                    background: url('../assets/images/fly-no.png') no-repeat;
                    background-size: 100%;
                }
                >p{
                    position: absolute;
                    width:100%;
                    text-align: center;
                }
            }
        }
        .order-other{
            padding-left: toRem(28px);
            padding-bottom: toRem(20px);
            padding-top: toRem(20px);
            >p{
                font-size: 0;
                line-height: toRem(40px);
               >label{
                   @include sc(toRem(28px),#333);
                   text-align: justify;
                   text-justify:distribute-all-lines;
                   display: inline-block;
                   width:toRem(120px);
                   margin-right: toRem(92px);
               } 
               >span{
                   @include sc(toRem(27px),#333);
               }
               >i{
                  @include sc(toRem(28px),#ffba00); 
               }
               .copy{
                   display: inline-block;
                   @include wh(toRem(106px),toRem(46px));
                   border-radius: toRem(4px);
                   border:1px solid #ebebeb;
                   line-height: toRem(44px);
                   text-align: center;
                   @include sc(toRem(24px),#555);
                   float: right;
                   margin-right: toRem(40px);
                   margin-top: toRem(-5px);
                   box-sizing: border-box;
               }
            }
        }
    }
    .contact-information{
        >h2{
            @include sc(toRem(29px),#18191a);
            height: toRem(85px);
            line-height: toRem(85px);
            border-bottom: solid 1px #a0a0a0;
            padding-left: toRem(20px);
            // font-weight: bold;
            &::before{
                content:'';
                display: inline-block;
                @include wh(toRem(8px),toRem(21px));
                background-image: $main-bg;
                margin-right: toRem(20px);
            }
        }
        >div{
            padding-left: toRem(28px);
            padding-bottom: toRem(20px);
            padding-top: toRem(10px);
            >p{
                line-height: toRem(40px);
                >label{
                   @include sc(toRem(28px),#333);
                   text-align: justify;
                   text-justify:distribute-all-lines;
                   display: inline-block;
                   width:toRem(140px);  
                }
                >span{
                   @include sc(toRem(27px),#333);
                }
            }
        }
    }
    .tour-information{
        margin-bottom: toRem(20px);
        >h2{
            @include sc(toRem(29px),#18191a);
            height: toRem(85px);
            line-height: toRem(85px);
            border-bottom: solid 1px #a0a0a0;
            padding-left: toRem(20px);
            // font-weight: bold;
            &::before{
                content:'';
                display: inline-block;
                @include wh(toRem(8px),toRem(21px));
                background-image: $main-bg;
                margin-right: toRem(20px);
            }
        }
        >div{
            padding:0 toRem(28px);
            .tour-con{
                border-bottom: 1px solid #e1e1e1;
                padding-bottom: toRem(30px);
                padding-top: toRem(10px);
                >div{
                    line-height: toRem(40px);
                    >label{
                        @include sc(toRem(28px),#333);
                        text-align: justify;
                        width:toRem(140px);
                        display: inline-block;
                        // float: left; 
                        // &:after{
                        //     content:'.';
                        //     width: 100%;
                        //     display: inline-block;
                        //     overflow: hidden;
                        //     height: 0;
                        // } 
                    }
                    >span{
                        @include sc(toRem(27px),#333);
                    }
                }
                &:last-child{
                    border-bottom: none;
                }
            } 
        }
    }
}
</style>