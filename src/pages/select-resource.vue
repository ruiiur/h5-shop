<!--这是选择资源页面-->
<template>
    <div class="select-resource">
        <div class="product-details">
            <h2>{{productDetails.aliasename}}</h2>
            <h3>编号：{{productDetails.prono}} <span v-for="(policy,index) in pricePolicyList" v-if="policy.count>0">{{policy.count}}{{policy.policyName}}</span></h3>
            <p>目的地：<span class="city">{{productDetails.destination}}</span></p>
            <div class="change-city" @click="toDepartureCity">
                出发地：
                <span>{{departureCity}}</span>
                <!-- <popup-picker :data="departuresNameList" v-model="departureCity" @on-show="onShow" @on-hide="onHide" @on-change="onChange" ></popup-picker> -->
                <i :class="openCity==true?'active':''"></i>
            </div>
            <p>产品分类：{{productDetails.procategory}} <span class="product-supplier">本线产品由{{travelAgencyName}}提供</span></p>
        </div>
        <div class="policy-con" v-if="pricePolicyList.length!=0">
            <h2 class="select-line">价格信息</h2>
            <div>
                <table>
                    <tr v-for="(policy,index) in pricePolicyList" v-if="index==0">
                        <th>票种</th>
                        <th>直客价</th>
                        <th v-if="userType==1">返佣</th>
                        <th v-if="userType==1">同行结算</th>
                        <th>单房差</th>
                        <th v-if="policy.useDiscount==true">优惠金额</th>
                        <th>购买人数</th>
                    </tr>
                    <tr v-for="policy in pricePolicyList">
                        <td>{{policy.policyName}}</td>
                        <!-- 直客价 -->
                        <td v-if="policy.beforeDiscountDirectPrice!=null">￥{{policy.beforeDiscountDirectPrice}}</td>
                        <td v-if="policy.beforeDiscountDirectPrice==null">￥{{policy.directPrice}}</td>
                        <!-- 返佣 -->
                        <td v-if="userType==1">￥{{policy.rebatePrice}}</td>
                        <!-- 同行 -->
                        <td v-if="userType==1&&policy.beforeDiscountSalesPrice!=null">￥{{policy.beforeDiscountSalesPrice}}</td>
                        <td v-if="userType==1&&policy.beforeDiscountSalesPrice==null">￥{{policy.salesPrice}}</td>
                        <!-- 单房差 -->
                        <td>￥{{policy.singleRoomPrice}}</td>
                        <td v-if="userType==2&&policy.beforeDiscountDirectPrice!=null">￥{{policy.discountDirectPrice}}</td>
                        <td v-if="userType==1&&policy.beforeDiscountSalesPrice!=null">￥{{policy.discountSalesPrice}}</td>
                        <td>
                            <div>
                                <i class="order-reduce" @click.stop.prevent="reduceCount(pricePolicyList,policy)"></i>
                                <em>{{policy.count}}</em>
                                <i class="order-add" @click.stop.prevent="addCount(pricePolicyList,policy)"></i>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <!-- <p class="single-room">单房差<span>{{singleRoomPrice}}元</span></p> -->
            <h3></h3>
        </div>
        <div class="traffic-information" v-if="trafficList!=''">
            <h2 class="select-line" v-if="trafficList.departureStatus==9">机票</h2>
            <h2 class="select-line" v-if="trafficList.departureStatus==10">火车票</h2>
            <h2 class="select-line" v-if="trafficList.departureStatus==11">汽车票</h2>
            <h2 class="select-line" v-if="trafficList.departureStatus==12">船票</h2>
            <div>
                <div class="trip-line">
                    <p>出发<span>{{trafficList.departureDate}}</span></p>
                    <div class="flight-path">
                        <h1>{{trafficList.depBeginTime}}</h1>
                        <!-- <h2 v-if="trafficList.departureStatus==9">{{trafficList.departurePoint}}</h2>           -->
                        <h2 >{{trafficList.departurePoint}}</h2>  
                        <p v-if="trafficList.departureStatus==9">{{trafficList.departureCity}}</p>        
                    </div>
                    <div class="flight-line">
                        <p v-if="trafficList.departureStatus==9">{{trafficList.departureNo}}</p>
                        <i></i>
                    </div>
                    <div class="flight-path esp">
                        <h1>{{trafficList.depEndTime}}</h1>
                        <h2>{{trafficList.depEndPoint}}</h2>
                        <p v-if="trafficList.departureStatus==9">{{trafficList.depEndCity}}</p>
                    </div>
                </div>
                <div class="trip-line">
                    <p>回程<span>{{trafficList.backDate}}</span></p>
                    <div class="flight-path">
                        <h1>{{trafficList.backBeginTime}}</h1>
                        <h2 >{{trafficList.backPoint}}</h2>   
                        <p v-if="trafficList.departureStatus==9">{{trafficList.backCity}}</p>                 
                    </div>
                    <div class="flight-line">
                        <p v-if="trafficList.departureStatus==9">{{trafficList.backNo}}</p>
                        <i></i>
                    </div>
                    <div class="flight-path esp">
                        <h1>{{trafficList.backEndTime}}</h1>
                        <h2>{{trafficList.backEndPoint}}</h2>
                        <p v-if="trafficList.departureStatus==9">{{trafficList.backEndCity}}</p>
                    </div>
                </div>
                <p v-if="trafficList==''">暂无航班信息</p>
            </div>
        </div>
        <div class="booker" v-if="userType==1">
            <h2 class="select-line">预订者</h2>
            <div>
                <div>
                    <label for="">公司名称：</label>
                    <p>{{orgInfo.travelAgencyName}}</p>
                </div>
                <div>
                    <label for="">预定姓名：</label>
                    <p>{{erpUser.userName}}</p>
                </div>
                <div>
                    <label for="">所在部门：</label>
                    <p>{{erpUser.deptName}}</p>
                </div>
            </div>
        </div>
        <div class="sale-staff">
            <h2 class="select-line">销售人员</h2>
            <div>
                <label for="">销售人员名称:</label>
                <p @click="goSaleFun()"><i v-if="saleName==''">请输入销售员姓名</i><span>{{saleName}}</span></p>
            </div>
        </div>
        <div class="book-intro">
            <h2 class="select-line">预定说明<a href="javascript:;" v-if="productDetails.bactorule!=''" @click="backShow=true"> </a></h2>
            <div>
                <div>
                    <h4>自理费用</h4>
                    <p v-html="productDetails.feenonincludes">{{productDetails.feenonincludes}}</p>
                </div>
                <div>
                    <h4>费用包含</h4>
                    <p v-html="productDetails.feeincludes">{{productDetails.feeincludes}}</p>
                </div>
            </div>
        </div>
        <div class="bottom-info">
            <div>
                总价<span>￥{{sumPrice}}</span>
                <a href="javascript:;" @click="checkPrice()">费用明细</a>
            </div>
            <a @click="nextFun()">下一步</a>
        </div>
        <div class="bottom-alert" v-if="priceShow==true">
            <h2>费用明细</h2>
            <div>
                <p v-for="policy in pricePolicyList" v-if="policy.count>0">{{policy.policyName}}<span v-if="policy.beforeDiscountDirectPrice==null">{{policy.count}}*￥{{policy.directPrice}}=￥{{mul(policy.count,policy.directPrice)}}</span><span v-if="policy.beforeDiscountDirectPrice!=null">{{policy.count}}*￥{{policy.beforeDiscountDirectPrice}}=￥{{mul(policy.count,policy.beforeDiscountDirectPrice)}}</span></p>
                <!-- <p v-for="policy in pricePolicyList" v-if="policy.count>0&&userType==1">{{policy.policyName}}<span>{{policy.count}}*{{policy.salesPrice}}={{mul(policy.count,policy.salesPrice)}}</span></p>
                <p v-for="policy in pricePolicyList" v-if="policy.count>0&&userType==2">{{policy.policyName}}<span>{{policy.count}}*{{policy.directPrice}}={{mul(policy.count,policy.directPrice)}}</span></p> -->
                <!-- <p>单房差<span>{{singleRoomPrice}}</span></p> -->
                <p v-if="userType==1">分销返佣<span>￥{{rebateSum}}</span></p>
                <p v-if="discountPrice!=0">优惠<span>￥{{discountPrice}}</span></p>
            </div>
        </div>
        <div class="box" v-if="priceShow==true" @click="priceShow=false" @touchmove.prevent>
        </div>
        <div class="back-tip">
            <alert v-model="backShow"  hide-on-blur> 
               <p v-html="productDetails.bactorule">{{productDetails.bactorule}}</p>
            </alert>
        </div>
        <toast v-model="showTip" type="text">{{tipText}}</toast>
        <service></service>
    </div>
