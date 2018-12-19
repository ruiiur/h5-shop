<!--这是支付页面-->
<template>
    <div class="pay">
       <div class="pay-content">
           <img src="../assets/images/pay-success.png" alt="">
           <h2>支付成功</h2>
           <ul>
               <li>支付时间：<span>{{payDate}}</span></li>
               <li>订单号：<span>{{payNo}}</span></li>
               <li>支付账号：<span>{{payUser}}</span></li>
               <li>支付金额：<span>￥{{payAmt}}</span></li>
           </ul>
           <p><a :href="'#/home?orgId='+orgId">返回首页</a><a href="#/order">查看订单</a></p>
       </div>
       <service></service>
    </div>
</template>
<script>
import service from '../components/service'
import tools from '../common/tools'
export default {
    data(){
        return{
           orgId:'',
           payDate:'',//支付时间
           payNo:'',//订单号
           payUser:'',//支付账户
           payAmt:'',//支付金额
        }
    },
    methods: {
        payInit(){
            this.orgId= tools.getLocalStorage('orgId');
            console.log(window.location.href);
            let url=decodeURIComponent(window.location.href);
            this.payDate=url.split('&')[0].split('=')[1];
            this.payNo=url.split('&')[1].split('=')[1];
            this.payUser=url.split('&')[2].split('=')[1];
            this.payAmt=url.split('&')[3].split('=')[1];
        }
    },
    mounted(){
        this.payInit();
    },
    components: {
      service
    },
}
</script>

<style lang="scss">
.pay{
    background: #f1f1f1;
    min-height: calc(100vh - #{toRem(80px)});
    padding:toRem(100px) toRem(30px) 0 toRem(30px);
    box-sizing: border-box;
    .pay-content{
        background: #fff;
        border-radius: toRem(20px);
        padding: toRem(70px) 0 toRem(90px) 0;
        >img{
            display: block;
            @include wh(toRem(180px),toRem(180px));
            margin: auto;
        }
        >h2{
            @include sc(toRem(30px),#000);
            text-align: center;
            margin:toRem(40px) 0 toRem(80px) 0;
        }
        >ul{
            padding: 0 toRem(80px);
            >li{
                @include sc(toRem(28px),#999);
                margin-bottom: toRem(30px);
                >span{
                    float: right;
                }
            }
        }
        >p{
            padding:0 toRem(105px);
            font-size: 0;
            margin-top: toRem(120px);
            >a{
                display: inline-block;
                @include wh(toRem(220px),toRem(60px));
                line-height: toRem(60px);
                background-image: $main-bg;
	            border-radius: toRem(10px);
                @include sc(toRem(24px),#fff);
                text-align: center;
                &:last-child{
                    float: right;
                }
            }
        }
    }
}
</style>

