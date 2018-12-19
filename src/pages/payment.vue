<!--这是线下支付页面-->
<template>
    <div class="payment">
        <div class="payment-top">
            <h2>待支付</h2>
            <h3>￥{{orderInfo.payableAmt}}</h3>
            <div>
                <div>
                    <p>订单编号：</p>
                    <p>{{orderInfo.orderNo}}</p>
                </div>
                <div>
                    <p>出游日期：</p>
                    <p>{{orderInfo.tourDate}}至{{orderInfo.returnDate}}</p>
                </div>
            </div>
        </div>
        <div class="order-info">
            <h3>订单名称：</h3>
            <p>{{orderInfo.aliaseName}}</p>
            <div>
                <div>
                    <h2>人数：</h2>
                    <p><span v-if="orderInfo.adultNum!=0">成人 <i>{{orderInfo.adultNum}}</i></span><span v-if="orderInfo.childNum!=0">儿童 <i>{{orderInfo.childNum}}</i></span></p>
                </div>
                <div>
                    <h2>供应商：</h2>
                    <p>{{orderInfo.supplierName}}</p>
                </div>
            </div>
        </div>
        <div class="paymethod" v-if="finReceivingSets.length!=0">
            <h2>快捷支付</h2>
            <div class="online-pay" v-for="(set,index) in finReceivingSets" v-if="index==0">
                <div class="card-wx" v-if="set.wechatpay!=null" @click="selectWx(set)">
                    <h2><img src="../assets/images/WeChat.png" alt="">微信转账</h2>
                    <p>账号：{{set.wechatpay}}</p>
                    <p>姓名：{{set.wechatpayuser}}</p>
                    <i :class="payWay=='微信'?'active':''"></i>
                </div>
                <div class="card-alipay" v-if="set.alipay!=null" @click="selectAli(set)">
                    <h2><img src="../assets/images/Paytreasure.png" alt="">支付宝转账</h2>
                    <p>账号：{{set.alipay}}</p>
                    <p>姓名：{{set.alipayuser}}</p>
                    <i :class="payWay=='支付宝'?'active':''"></i>
                </div>
            </div>
        </div>
        <div class="off-pay" v-if="finBankAccounts.length!=0">
            <h2>银行卡支付</h2>
            <div>
                <div v-for="(bank,index) in finBankAccounts" @click="selectBank(bank)">
                    <h2>开户银行：{{bank.depositbank}}</h2>
                    <p>收款账号：{{bank.bankaccount}}</p>
                    <p>开户人：{{bank.cardholder}}</p>
                    <p>备注：{{bank.comment}}</p>
                    <i :class="payNo==bank.bankaccount?'active':''"></i>
                </div>
            </div>
        </div>
        <div class="pay-way">
            <p>付款方式：<span>转账支付</span></p>
            <p>卖家收款账号：<span>{{payWay}}-{{payNo}}</span></p>
        </div>
        <div class="pay-credentials">
            <h2>付款凭证：</h2>
            <div>
                <ul v-for="img in uploadImgList">
                    <li><img :src="img.filepath" alt="" @click="clickImg($event)"><i @click="cancelImg(img)"></i></li>
                </ul>
                <div>
                    <img src="../assets/images/upload.png" alt="" >
                    <input accept="image/*" type="file" multiple  @change="onFileChange">
                </div>
            </div>
        </div>
        <div class="pay-comment">
            <label for="">备注：</label>
            <textarea name="" id="" v-model="comment" placeholder="请输入备注"></textarea>
        </div>
        <a href="javascript:;" class="pay-btn" @click="paySubmit">申请支付</a>
        <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
        <toast v-model="showTip" type="text">{{tipText}}</toast>
        <service></service>
    </div>
