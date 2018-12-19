<!--这是订单页面-->
<template>
    <div class="order">
        <form class="search-input" action="" v-if="userType==2">
            <input type="search" v-model="condition" placeholder="商品名称/商品编号/订单号" @search="queryOrder(0)">
            <i></i>
        </form>
        <div class="order-content" v-if="userType==2">
            <ul class="order-nav">
                <li v-for="(state,index) in orderStateList" :class="orderIndex==index?'active':''" @click="getOrder(index)">{{state.name}}</li>
            </ul>
            <scroller :on-refresh="refresh" :on-infinite="infinite" ref="myscroller"  v-if="orderList.length!=0">
                <div style="height: 1px;">
                </div>
                <div class="order-list">
                    <div v-for="(order,index) in orderList">
                        <a :href="'#/order-details/'+order.ordId">
                            <div class="order-details">
                                <div>
                                    <!-- <img :src="order.coverImg" alt=""> -->
                                    <img v-if="order.coverImg!=''&&order.coverImg!=null" :src="order.coverImg" alt="">
                                    <img v-else="order.coverImg==''||order.coverImg==null" src="../assets/images/de-url.png" alt="">
                                </div>
                                <div>
                                    <h2 style="width: 100%; -webkit-box-orient: vertical;">{{order.aliaseName}}</h2>
                                    <h3>订单号：{{order.orderNo}}</h3>
                                    <p>出行日期：{{order.tourDate}}--{{order.endDay}}</p>
                                    <p>出行人数：<span v-if="order.adultNum!=0">{{order.adultNum}}成人</span> <span v-if="order.childNum!=0">{{order.childNum}}儿童</span></p>
                                    <p>出行日期：{{order.tourDays}}天</p>
                                    <span v-if="order.dataStatus==0 || order.dataStatus==2">待确认</span>
                                    <span v-if="order.dataStatus==1">待付款</span>
                                    <span v-if="order.dataStatus==4">已支付</span>
                                    <span v-if="order.dataStatus==-1">已取消</span>
                                    <span v-if="order.dataStatus==3">支付待确认</span>
                                    <!-- <span v-if="order.dataStatus!=0 && order.dataStatus!=1 && order.dataStatus!=4 && order.dataStatus!=-1">已点评</span> -->
                                </div>
                            </div>
                            <div class="order-sum">
                                <h2>合计：￥<span>{{order.payableAmt}}</span ><span v-if="false">（含机票费￥{{order.airfare}}）</span></h2>
                                <p>
                                    <a href="javascript:;" v-if="order.dataStatus!=4&&order.dataStatus!=-1" @click="cancelOrderFun(order)">取消订单</a>
                                    <!-- <a href="javascript:;">联系客服</a> -->
                                    <a :href="'#/payment/'+order.ordId+'/'+order.supplierID" v-if="order.dataStatus==1" class="active">付款</a>
                                    <!-- <a :href="'http://h5.aipinzan.cn/pay/api.aspx?id='+order.ordId+'&redirect_url=http://h5.aipinzan.net:9091/payApi/payCallback'" v-if="order.dataStatus==1" class="active">付款</a> -->


                                    <!-- 以后会用到，不能删掉 -->
                                    <!-- <a :href="'#/evaluation/'+order.ordId+'/'+order.proId" v-if="order.dataStatus==4" class="active">评价</a> -->
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
             </scroller>
            <p class="without-tip" v-if="orderList.length==0">暂无符合条件的数据</p>
        </div>
        <div class="order-ERP" v-if="userType==1">
            <img src="../assets/images/ERP-order.png" alt="">
            <p>请前往ERP订单中心查看</p>
        </div>
        <toast v-model="showTip" type="text">{{tipText}}</toast>
        <footerView :footerObject="footerObject"></footerView>
        <service></service>
    </div>