</template>
<script>
import tools from '../common/tools'
import service from '../components/service'
import { getPolicysList,getProductDepartures,getMessage,getErpUser,validateTotalPrice } from '../services/index'
import Vue from 'vue'
import { PopupPicker,Toast,Alert} from 'vux'
export default {
    data(){
        return{
            departuresList: [],//出发地列表
            departuresNameList: [],//出发地城市名称列表
            departureCity: '',//出发城市
            openCity:false,
            pricePolicyList:[],//价格策略列表
            trafficList:'',//航班信息
            productDetails:'',//产品详情
            priceShow:false,
            countArr:'',//人数列表
            tourid:'',//团期id
            userType:'',//用户类型
            proid:'',//产品id
            showTip:false,//提示框显隐
            tipText:'',//提示框内容
            erpUser:'',//erp用户信息
            orgInfo:'',//供应商信息
            singlePrice:'',//erp单房差价格
            singleRoomPrice:'',//c端单房差价格
            singleInit:'',//c端单房差初始价格
            sumPrice:'',//总价
            rebateSum:0,//返佣总价
            // isAck:'',
            backShow:false,//退改签说明显隐
            stock:'',//库存
            saleName:'',
            travelAgencyName:'',
            isOutgoing:'',//普通产品还是外发产品
            discountPrice:'',//总优惠金额
            useDiscount:false
        }
    },
    methods: {
        // 加
        add(a, b) {
            var c, d, e;
            try {
                c = a.toString().split(".")[1].length;
            } catch (f) {
                c = 0;
            }
            try {
                d = b.toString().split(".")[1].length;
            } catch (f) {
                d = 0;
            }
            return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
        },
        // 减
        sub(a, b) {
            var c, d, e;
            try {
                c = a.toString().split(".")[1].length;
            } catch (f) {
                c = 0;
            }
            try {
                d = b.toString().split(".")[1].length;
            } catch (f) {
                d = 0;
            }
            return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
        },
        //乘
        mul(a, b) {
            var c = 0,
                d = a.toString(),
                e = b.toString();
            try {
                c += d.split(".")[1].length;
            } catch (f) {}
            try {
                c += e.split(".")[1].length;
            } catch (f) {}
            return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
        },
        // 除
        div(a, b) {
            var c, d, e = 0,
                f = 0;
            try {
                e = a.toString().split(".")[1].length;
            } catch (g) {}
            try {
                f = b.toString().split(".")[1].length;
            } catch (g) {}
            return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
        },
        // 去选择出发地
        toDepartureCity(){
            this.$router.push('/departure-city');
        },
        // 搜索销售人员
        goSaleFun(){
            this.$router.push('/search-sale');
        },
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
            console.log('val change', val);
            console.log('departuresList',this.departuresList);
            for(let i=0;i<this.departuresList.length;i++){
                if(val==this.departuresList[i].departure){
                    // 把出发地id放入缓存
                    tools.setLocalStorage('departureId',this.departuresList[i].id);
                    // 把出发地放入缓存
                    tools.setLocalStorage('departure',this.departuresList[i].departure);
                }
            }
        },
        //选择资源初始化
        selectResourceInit(){
             // 获取用户类型
            this.userType=tools.getLocalStorage('userType');
            this.isOutgoing=tools.getLocalStorage('isOutgoing');
            this.saleName=tools.getSessionStorage('saleName')?tools.getSessionStorage('saleName'):'';
            this.travelAgencyName=tools.getSessionStorage('travelAgencyName');
            this.countArr=JSON.parse(tools.getLocalStorage('countArr'));
            // this.departureCity=[];
            this.departureCity=tools.getLocalStorage('departure');
            this.tourid=tools.getLocalStorage('tourid');
            this.stock=tools.getLocalStorage('stock');
            this.proid=this.$route.params.id;
            let params={
                'proid':this.proid,
                'siteid':tools.getSessionStorage('siteId'),
            };
            //价格策略接口请求参数
            let paramsPrice={
                'proid':this.proid,
                'tourDate':tools.getLocalStorage('selectedDay'),
                'siteid':tools.getSessionStorage('siteId'),
                'isOutgoing':tools.getLocalStorage('isOutgoing'),
                'orgId':tools.getLocalStorage('orgIdw'),
                'tourid':this.tourid
            }
            // 价格策略接口绑定
            this.sumPrice=0;
            getPolicysList(paramsPrice).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('价格策略数据获取成功');
                    this.pricePolicyList=response.data[0].pricePolicyList;
                    if(this.pricePolicyList.length!=0){
                        for(let i=0;i<this.pricePolicyList.length;i++){
                            // 根据上页人数赋值
                            this.$set(this.pricePolicyList[i], 'count', this.countArr[i]);
                            if(this.pricePolicyList[i].useDiscount==true){
                                this.useDiscount=true;
                            }
                        }
                    }

                    // 信息展示接口参数
                    let paramsMessage={
                        'proid':this.proid,
                        'tourid':this.tourid,
                        'depid':tools.getLocalStorage('departureId'),
                        'siteid':tools.getSessionStorage('siteId')
                    }
                    // 信息展示接口绑定
                    getMessage(paramsMessage).then((response)=>{
                        console.log(response);
                        if(response.meta.success==true){
                            console.log('信息展示数据获取成功');
                            this.productDetails=response.data.proProduct;
                            if(response.data.trafficDto.length!=0){
                                this.trafficList = response.data.trafficDto[0];
                                console.log(this.trafficList,'trafficList');
                                console.log(this.trafficList.departureStatus,'trafficList');
                            }

                            // 单房差相关逻辑----
                            // this.singleRoomPrice=response.data.singleRoomPrice;
                            // this.singleInit=response.data.singleRoomPrice;
                            // --------------------------------------

                            // this.isAck=response.data.proProduct.isack;
                            // console.log(this.isAck);

                            // 初始化单房差
                            // 单房差逻辑--------------------------------
                            // let sumInit=0;
                            // for(let i=0;i<this.pricePolicyList.length;i++){
                            // if(this.pricePolicyList[i].touristType==1){
                            //     sumInit+=this.pricePolicyList[i].count;
                            // }
                            // }
                            // console.log(sumInit);
                            // if(sumInit%2==0){
                            // this.singleRoomPrice=0;
                            // }
                            // else {
                            //     this.singleRoomPrice=this.singleInit;
                            // }
                            // ------------------------------------------------

                            this.priceInit();
                        
                            // this.proTourVenues=response.data.proTourVenues;
                        }
                        else{
                            console.log('信息展示数据获取失败');
                        }
                    }).catch((err)=>{
                        console.log('信息展示接口获取异常',err);
                        // this.$Message.info('信息展示接口获取异常');
                    });
                }
                else{
                    console.log('价格策略数据获取失败');
                }
            }).catch((err)=>{
                console.log('价格策略接口获取异常',err);
                // this.$Message.info('价格策略接口获取异常');
            });
            // 出发地接口绑定
            getProductDepartures(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('出发地数据获取成功');
                    this.departuresList=[];
                    this.departuresNameList=[];
                    this.departuresList=response.data.departures;
                    // 取出每个出发地的城市名称
                    let cityArr=[];
                    for(let i=0;i<response.data.departures.length;i++){
                        cityArr.push(response.data.departures[i].departure);
                    }
                    this.departuresNameList.push(cityArr);
                    // 把出发地id放入缓存
                    // tools.setLocalStorage('departureId',response.data.departure.id);
                    // 把出发地放入缓存
                    // tools.setLocalStorage('departure',response.data.departure.departure);
                }
                else{
                    console.log('出发地数据获取失败');
                }
            }).catch((err)=>{
                console.log('出发地异常报错',err);
                // this.$Message.info('出发地接口获取异常');
            });

            // ERP信息请求
            if(this.userType==1){
                getErpUser().then((response)=>{
                    console.log(response);
                    if(response.meta.success==true){
                        console.log('ERP用户数据获取成功');
                        this.erpUser=response.data.erpUserDto;
                        this.orgInfo=response.data.orgInfo;
                    }
                    else{
                        console.log('ERP用户数据获取失败');
                    }
                }).catch((err)=>{
                    console.log('ERP用户数据获取接口异常',err);
                    // this.$Message.info('ERP用户数据获取接口异常');
                });
            }
        },
        // 价格计算
        priceInit(){
            this.sumPrice=0;
            this.rebateSum=0;
            this.discountPrice=0;
            if(this.pricePolicyList.length!=0){
                for(let i=0;i<this.pricePolicyList.length;i++){
                    if(this.userType==1){
                        // this.sumPrice+=this.pricePolicyList[i].salesPrice*this.pricePolicyList[i].count - this.pricePolicyList[i].count*this.pricePolicyList[i].rebatePrice;
                        this.rebateSum= this.add(this.mul(this.pricePolicyList[i].count,this.pricePolicyList[i].rebatePrice),this.rebateSum);
                        this.sumPrice=this.add(this.mul(this.pricePolicyList[i].salesPrice,this.pricePolicyList[i].count),this.sumPrice);
                        if(this.pricePolicyList[i].discountSalesPrice!=null){
                            this.discountPrice=this.add(this.mul(this.pricePolicyList[i].discountSalesPrice,this.pricePolicyList[i].count),this.discountPrice);
                        }
                    }
                    if(this.userType==2){
                        // this.sumPrice+= parseInt(this.pricePolicyList[i].directPrice)* parseInt(this.pricePolicyList[i].count);
                        this.sumPrice= this.add(this.mul(this.pricePolicyList[i].directPrice, parseInt(this.pricePolicyList[i].count)),this.sumPrice);
                        if(this.pricePolicyList[i].discountDirectPrice!=null){
                            this.discountPrice= this.add(this.mul(this.pricePolicyList[i].discountDirectPrice , parseInt(this.pricePolicyList[i].count)),this.discountPrice);
                        }
                    }
                }
            }
        },
        // 改变单房差
        changeSinglePrice(){
            this.sumPrice=0;
            this.priceInit();
        },
        // 减少出游人数
        reduceCount(pricePolicyList,policy){
            let countSum=0;
            for(let i=0;i<this.pricePolicyList.length;i++){
                if(this.pricePolicyList[i].touristType==1){
                countSum+=this.pricePolicyList[i].count;
                }
            }
            if(policy.touristType==1&&policy.count==1&&countSum<2){
                policy.count=1;
                this.showTip=true;
                this.tipText="最少选择一个成人~"
            }
            else if(policy.count>0){
                policy.count--;
            }
            else{
                this.showTip=true;
                this.tipText="已经是最少人数了~"
            }
            //计算单房差
            // 单房差逻辑-----------------------------------
            // let sumPeople=0;
            // for(let i=0;i<this.pricePolicyList.length;i++){
            //     sumPeople+=this.pricePolicyList[i].count;
            // }
            // if(sumPeople%2==0){
            //     this.singleRoomPrice=0;
            // }
            // else {
            //     this.singleRoomPrice=this.singleInit;
            // }
            // --------------------------------------------

            // 计算总价
            this.sumPrice=0;
            this.priceInit();
        },
        // 增加出游人数
        addCount(pricePolicyList,policy){
            let countSum=0;
            for(let i=0;i<this.pricePolicyList.length;i++){
                countSum+=this.pricePolicyList[i].count;
            }
            // console.log(countSum);
            // console.log(this.stock);
            if(countSum>=this.stock){
                this.showTip=true;
                this.tipText="已达库存上线~"
                return;
            }
            policy.count++;
            //计算单房差
            // 单房差逻辑----------------------------------
            // let sumPeople=0;
            // for(let i=0;i<this.pricePolicyList.length;i++){
            //     if(this.pricePolicyList[i].touristType==1){
            //         sumPeople+=this.pricePolicyList[i].count;
            //     }
            // }
            // if(sumPeople%2==0){
            //     this.singleRoomPrice=0;
            // }
            // else {
            //     this.singleRoomPrice=this.singleInit;
            // }
            // ----------------------------------------
            // 计算总价
            this.sumPrice=0;
            this.priceInit();
        },
        // 费用明细
        checkPrice(){
            this.priceShow=!this.priceShow;
        },
        //下一步验证
        nextFun(){
            let policyIdArr=[];
            let policyPriceArr=[];
            this.countArr=[];
            // let single='';
            for(let i=0;i<this.pricePolicyList.length;i++){
                policyIdArr.push(this.pricePolicyList[i].id);
                this.countArr.push(this.pricePolicyList[i].count)
                if(this.userType==1){
                    policyPriceArr.push(this.pricePolicyList[i].salesPrice);
                }
                else if(this.userType==2){
                    policyPriceArr.push(this.pricePolicyList[i].directPrice);
                }
            }
            // if(this.userType==1){
            //     single=this.singlePrice;
            // }
            // if(this.userType==2){
                // 单房差逻辑--------------------------------
                // single=this.singleRoomPrice;
                // ----------------------------------------
            // }
            // 一会删掉
            // this.$router.push('/fill-information/'+this.proid);
             let params={
                'policyprice':policyPriceArr,
                'policyid':policyIdArr,
                'personnum':this.countArr,
                'tourid':tools.getLocalStorage('tourid'),
                'siteid':tools.getSessionStorage('siteId'),
                'totalprice':this.sumPrice,
                'discountPrice':this.discountPrice,
                'isOutgoing':tools.getLocalStorage('isOutgoing'),
                'orgId':tools.getLocalStorage('orgIdw'),
                // 'singleroomprice':single,
            }
            // 下一步验证接口绑定
            validateTotalPrice(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('验证成功');
                    // 把人数存来
                    tools.setLocalStorage('countArr',JSON.stringify(this.countArr));
                    tools.setLocalStorage('useDiscount',this.useDiscount);
                    // 存直售还是二次确认
                    // tools.setLocalStorage('isAck',this.isAck);
                    // 把验证值存起来
                    tools.setLocalStorage('key',response.data.key);
                    console.log(tools.getLocalStorage('key'));
                    // 一会放开
                    this.$router.push('/fill-information/'+this.proid);
                }
                else{
                    console.log('验证失败');
                    this.showTip=true;
                    this.tipText=response.meta.message;
                }
            }).catch((err)=>{
                console.log('验证接口获取异常',err);
                // this.$Message.info('验证接口获取异常');
            });
        }
    },
    mounted(){
        this.selectResourceInit();
    },
    components: {
      PopupPicker,
      Toast,
      Alert,
      service
    },
}
</script>