</template>
<script>
import service from '../components/service'
import BigImg from '../components/big-img'
import tools from '../common/tools'
import { Toast } from 'vux'
import { postPayment,uploadPayImg,getBankAccount,getOrderInfoForPay } from '../services/index'
import { setTimeout } from 'timers';
export default {
    data(){
        return{
            comment:'',//备注
            logoPic:'', 
            orderId:'',//订单id
            orgId:'',
            orderInfo:'',//订单详情
            finReceivingSets:[],//
            finBankAccounts:[],
            uploadImgList:[],//上传的凭证
            payableAmt:'',//付款金额
            payWay:'',//付款方式
            payNo:'',//付款账号
            bank:'',//开户银行
            bankId:'',//开户银行id
            showImg:false,//大图是否显示
            imgSrc: '',//大图路径
            showTip:false,//弹框是否显示
            tipText:'',//弹框内容
            payState:1,//禁止重复提交标识
        }
    },
    methods: {
         // 显示图片
        clickImg(e) {
            this.showImg = true;
            // 获取当前图片地址
            this.imgSrc = e.currentTarget.src;
        },
        // 隐藏图片
        viewImg(){
            this.showImg = false;
        },
        // 删除图片
        cancelImg(img){
            let i=img-1;
            this.uploadImgList.splice(i,1);
        },
        paymentInit(){
            this.logoPic=tools.getLocalStorage('logoPic');
            this.orderId=this.$route.params.orderId;
            this.orgId=this.$route.params.orgId;

            //  订单详情接口
            let paramsOrder={
                'orderId':this.orderId,
            }
            getOrderInfoForPay(paramsOrder).then(response => {
                console.log(response);
                if (response.meta.success == true) {
                    console.log("订单详情获取成功");
                    if(response.data!=null){
                        this.orderInfo=response.data;
                        this.payableAmt=response.data.payableAmt;
                    }
                } else {
                    console.log("订单详情获取失败");
                }
                }).catch(err => {
                    console.log("订单详情接口异常", err);
            });
            

            // 支付方式接口
            let paramsPay={
                'orgId':this.orgId,
            }
            getBankAccount(paramsPay).then(response => {
                console.log(response);
                if (response.meta.success == true) {
                    console.log("支付方式获取成功");
                    this.finBankAccounts=response.data.finBankAccounts;
                    this.finReceivingSets=response.data.finReceivingSets;
                    if(this.finReceivingSets.length!=0){
                        if(this.finReceivingSets[0].wechatpay!=null){
                            this.payNo=this.finReceivingSets[0].wechatpay;
                            this.payWay='微信';
                        }
                        else{
                            this.payNo=this.finReceivingSets[0].alipay;
                            this.payWay='支付宝';
                        }
                    }
                    else{
                        this.payNo=this.finBankAccounts[0].bankaccount;
                        this.payWay='银行卡';
                    }
                } else {
                    console.log("支付方式获取失败");
                }
                }).catch(err => {
                    console.log("支付方式接口异常", err);
            });
        },
        //上传凭证    
        onFileChange(){ 
            let form = new FormData(); 
            for(let i=0;i<event.target.files.length;i++){
                form.append('file',event.target.files[i],event.target.files[i].name); 
            }
            uploadPayImg(form).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('图片上传成功');
                    this.uploadImgList.push(response.data[0]);
                }
                else{
                    console.log('图片上传失败');
                }
            })
        },
        // 选择银行卡
        selectBank(obj){
          this.payWay="银行卡";
          this.payNo=obj.bankaccount;
          this.bank=obj.depositbank;
          this.bankId=obj.id;
        },
        // 选择微信
        selectWx(obj){
            console.log(obj);
            this.payWay="微信";
            this.payNo=obj.wechatpay;
            this.bank='';
            this.bankId='';
        },
        // 选择支付宝
        selectAli(obj){
            this.payWay="支付宝";
            this.payNo=obj.alipay;
            this.bank='';
            this.bankId='';
        },
         // 支付申请
        paySubmit(){
            if(this.uploadImgList.length==0){
                this.showTip=true;
                this.tipText="请先上传付款凭证！";
                return;
            }
            if(this.payState==1){
                this.payState=0;
                let params={
                    'orgId':this.orgId,
                    'orderId':this.orderId,
                    'payWay':this.payWay,
                    'payNo':this.payNo,
                    'paymentAmt':this.payableAmt,
                    'fileArray':this.uploadImgList,
                    'srcBank':this.bank,
                    'comment':this.comment,
                    'srcBankId':this.bankId,
                }
                postPayment(params).then(response => {
                    console.log(response);
                    if (response.meta.success == true) {
                        console.log("支付申请提交成功");
                        this.showTip=true;
                        this.tipText="支付申请提交成功!";
                        setTimeout(()=>{
                             this.$router.push('/order');
                        },1500);
                    } else {
                        console.log("支付申请提交失败");
                        this.showTip=true;
                        this.tipText=response.meta.message;
                        this.payState=1;
                    }
                    }).catch(err => {
                        console.log("支付申请提交异常", err);
                });
            }
        }
    },
    mounted(){
        this.paymentInit();
    },
    components: {
      BigImg,
      Toast,
      service
    },
}
</script>