</template>
<script>
import { getOrderInfo,getOrderInfoByName,cancelOrder } from '../services/index'
import footerView from '../components/footer'
import tools from '../common/tools'
import service from '../components/service'
import { Toast } from 'vux'
import Vue from 'vue'
import VueScroller from 'vue-scroller'
Vue.use(VueScroller);
export default {
    data(){
        return{
            footerObject:'order',
            condition:'',//搜索条件
            orderStateList:[
                {name:'全部'},
                {name:'待确认'},
                {name:'待付款'},
                {name:'已支付'},
                // {name:'已点评'},
            ],//订单状态列表
            orderIndex:0,//订单默认状态
            dataStatus:-7,
            orderList:[],//订单列表
            page:0,//初始页码
            orderAll:false,//订单是否加载完
             // 下拉刷新上拉加载相关
            // upobj: {
            //     content: '请上拉刷新数据',
            //     pullUpHeight: 60,
            //     height: 40,
            //     autoRefresh: false,
            //     downContent: '请上拉刷新数据',
            //     upContent: '请上拉刷新数据',
            //     loadingContent: '加载中...',
            //     // clsPrefix: 'xs-plugin-pullup-'
            // },
            // downobj:{
            //     content: '请下拉刷新数据',
            //     downContent: '请下拉刷新数据',
            //     upContent: '请下拉刷新数据',
            //     loadingContent: '加载中...',
            // },
            // showDown:true,//使用下拉组件
            // showUp: true, //使用上拉组件
            total:'',//总订单
            height:'',
            showTip:false,//提示框显隐
            tipText:'',//提示框内容
            userType:'',//用户类型
        }
    },
    methods: {
         // 返回一个月的第一天是星期几和这个月有多少天
        getWeekDay(year,month){
            let firstWeek =new Date(year, month,1).getDay();//拿到这个月1号是星期几  
            let lastDay = 32 - new Date(year, month, 32).getDate();//拿到这个月有多少天 
            let a;  
                if(firstWeek ==0){  
                    a =7;  
                }else{  
                    a=firstWeek;  
                }  
            //    console.log(a);
            //    console.log(lastDay);
            return {
                week:a,//这个月是星期几
                sumday:lastDay//这个月有多少天
            };
        },
        // 订单页面初始化
        orderInit(){
            this.userType=tools.getLocalStorage('userType');
            // let font=(document.documentElement.clientWidth/320)*20;
            // this.height=document.documentElement.clientHeight-(font*5.7)+'px';
            console.log(this.height);
            this.searchOrder(0);
        },
        // 手动搜索订单
        queryOrder(page){
            this.orderList=[];
            this.searchOrder(0);
        },
        // 自动搜索订单
        searchOrder(page){
            let params={
                'startPage':page,
                'size':10,
                'condition':this.condition,
                'dataStatus':this.dataStatus,
                'siteid':tools.getSessionStorage('siteId'),
            };
            // 获取订单接口绑定
            getOrderInfo(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('订单数据获取成功');
                    this.total=response.data.totalNum;
                    for(let i=0;i<response.data.orderList.length;i++){
                        this.orderList.push(response.data.orderList[i]);
                    }
                    for(let i=0;i<this.orderList.length;i++){
                        let monthTotal=this.getWeekDay(parseInt(this.orderList[i].tourDate.split('-')[0]),parseInt(this.orderList[i].tourDate.split('-')[1])-1).sumday;

                        let total=parseInt(this.orderList[i].tourDate.split('-')[2])+parseInt(this.orderList[i].tourDays)-1;
                        if(total>monthTotal){
                             this.$set(this.orderList[i], 'endDay', this.orderList[i].tourDate.split('-')[0]+'-'+(parseInt(this.orderList[i].tourDate.split('-')[1])+1)+'-'+(total-monthTotal));
                        }
                        else{
                             this.$set(this.orderList[i], 'endDay', this.orderList[i].tourDate.split('-')[0]+'-'+parseInt(this.orderList[i].tourDate.split('-')[1])+'-'+total);
                        }
                    }
                }
                else{
                    this.showTip=true;
                    this.tipText=response.meta.message;
                    console.log('订单数据获取失败');
                }
            }).catch((err)=>{
                console.log('订单接口获取异常',err);
            });
        },
        // 下拉和上拉
        // onPullDown(){
        //     this.page=0;
        //     setTimeout(()=> {
        //         this.orderAll=false;
        //         this.orderList = [];
        //         this.searchOrder(0);
        //         this.$refs.myScroller.donePulldown();
        //         this.$refs.myScroller.reset({top: 0})
        //         this.$refs.myScroller.enablePullup();
        //     }, 1500)
        // },
        // onPullUp(){
        //     this.page++;
        //     // alert(this.page);
        //     if(this.page>=this.totalNum/10){
        //         this.$refs.myScroller.disablePullup();
        //         this.orderAll=true;            
        //     }
        //     else{
        //         this.orderAll=false;
        //         this.searchOrder(this.page);
        //         this.$refs.myScroller.donePullup();
        //         this.$refs.myScroller.reset();
        //     }
        // },
         infinite(done) {
            console.log('上拉');
            if(this.noData) {
                setTimeout(()=>{
                    this.$refs.myscroller.finishInfinite(2);
                })
             return;
            }
            setTimeout(() => {
                this.page++;
                if(this.page>=this.total/10){
                    this.noData = "没有更多数据啦";
                }
                else{
                    this.searchOrder(this.page);
                }
                this.$refs.myscroller.resize();
                done()
            }, 1500)
        },
        refresh() {
            console.log('下拉');
            this.noData='';
            this.page=0;
            setTimeout(()=> {
                this.$nextTick(()=>{
                    this.orderList = [];
                    this.searchOrder(0);
                })
            }, 1500)
        },
        // 获取不同的订单信息
        getOrder(index){
            this.orderIndex=index;
            this.orderList=[];
            // this.orderAll=false;
            if(index==0){
                this.dataStatus=-7;
                this.searchOrder(0);
            }
            else if(index==1){
                this.dataStatus=0;
                this.searchOrder(0);
            }
            // else if(index==2){
            //     this.dataStatus=0;
            // }
            else if(index==2){
                this.dataStatus=1;
                this.searchOrder(0);
            }
             else if(index==3){
                this.dataStatus=4;
                this.searchOrder(0);
            }
             else if(index==4){
                this.dataStatus=-2;
                this.searchOrder(0);
            }
            // this.orderInit();
        },
        // 取消订单
        cancelOrderFun(obj){
            let params=obj.ordId;
             cancelOrder(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('取消订单成功');
                    this.showTip=true;
                    this.tipText=response.meta.message;
                    this.orderList=[];
                    this.searchOrder(0);
                }
                else{
                    console.log('取消订单失败');
                    this.showTip=true;
                    this.tipText=response.meta.message;
                }
            }).catch((err)=>{
                console.log('取消订单异常',err);
            });
        }        
    },
    mounted(){
        this.orderInit();
    },
    components: {
      footerView,
      Toast,
      VueScroller,
      service
    },
}
</script>