<style lang="scss">
.back-tip{
    .weui-dialog{
        border-radius: toRem(10px);
        max-width:toRem(690px);
        width:90%;
    }
    .weui-dialog__ft,.weui-dialog__hd{
        display: none;
    }
    .weui-dialog__bd{
        padding: toRem(20px) toRem(18px) toRem(40px) ;
        // max-height: 50vh;
        // overflow-y: auto;
        .num_list{
            text-align: left;
            >li{
                font-size:toRem(25px);
                line-height: 1.5;
            }
        }
        .weui-dialog{
            overflow: auto;
        }
    }
}
.select-resource{
    background: #f4f4f4;
    padding-bottom: toRem(98px);
    .num_list li{
        list-style:disc !important;
        display: block;
        margin-bottom: toRem(5px);
        &::before{
            content:'';
            display: inline-block;
            vertical-align: middle;
            @include wh(toRem(8px),toRem(8px));
            background: #333;
            border-radius: 50%;
        }
    }
    >div{
        margin-bottom: toRem(20px);
        background: #fff;
    }
    .select-line{
        @include  sc(toRem(32px),#333);
        line-height: toRem(40px);
        padding:toRem(40px) toRem(30px)  toRem(16px) toRem(30px);
        border-bottom: solid 1px #e1e1e1;
        &::before{
            content:'';
            display: inline-block;
            @include wh(toRem(8px),toRem(21px));
            background-image: $main-bg;
            margin-right: toRem(20px);
        }
        >span{
           @include  sc(toRem(18px),#666); 
           margin-left: toRem(19px);
        }
        >a{
            float: right;
            margin-top: toRem(8px);
            @include sc(toRem(18px),$main-color);
            -webkit-tap-highlight-color:rgba(255,0,0,0);
        }
    }
    .product-details{
        padding: toRem(30px);
        >h2{
            @include sc(toRem(28px),#333);
            // font-weight: bold;
        }
        >h3{
            @include sc(toRem(24px),$main-color);
            margin: toRem(8px) 0 toRem(15px) 0;
            >span{
                margin-left: toRem(10px);
            }
        }
        >p{
            @include sc(toRem(24px),#666);
            .city{
                @include sc(toRem(24px),#18191a);
            }
            // .product-supplier{
            //     >a{
            //         @include sc(toRem(24px),$main-color);
            //     }
            // }
        }
        .change-city{
            @include sc(toRem(24px),#666);
            margin: toRem(15px) 0;
            >.vux-cell-box{
                display: inline-block;
                vertical-align: top;
                -webkit-tap-highlight-color:rgba(255,0,0,0);
                // height: toRem(65px);
                // line-height:toRem(65px);
                .weui-cell{
                    padding: 0;
                }
                .vux-popup-picker-select,.vux-cell-primary{
                    display: inline;
                }
                .vux-popup-picker-value{
                    color: $main-color;
                    font-size: toRem(26px);
                }
                .weui-cell__ft{
                    display: none;
                }
            }
            >i{
                display: inline-block;
                vertical-align: middle;
                width:toRem(28px);
                height: toRem(28px);
                background: url('../assets/images/edit.png') no-repeat;
                background-size: 100%;
                
            }
        }
    }
    .policy-con{
        padding-bottom: toRem(30px);
        >div{
            // padding-right:toRem(40px);
            // padding-right:toRem(10px);
            >table{
                width:100%;
                padding-top: toRem(22px);
                >tr{
                    >th{
                       @include sc(toRem(24px),#18191a); 
                       line-height: toRem(34px);
                    }
                    >td{
                        @include sc(toRem(24px),#666); 
                        line-height: toRem(60px);
                        text-align: center;
                        // >div{
                        //     >i{
                        //         display: inline-block;
                        //         vertical-align: middle;
                        //         @include wh(toRem(36px),toRem(36px));
                        //     }
                        //     .order-reduce{
                        //         background: url('../assets/images/reduce.png') no-repeat;
                        //         background-size: 100%;
                        //         -webkit-tap-highlight-color:rgba(255,0,0,0);
                        //     }
                        //     .order-add{
                        //         background: url('../assets/images/add.png') no-repeat;
                        //         background-size: 100%;
                        //         -webkit-tap-highlight-color:rgba(255,0,0,0);
                        //     }
                        //     >em{
                        //         display: inline-block;
                        //         width:toRem(50px);
                        //         @include sc(toRem(30px),#18191a); 
                        //         vertical-align: middle;
                        //         text-align: center;
                        //         // margin: 0 toRem(10px);
                        //     }
                        // } 
                        >div{
                            display: inline-block;
                            // float: right;
                            margin-top: toRem(7px);
                            border: solid toRem(1px) #e1e1e1;
                            width:toRem(170px);
                            border-radius: toRem(6px);
                            height: toRem(56px);
                            font-size: 0;
                            // text-align: center;
                            >i{
                                display: inline-block;
                                width: toRem(52px);
                                height: toRem(56px);
                            }
                            .order-reduce{
                                background: url('../assets/images/reduce-icon.png') no-repeat center;
                                background-size: toRem(20px) toRem(2px);
                                -webkit-tap-highlight-color:rgba(255,0,0,0);
                            }
                            .order-add{
                                background: url('../assets/images/add-icon.png') no-repeat center;
                                background-size: toRem(18px) toRem(18px);
                                -webkit-tap-highlight-color:rgba(255,0,0,0);
                            }
                            >em{
                                display: inline-block;
                                width:toRem(60px);
                                // height: 100%;
                                line-height: toRem(56px);
                                vertical-align: top;
                                font-style: normal;
                                @include sc(toRem(30px),#18191a);
                                // margin: toRem(9px) 0 0;
                                text-align: center;
                                border-left:toRem(1px) solid #e1e1e1;
                                border-right:toRem(1px) solid #e1e1e1;
                            } 
                        }
                    }
                    >th,>td{
                        width:20%;
                        text-align: center;
                        &.esp{
                            width:14%;
                        }
                    }
                } 
            }
        }
        .single-room{
            @include sc(toRem(24px),#666);
            margin-left: toRem(50px);
            padding-right:toRem(50px);
            border-top: solid 1px #e1e1e1;
            padding-top: toRem(30px);
            >input{
                 -webkit-tap-highlight-color:rgba(255,0,0,0);
                float: right;
                width:toRem(490px);
                line-height: toRem(46px);
                @include sc(toRem(26px),#18191a);
                text-align: right;
                border:none;
                border-bottom:1px solid #ddd;
                outline: none;
                &::placeholder{
                    @include sc(toRem(18px),#999);
                }
            }
            >span{
                float: right;
            }
        }
        >h3{
            clear: both;
        }
    }
    .traffic-information{
        >div{
            padding-bottom: toRem(30px);
            >p{
                @include sc(toRem(24px),#999);
                padding-left: toRem(30px);
                padding-top: toRem(30px);
            }
            .trip-line{
                // padding: toRem(35px) 0 toRem(40px);
                border-bottom:dotted 1px #a0a0a0;
                padding-bottom: toRem(40px);
                // margin-bottom: toRem(28px);
                &:last-child{
                    border-bottom:none;
                    padding-bottom: 0;
                }
                >p{
                    @include sc(toRem(28px),#333);  
                    line-height: toRem(28px);
                    margin-bottom: toRem(19px);
                    padding-left: toRem(25px);
                    padding-top: toRem(20px);
                    >span{
                        margin-left: toRem(10px);
                        @include sc(toRem(22px),$main-color);
                    }
                }
                .flight-line{
                    width:toRem(182px);
                    display: inline-block;
                    vertical-align: middle;
                    text-align: center;
                    // margin-top: toRem(40px);
                    font-size: 0;
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
                        top:toRem(-15px);
                        width:100%;
                        text-align: center;
                    }
                }
                .flight-path{
                    width:toRem(245px);
                    display: inline-block;
                    vertical-align: middle;
                    &.esp{
                        text-align: right;
                    }
                    >h2{
                        @include sc(toRem(20px),#333);
                        text-align: center;
                        margin: toRem(5px) 0;
                    }
                    >h1{
                        @include sc(toRem(36px),#18191a);
                        line-height: toRem(36px);
                        text-align: center;
                    }
                    >p{
                        @include sc(toRem(22px),#333); 
                        text-align: center;
                    }
                }
                .flight-info{
                    float: right;
                    text-align: center;
                    >p{
                        @include sc(toRem(20px),#434343);
                    }
                }
            }
            // .trip-line{
            //     margin: 0 toRem(30px);
            //     padding: toRem(35px) 0 toRem(40px);
            //     border-bottom:dotted 1px #a0a0a0;
            //     >p{
            //        @include sc(toRem(18px),#999);  
            //        line-height: toRem(18px);
            //        margin-top: toRem(39px);
            //     }
            //     .flight-line{
            //         width:toRem(180px);
            //         display: inline-block;
            //         vertical-align: top;
            //         text-align: center;
            //         margin-top: toRem(40px);
            //         font-size: 0;
            //         >i{
            //             width:toRem(180px);
            //             height: toRem(19px);
            //             display: inline-block;
            //             background: url('../assets/images/fly-no.png') no-repeat;
            //             background-size: 100%;
            //         }
            //         >p{
            //            @include sc(toRem(18px),#666); 
            //         }
            //         >h2{
            //             @include sc(toRem(24px),#999); 
            //         }
            //     }
            //     .flight-path{
            //         width:toRem(241px);
            //         display: inline-block;
            //         vertical-align: top;
            //         &.esp{
            //             text-align: right;
            //         }
            //         >p{
            //             @include sc(toRem(24px),#666);
            //             >span{
            //                 @include sc(toRem(24px),#fb184d);
            //             }  
            //         }
            //         >h2{
            //             @include sc(toRem(22px),#999);
            //         }
            //         >h1{
            //             @include sc(toRem(40px),#18191a);
            //             line-height: toRem(40px);
            //             margin: toRem(25px) 0 toRem(10px) 0;
            //         }
            //     }
            // }
        }
    }
    .sale-staff{
        >div{
            padding-left: toRem(27px);
            padding-bottom: toRem(25px);
            padding-top: toRem(5px);
            >label{
                @include sc(toRem(28px),#333);
                margin-right: toRem(48px);
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
    }
    .booker{
        >div{
            >div{
                height: toRem(90px);
                line-height: toRem(88px);
                padding-left: toRem(27px);
                border-bottom:1px solid #e1e1e1;
                font-size: 0;
                >label{
                    @include sc(toRem(28px),#333);
                    margin-right: toRem(48px);
                }
                >p{
                    display: inline-block;
                    @include sc(toRem(28px),#333);
                }
                &:last-child{
                    border-bottom:none;
                }
            }
        }
    }
    .book-intro{
        >div{
            padding: 0 toRem(30px);
            >div{
                padding-top: toRem(40px);
                >h4{
                  @include sc(toRem(24px),#333);  
                  font-weight: bold;
                  margin-bottom: toRem(10px);
                }
                >p{
                   @include sc(toRem(24px),#222);  
                }
            }
        }
    }
    // .submit-bottom{
    //     position: fixed;
    //     bottom: 0;
    //     z-index: 10;
    //     width:100%;
    //     margin-bottom: 0;
    //     background: #fff;
    //     // opacity: 1;
        
    // }
    .bottom-info{
        height: toRem(98px);
        width:100%;
        box-shadow: 0px toRem(-4px) toRem(8px) 0px rgba(0, 0, 0, 0.2);
        border-radius: toRem(22px) toRem(22px) 0px 0px;
        position: fixed;
        bottom:0;
        width:100%;
        z-index: 101;
        margin-bottom: 0;
        >div{
            display: inline-block;
            line-height: toRem(98px);
            @include sc(toRem(24px),#333);
            padding-left: toRem(20px);
            width: calc(100% - #{toRem(300px)});
            >span{
                @include sc(toRem(36px),#ff601a);
            }
            >a{
                @include sc(toRem(24px),$main-color);
                float: right;
                padding-right: toRem(10px);
                -webkit-tap-highlight-color:rgba(255,0,0,0);
            }
        }
        >a{
            width:toRem(280px);
            height: toRem(98px);
            line-height: toRem(98px);
            float:right;
            display: inline-block;
            @include sc(toRem(30px),#fff);
            background-color: #ff601a;
	        border-radius: 0px toRem(22px) 0px 0px;
            text-align: center;
            -webkit-tap-highlight-color:rgba(255,0,0,0);
        }
    }
    .bottom-alert{
        position: fixed;
        z-index: 100;
        bottom:toRem(98px);
        width:100%;
        margin-bottom: 0;
        >h2{
            @include sc(toRem(30px),#18191a);
            margin-left: toRem(20px);
            border-bottom:1px solid #18191a;
            line-height: toRem(30px);
            padding: toRem(40px) 0 toRem(18px) 0;
        }
        >div{
            padding:toRem(20px) toRem(24px) toRem(40px);
            >p{
               @include sc(toRem(26px),#18191a); 
               line-height: toRem(50px);
               >span{
                   float: right;
                   @include sc(toRem(26px),#ff601a);
               }
            }
        }
    }
    .box{
        position: fixed;
        height:calc(100vh - #{toRem(110px)});
        width:100%;
        top:0;
        left:0;
        opacity: .6;
        background: #000;
        // z-index: 1;
    }
}
</style>