<style lang="scss">
.payment{
    background: url('../assets/images/payment-bg.png') no-repeat;
    background-size:100% toRem(400px);
    padding-top: toRem(74px);
    padding-bottom: toRem(98px);
    .payment-top{
        @include wh(toRem(625px),toRem(366px));
        box-shadow: 0px toRem(6px) toRem(20px) toRem(3px) rgba(4, 0, 0, 0.1);
	    border-radius: toRem(10px);
        background: #fff;
        margin: auto;
        padding: toRem(38px) toRem(37px) toRem(40px) toRem(30px);
        box-sizing: border-box;
        >h2{
            @include sc(toRem(48px),#333);
            line-height: toRem(48px);
        }
        >h3{
            @include sc(toRem(48px),#333);
            line-height: toRem(48px);
            text-align: center;
            margin: toRem(70px) 0 toRem(60px) 0;
        }
        >div{
            >div{
                display: inline-block;
                >p{
                  @include sc(toRem(18px),#666);
                  margin-bottom: toRem(5px);  
                }
                &:last-child{
                    float: right;
                }
            }
        }
    }
    .order-info{
        width:toRem(623px);
        // @include wh(toRem(623px),toRem(240px));
        background: #fff;
        box-shadow: 0px toRem(6px) toRem(20px) toRem(3px) rgba(4, 0, 0, 0.1);
	    border-radius: toRem(6px);
        margin:toRem(40px) auto toRem(30px);
        padding: toRem(18px) toRem(40px);
        box-sizing: border-box;
        >h3{
            @include sc(toRem(20px),#666);
            margin-bottom: toRem(10px);
        }
        >p{
            @include sc(toRem(18px),#999);
            line-height: toRem(30px);
            padding-bottom: toRem(15px);
            border-bottom:1px solid #e1e1e1;
            margin-bottom: toRem(15px);
        }
        >div{
            >div{
                display: inline-block;
                width:48%;
                >h2{
                   @include sc(toRem(20px),#666); 
                }
                >p{
                  @include sc(toRem(18px),#999); 
                 
                  >span{
                      margin-right:toRem(28px);
                  } 
                  i{
                     @include sc(toRem(16px),#4f91f7); 
                  }
                }
                &:last-child{
                    border-left:toRem(1px) solid #e1e1e1;
                    padding-left: toRem(40px);
                    box-sizing: border-box;
                }
            }
        }
    }
    .paymethod{
        padding: 0 toRem(20px);
        margin-bottom: toRem(30px);
        >h2{
            @include sc(toRem(24px),#7d7d7d);
            margin-bottom: toRem(20px);
        }
        .card-wx,.card-alipay{
            display: inline-block;
            @include wh(toRem(347px),toRem(115px));
            box-shadow: 0px toRem(6px) toRem(20px) toRem(3px) rgba(4, 0, 0, 0.1);
	        border-radius: toRem(6px);
            position: relative;
            padding: toRem(20px);
            box-sizing: border-box;
            >p{
                @include sc(toRem(18px),#999);
            }
            >h2{
                @include sc(toRem(21px),#333);
                line-height: toRem(24px);
                margin-bottom: toRem(5px);
                >img{
                    @include wh(toRem(24px),toRem(24px));
                    display: inline-block;
                    vertical-align: top;
                    margin-right: toRem(10px);
                }
            }
            >i{
                position: absolute;
                @include wh(toRem(40px),toRem(40px));
                background: url('../assets/images/choose-none.png') no-repeat center center;
                background-size:toRem(28px) toRem(28px);
                right:toRem(12px);
                top:toRem(12px);
                &.active{
                    background: url('../assets/images/choose.png') no-repeat center center;
                    background-size:toRem(28px) toRem(28px);
                }
            }
        }
    }
    .off-pay{
        padding: 0 toRem(20px);
        >h2{
            @include sc(toRem(24px),#7d7d7d);
            margin-bottom: toRem(20px);
        }
        >div{
            width:auto;
            overflow-x: scroll !important;
            white-space: nowrap;
            &::-webkit-scrollbar {display:none}
            // padding-top: toRem(20px);
            // padding-left: toRem(10px);
            >div{
                display: inline-block;
                width:toRem(420px);
                overflow: hidden;
                // box-shadow: 0px toRem(6px) toRem(20px) toRem(3px) rgba(4, 0, 0, 0.1);
	            border-radius:toRem(6px);
                padding: toRem(23px) toRem(20px) toRem(14px) toRem(77px);
                background: url('../assets/images/card.png') no-repeat toRem(24px) toRem(20px);
                background-size:toRem(40px) toRem(23px);
                border:1px solid #e1e1e1;
                position: relative;
                margin-right: toRem(20px);
                >h2{
                   @include sc(toRem(21px),#333); 
                   margin-bottom: toRem(5px);
                }
                >p{
                    @include sc(toRem(18px),#999);
                    line-height: toRem(28px);
                }
                >i{
                    position: absolute;
                    @include wh(toRem(40px),toRem(40px));
                    background: url('../assets/images/choose-none.png') no-repeat center center;
                    background-size:toRem(28px) toRem(28px);
                    right:toRem(12px);
                    top:toRem(55px);
                    &.active{
                        background: url('../assets/images/choose.png') no-repeat center center;
                        background-size:toRem(28px) toRem(28px);
                    }
                }
            }
        }
    }
    .pay-way{
        margin:toRem(30px) toRem(30px) toRem(35px) toRem(25px);
        border-bottom:1px solid #e1e1e1;
        >p{
          @include sc(toRem(24px),#999);  
          margin-bottom: toRem(20px);
          >span{
              float: right;
          }
        }
    }
    .pay-credentials{
        padding:0 toRem(25px);
        >h2{
            @include sc(toRem(24px),#999);
            margin-bottom: toRem(20px);
        }
        >div{
            font-size: 0;
            >ul{
                display: inline-block;
                >li{
                    float: left;
                    margin-right: toRem(20px);
                    margin-bottom: toRem(20px);
                    @include wh(toRem(140px),toRem(140px));
                    position: relative;
                    >img{
                        @include wh(toRem(140px),toRem(140px));
                    }
                    i{
                        position: absolute;
                        @include wh(toRem(40px),toRem(40px));
                        background:transparent url('../assets/images/cancel.png') no-repeat center;
                        background-size: toRem(30px) toRem(30px);
                        display: inline-block;
                        top:toRem(-18px);
                        right:toRem(-15px);
                    }
                }
            }
            >div{
                display: inline-block;
                @include wh(toRem(140px),toRem(140px));
                vertical-align: top;
                position: relative;
                >img{
                    @include wh(toRem(140px),toRem(140px));
                    display: inline-block;
                }
                >input{
                    -webkit-tap-highlight-color:rgba(255,0,0,0);
                    position: absolute;
                    left:0;
                    bottom:0;
                    @include wh(toRem(140px),toRem(140px));
                    opacity: 0;
                }
            }
        }
    }
    .pay-comment{
        padding: 0 toRem(25px);
        margin-bottom: toRem(50px);
        margin-top: toRem(37px);
        >label{
            @include sc(toRem(24px),#999);
            display: inline-block;
            vertical-align: top;
        }
        // >div{

        // }
        >textarea{
            display: inline-block;
            vertical-align: top;
            @include wh(toRem(600px),toRem(184px));
            padding:toRem(20px);
            border:1px solid #e1e1e1;
            border-radius: toRem(6px);
            resize: none;
            outline: none;
            box-sizing: border-box;
             -webkit-appearance: none;
            &::placeholder{
                @include sc(toRem(24px),#ccc);
            }
        }
    }
    .pay-btn{
        position: fixed;
        bottom: 0;
        width:100%;
        height: toRem(98px);
        background-image:$main-bg;
        @include sc(toRem(40px),#fffefe);
        line-height: toRem(98px);
        text-align: center;
    }
}
</style>