<style lang="scss">
.order-ERP{
    text-align: center;
    padding-top: toRem(146px);
    font-size: 0;
    >img{
       @include wh(toRem(453px),toRem(252px));  
       margin-bottom: toRem(60px);
    }
    >p{
        @include sc(toRem(30px),#333);
    }
}
.order{
    padding-bottom: toRem(98px);
    ._v-container{
        top:toRem(253px) !important;
    }
    .search-input{
        height: toRem(60px);
        margin:toRem(20px) toRem(30px) toRem(40px);
        width:calc(100% - #{toRem(60px)});
        position: relative;
        font-size: 0;
        >input{
            -webkit-tap-highlight-color:rgba(255,0,0,0);
            border-radius: toRem(30px);
            height: toRem(60px);
            width:100%;
            padding-left: toRem(80px);
            padding-right: toRem(20px);
            border:1px solid #ddd;
            outline: none;
            @include sc(toRem(18px),#333);
            box-shadow: none;
             -webkit-appearance: none;
            &::placeholder{
                @include sc(toRem(18px),#999);
            }
            &::-webkit-search-cancel-button {display: none;}
        }
        
        >i{
            display: inline-block;
            @include wh(toRem(30px),toRem(30px));
            position: absolute;
            background: url('../assets/images/home-search.png') no-repeat;
            background-size: 100%;
            left:toRem(30px);
            top:toRem(15px);
        }
    }
   .xs-plugin-pulldown-container{
       @include sc(toRem(26px),#333);
   }
   .xs-plugin-pullup-container{
       @include sc(toRem(26px),#333);
   }
    .order-nav{
        margin-right: toRem(37px);
        padding-left: toRem(38px);
        border-bottom:1px solid #ddd; 
        height: toRem(54px);
        font-size:0;
        box-sizing: border-box;
        margin-bottom: toRem(10px);
        >li{
            float: left;
            margin-right: toRem(110px);
            @include sc(toRem(30px),#666); 
            padding-bottom: toRem(14px);
            &.active{
                @include sc(toRem(30px),$main-color);
                border-bottom:2px solid $main-color;
            }
            &:last-child{
                margin-right: 0;
            }
        }
    }
    // .xs-container{
    //     max-height: calc(100vh - #{toRem(250px)});
    // }
    .order-list{
        >div{
            padding: toRem(39px) 0 0 0;
            >a{
                display: inline-block;
                width:100%;
            }
            .order-details{
                font-size: 0;
                padding: toRem(10px) toRem(30px);
                box-sizing: border-box;
                background: #f8f8f8;
                width: 100%;
                >div{
                    display: inline-block;
                    vertical-align: top;
                    width:100%;
                    &:nth-child(1){
                        display: inline-block;
                        width:toRem(190px);
                        height: toRem(190px);
                        overflow: hidden;
                        text-align: center;
                        border-radius: toRem(8px);
                        margin-right: toRem(20px);
                        >img{
                            height: toRem(190px);
                            // transform: translateX(-25%);
                        }
                    }
                    &:nth-child(2){
                        width:calc(100% - #{toRem(220px)});
                        position: relative;
                        >h2{
                            @include sc(toRem(26px),#18191a);
                            // overflow: hidden;
                            // text-overflow:ellipsis;//文本溢出显示省略号
                            // white-space:nowrap;//文本不会换行（单行文本溢出）
                            width:100% !important;
                            overflow: hidden !important;
                            -webkit-box-orient: vertical !important;
                            text-overflow: ellipsis !important;
                            display: -webkit-box !important;
                            -webkit-line-clamp: 2 !important;
                            line-height: toRem(28px);
                        }
                        >h3{
                            @include sc(toRem(24px),$main-color);
                            line-height: toRem(24px);
                            margin: toRem(13px) 0 toRem(9px) 0;
                        }
                        >p{
                            @include sc(toRem(24px),#666);
                        }
                        >span{
                            display: inline-block;
                            position: absolute;
                            right:toRem(10px);
                            bottom:0;
                            @include sc(toRem(30px),#ff6326);
                        }
                    }
                }
            }
            .order-sum{
                margin-right: toRem(30px);
                padding: toRem(40px) 0 toRem(20px) 0;
                border-bottom: 1px solid #ddd;
                >h2{
                    text-align: right;
                    @include sc(toRem(20px),#18191a);
                    line-height: toRem(30px);
                    margin-bottom: toRem(38px);
                    >span{
                        @include sc(toRem(30px),#18191a);
                    }
                }
                >p{
                    text-align: right;
                    font-size: 0;
                    >a{
                        display: inline-block;
                        @include wh(toRem(148px),toRem(62px));
                        @include sc(toRem(26px),#fff);
                        text-align: center;
                        // border:1px solid #ddd;
                        background-image:$main-bg;
                        line-height: toRem(62px);
                        border-radius: toRem(6px);
                        margin-left: toRem(38px);
                        &.active{
                            border:1px solid #777;
                            background: #fff;
                            box-sizing: border-box;
                            @include sc(toRem(26px),#7d7d7d);
                            line-height: toRem(60px);
                        }
                    }
                }
            }
        }
    }
    .without-tip{
        @include sc(toRem(30px),#999);
        padding-left: toRem(30px);
        padding-top: toRem(30px);
        position: relative;
        text-align: center;
    }
}
</style>

