<!--这是团期选择页面-->
<template>
    <div class="group-selection">
        <!-- 选择出发城市 -->
        <div class="change-city" @click="toDepartureCity">
            出发城市：
            <span>{{departureCity}}</span>
            <!-- <popup-picker :data="departuresNameList" v-model="departureCity" @on-show="onShow" @on-hide="onHide" @on-change="onChange" ></popup-picker> -->
            <i :class="openCity==true?'active':''"></i>
        </div>
        <!-- 选择团期 -->
        <div class="calendar">
            <div class="month-tab">
                <!-- <a href="javascript:;" class="tab-left"></a> -->
                <ul>
                    <li v-for="(date,index) in tourList" @click.stop.prevent="indexDate=index" :class="index==indexDate?'active':''">
                        <a href="javascript:;">
                            <p>{{date.month}}</p>
                            <h3 v-if="date.minSalePrice!=0&&userType==1">￥{{date.minSalePrice}}起</h3>
                            <h3 v-if="date.minDirectPrice!=0&&userType==2">￥{{date.minDirectPrice}}起</h3>
                            <h3 v-if="date.minSalePrice==0&&userType==1">无班期</h3>
                            <h3 v-if="date.minDirectPrice==0&&userType==2">无班期</h3>
                        </a>
                    </li>
                </ul>
                <!-- <a href="javascript:;" class="tab-right"></a> -->
            </div>
            <div class="calendar-week">
                <span>日</span>
                <span>一</span>
                <span>二</span>
                <span>三</span>
                <span>四</span>
                <span>五</span>
                <span>六</span>
            </div>
            <div class="calendar-bd">
                <ul v-if="indexDate==0" :class="arrWeek[0]==1?'one':(arrWeek[0]==2?'two':(arrWeek[0]==3?'three':(arrWeek[0]==4?'four':(arrWeek[0]==5?'five':(arrWeek[0]==6?'six':'')))))">
                    <li v-for="(i,index) in first" :class="i.price==''?'invalid':(i.selected==true?'act':'')" @click.stop.prevent="selectDateFun(first,index)">
                        <p>{{i.day}}</p>
                        <div>
                            <i v-if="i.isAck===1&&!i.failure" class="ack"></i>
                            <i v-if="i.isTail===1&&!i.failure" class="tail"></i>
                            <i v-if="i.useDiscount===true&&!i.failure" class="discount"></i>
                        </div>
                        <!-- <span v-if="i.remain!=''&&i.remain<10"><i v-if="i.remain!=''">余</i>{{i.remain}}</span>
                        <span v-if="i.remain!=''&&i.remain>9">充足</span> -->
                        <h3 v-if="!i.failure"><span v-if="i.price!=''">￥</span>{{i.price}}<span v-if="i.price!=''">起</span></h3>
                    </li>
                </ul>
                <ul v-if="indexDate==1" :class="arrWeek[1]==1?'one':(arrWeek[1]==2?'two':(arrWeek[1]==3?'three':(arrWeek[1]==4?'four':(arrWeek[1]==5?'five':(arrWeek[1]==6?'six':'')))))">
                    <li v-for="(i,index) in second" :class="i.price==''?'invalid':(i.selected==true?'act':'')" @click.stop.prevent="selectDateFun(second,index)">
                        <p>{{i.day}}</p>
                        <div>
                            <i v-if="i.isAck===1&&!i.failure" class="ack"></i>
                            <i v-if="i.isTail===1&&!i.failure" class="tail"></i>
                            <i v-if="i.useDiscount===true&&!i.failure" class="discount"></i>
                        </div>
                        <!-- <span v-if="i.remain!=''&&i.remain<10"><i v-if="i.remain!=''">余</i>{{i.remain}}</span>
                        <span v-if="i.remain!=''&&i.remain>9">充足</span> -->
                        <h3 v-if="!i.failure"><span v-if="i.price!=''">￥</span>{{i.price}}<span v-if="i.price!=''">起</span></h3>
                    </li>
                </ul>
                <ul v-if="indexDate==2" :class="arrWeek[2]==1?'one':(arrWeek[2]==2?'two':(arrWeek[2]==3?'three':(arrWeek[2]==4?'four':(arrWeek[2]==5?'five':(arrWeek[2]==6?'six':'')))))">
                    <li v-for="(i,index) in three" :class="i.price==''?'invalid':(i.selected==true?'act':'')" @click.stop.prevent="selectDateFun(three,index)">
                        <p>{{i.day}}</p>
                        <div>
                            <i v-if="i.isAck===1&&!i.failure" class="ack"></i>
                            <i v-if="i.isTail===1&&!i.failure" class="tail"></i>
                            <i v-if="i.useDiscount===true&&!i.failure" class="discount"></i>
                        </div>
                        <!-- <span v-if="i.remain!=''&&i.remain<10"><i v-if="i.remain!=''">余</i>{{i.remain}}</span>
                        <span v-if="i.remain!=''&&i.remain>9">充足</span> -->
                        <h3  v-if="!i.failure"><span v-if="i.price!=''">￥</span>{{i.price}}<span v-if="i.price!=''">起</span></h3>
                    </li>
                </ul>
                <ul v-if="indexDate==3" :class="arrWeek[3]==1?'one':(arrWeek[3]==2?'two':(arrWeek[3]==3?'three':(arrWeek[3]==4?'four':(arrWeek[3]==5?'five':(arrWeek[3]==6?'six':'')))))">
                    <li v-for="(i,index) in four" :class="i.price==''?'invalid':(i.selected==true?'act':'')" @click.stop.prevent="selectDateFun(four,index)">
                        <p>{{i.day}}</p>
                        <div>
                            <i v-if="i.isAck===1&&!i.failure" class="ack"></i>
                            <i v-if="i.isTail===1&&!i.failure" class="tail"></i>
                            <i v-if="i.useDiscount===true&&!i.failure" class="discount"></i>
                        </div>
                        <!-- <span v-if="i.remain!=''&&i.remain<10"><i v-if="i.remain!=''">余</i>{{i.remain}}</span>
                        <span v-if="i.remain!=''&&i.remain>9">充足</span> -->
                        <h3  v-if="!i.failure"><span v-if="i.price!=''">￥</span>{{i.price}}<span v-if="i.price!=''">起</span></h3>
                    </li>
                </ul>
                <p></p>
            </div>
        </div>
        <!-- margin -->
        <div class="margin-color"></div>
        <!-- 价格策略 -->
        <div class="price-policy">
            <div class="policy-con" v-if="pricePolicyList.length!=0">
                <div v-for="(policy,index) in pricePolicyList">
                    <label for="">{{policy.policyName}}</label>
                    <div class="policy-price" v-if="userType==1">
                        <span><i>￥{{policy.salesPrice}}</i>/人</span>
                        <span v-if="policy.beforeDiscountDirectPrice!=null"><i>直客价</i>￥{{policy.beforeDiscountDirectPrice}}</span>
                        <span v-if="policy.beforeDiscountDirectPrice==null"><i>直客价</i>￥{{policy.directPrice}}</span>
                        <span><i>返</i>￥{{policy.rebatePrice}}</span>
                        <!-- <span v-if="commissionShow==true">返<i>{{policy.rebatePrice}}</i></span> -->
                        <p v-if="policy.beforeDiscountSalesPrice!=null"><span>原价：<i>￥{{policy.beforeDiscountSalesPrice}}</i></span><em>优惠{{policy.discountSalesPrice}}元</em></p>
                    </div>
                    <div class="policy-price" v-if="userType==2">
                          <span><i>￥{{policy.directPrice}}</i>/人</span>
                          <p v-if="policy.beforeDiscountDirectPrice!=null"><span>原价：<i>￥{{policy.beforeDiscountDirectPrice}}</i></span><em>已优惠{{policy.discountDirectPrice}}元</em></p>
                    </div>
                    <p class="policy-btn" :class="policy.useDiscount==true?'esp':''">
                        <i class="reduce" @click.stop.prevent="reduceCount(pricePolicyList,policy)"></i>
                        <em>{{policy.count}}</em>
                        <i class="add" @click.stop.prevent="addCount(pricePolicyList,policy)"></i>
                    </p>
                    <a href="javascript:;"></a>
                </div>
            </div>
            <!-- <p v-if="pricePolicyList.length!=0&&userType==1"><a href="javascript:;" @click.stop.prevent="commissionFun()">{{commissionText}}</a></p> -->
        </div>
        <div class="group-bottom"  v-if="pricePolicyList.length!=0" @click="nextFun()">
            <h2>下一步</h2>
            <p>确认预定信息</p>
        </div>
        <div class="group-bottom esp"  v-if="pricePolicyList.length==0" @click="nextFialFun()">
            <h2>下一步</h2>
            <p>确认预定信息</p>
        </div>
        <toast v-model="showTip" type="text">{{tipText}}</toast>
        <service></service>
    </div>
</template>
<script>
import tools from '../common/tools'
import { getPolicysList,getTours,getProductDepartures,validateDetail} from '../services/index'
import Vue from 'vue'
import service from '../components/service'
import { PopupPicker,Toast } from 'vux'
export default {
    data(){
        return{
            proid:'',//产品id
           // 团期相关
            tourList:[],//团期列表
            indexDate:0,//显示第一个月的日期
            tour:[],//返回的团期
            first:[],
            second:[],
            three:[],
            four:[],
            arrWeek:[],
            firstCopy:[],
            secondCopy:[],
            threeCopy:[],
            fourCopy:[],
            arrLastDay:[],


            departuresList: [],//出发地列表
            departuresNameList: [],//出发地城市名称列表
            departureCity: '',//出发城市
            openCity:false,
            pricePolicyList:[],//价格策略列表
            commissionText:'点击查看佣金',//控制佣金提示文字
            commissionShow:false,//控制佣金显隐
            userType:'',//用户类型
            showTip:false,//提示框显隐
            tipText:'',//提示框内容
            stock:'',//库存
            isOutgoing:'',//产品是外发还是普通
        }
    },
    methods: {
        // 去选择出发地
        toDepartureCity(){
            this.$router.push('/departure-city');
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
        //团期日期渲染方法
        drawFun(arr1,arr2){
            let date=new Date();
            if(arr2){
                for(let i=0;i<arr1.length;i++){
                    for(let j=0;j<arr2.length;j++){
                        if(arr1[i].day==parseInt(arr2[j].tourDate.split('-')[2])){
                            if(this.userType==1){
                                arr1[i].price=arr2[j].salesPrice;
                            }
                            else if(this.userType==2){
                                 arr1[i].price=arr2[j].directPrice;
                            }
                            arr1[i].remain=arr2[j].stock;
                            arr1[i].date=arr2[j].tourDate;
                            arr1[i].id=arr2[j].id;
                            arr1[i].isAck=arr2[j].isAck;
                            arr1[i].isTail=arr2[j].isTail;
                            arr1[i].useDiscount=arr2[j].useDiscount;
                            let date2=new Date(arr2[j].dueDate);
                            let date3=new Date(arr2[j].tourDate);
                            if(date2.getTime()<=(date.getTime() - 24*60*60*1000)){
                                arr1[i].failure=true;
                            }
                            if(arr1[i].date==this.selectedDay){
                                arr1[i].selected=true;
                                // 把库存放入缓存
                                tools.setLocalStorage('stock',arr1[i].remain);
                                this.stock=arr1[i].remain;
                            }
                        }
                    }
                }
            }
        },
        // 选择团期人数页面初始化
        groupSelectionInit(){
           
             // 获取用户类型
            this.userType=tools.getLocalStorage('userType');
            this.isOutgoing=tools.getLocalStorage('isOutgoing');
            this.proid=this.$route.params.id;
            // 保存产品id
            tools.setLocalStorage('proId',this.$route.params.id);
            //  alert(this.proid);
            // this.departureCity=[];
            // this.departureCity.push(tools.getLocalStorage('departure'));
            this.departureCity=tools.getLocalStorage('departure');
            // // 判断上一页是否选择团期
            if(tools.getLocalStorage('selectedDay')){
                this.selectedDay=tools.getLocalStorage('selectedDay');
            }
            if(tools.getLocalStorage('tourid')){
                this.tourid=tools.getLocalStorage('tourid');
            }
            // 获取url中的id
            let params={
                'proid':this.proid,
                'siteid':tools.getSessionStorage('siteId'),
                'isOutgoing':tools.getLocalStorage('isOutgoing'),
                'orgId':tools.getLocalStorage('orgIdw'),
            };
            // 团期接口绑定
            getTours(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('团期接口数据获取成功');
                    this.tourList=response.data.returnList;
                    console.log('tourList',this.tourList);
                    if(response.data.returnList!=''){
                        for(let i=0;i<response.data.returnList.length;i++){
                            this.tour.push(response.data.returnList[i].tourList);
                        }
                    }
                     // 判断上一页是否选择团期
                    if(tools.getLocalStorage('selectedDay')){
                        for(let i=0;i<this.tourList.length;i++){
                            if(this.selectedDay.slice(0,7)==this.tourList[i].month){
                                this.indexDate=i;
                            }
                        }
                    }
                    this.arrWeek=[];
                    this.arrLastDay=[];
                    for(let i=0;i<this.tourList.length;i++){
                        // 判断一个月是从星期几开始
                        this.arrWeek.push(this.getWeekDay(this.tourList[i].month.split('-')[0],this.tourList[i].month.split('-')[1]-1).week);//每月第一天从周几开始
                        this.arrLastDay.push(this.getWeekDay(this.tourList[i].month.split('-')[0],this.tourList[i].month.split('-')[1]-1).sumday);//一个月总共多少天
                    };
                    // 根据每个月的天数去组合数组
                    // console.log(this.arrLastDay);
                    this.first=[];
                    this.second=[];
                    this.three=[];
                    this.four=[];
                    for(let i=0;i<this.arrLastDay.length;i++){
                        for(let j=0;j<this.arrLastDay[i];j++){
                            if(i==0){ 
                                this.first.push({'day':j+1,'remain':'','price':'','selected':false,'date':'','id':'','failure':false,'isAck':'','isTail':0,'useDiscount':false})
                            }
                            else if(i==1){
                                this.second.push({'day':j+1,'remain':'','price':'','selected':false,'date':'','id':'','failure':false,'isAck':'','isTail':0,'useDiscount':false})
                            }
                            else if(i==2){
                                this.three.push({'day':j+1,'remain':'','price':'','selected':false,'date':'','id':'','failure':false,'isAck':'','isTail':0,'useDiscount':false})
                            }
                            else if(i==3){
                                this.four.push({'day':j+1,'remain':'','price':'','selected':false,'date':'','id':'','failure':false,'isAck':'','isTail':0,'useDiscount':false})
                            }
                        }
                    }
                    console.log(this.first);
                    this.firstCopy=this.tour[0];
                    this.secondCopy=this.tour[1];
                    this.threeCopy=this.tour[2];
                    this.fourCopy=this.tour[3];
                    this.drawFun(this.first,this.firstCopy);
                    this.drawFun(this.second,this.secondCopy);
                    this.drawFun(this.three,this.threeCopy);
                    this.drawFun(this.four,this.fourCopy);
                }
                else{
                    console.log('团期接口数据获取失败');
                }
            }).catch((err)=>{
                console.log('团期接口获取异常',err);
                // this.$Message.info('团期接口获取异常');
            });


            // 出发地接口绑定
            getProductDepartures(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('出发地数据获取成功');
                    this.departuresList=[];
                    this.departuresList=response.data.departures;
                    // 取出每个出发地的城市名称
                    let cityArr=[];
                    for(let i=0;i<response.data.departures.length;i++){
                        cityArr.push(response.data.departures[i].departure);
                    }
                    this.departuresNameList.push(cityArr);
                }
                else{
                    console.log('出发地数据获取失败');
                }
            }).catch((err)=>{
                console.log('出发地异常报错',err);
                // this.$Message.info('出发地接口获取异常');
            });

            //如果上一页已经选择日期
            if(tools.getLocalStorage('selectedDay')){
                let params={
                    'proid':this.$route.params.id,
                    'tourDate':this.selectedDay,
                    'siteid':tools.getSessionStorage('siteId'),
                    'isOutgoing':tools.getLocalStorage('isOutgoing'),
                    'orgId':tools.getLocalStorage('orgIdw'),
                    'tourid':this.tourid
                }
                // 价格策略接口绑定
                getPolicysList(params).then((response)=>{
                        console.log(response);
                        if(response.meta.success==true){
                            console.log('价格策略数据获取成功');
                            this.pricePolicyList=response.data[0].pricePolicyList;
                            if(this.pricePolicyList.length!=0){
                                for(let i=0;i<this.pricePolicyList.length;i++){
                                    this.$set(this.pricePolicyList[i], 'count', 0);
                                    // if(this.pricePolicyList[i].touristType==1){
                                    //     this.$set(this.pricePolicyList[i], 'count', 1);
                                    // }
                                    // else{
                                    //     this.$set(this.pricePolicyList[i], 'count', 0);
                                    // }
                                }
                                 for(let i=0;i<this.pricePolicyList.length;i++){
                                    if(this.pricePolicyList[i].touristType==1){
                                        this.$set(this.pricePolicyList[i], 'count', 1);
                                        return;
                                    }
                                }
                            }
                        }
                        else{
                            console.log('价格策略数据获取失败');
                        }
                    }).catch((err)=>{
                        console.log('价格策略接口获取异常',err);
                        // this.$Message.info('价格策略接口获取异常');
                    });
            }
        },
        // 选择团期
        selectDateFun(obj,index){
            // alert(this.proid);
            console.log(obj,'ooooo');
            if(obj[index].price!=''&&obj[index].failure!=true){
                this.$nextTick(()=>{ 
                    obj[index].selected=true;
                    this.selectedDay=obj[index].date;
                    this.tourid=obj[index].id; 
                    this.stock=obj[index].remain;//库存
                    console.log(this.stock,'stock');
                    //把选择人日期放入缓存
                    tools.setLocalStorage('selectedDay',this.selectedDay);
                    //把团期id放入缓存
                    tools.setLocalStorage('tourid',this.tourid);
                    // 把库存放入缓存
                    tools.setLocalStorage('stock',this.stock);
                     // 是否及时确认
                    tools.setLocalStorage('isAck',obj[index].isAck);
                    //价格策略接口请求参数
                    let params={
                        'proid':this.proid,
                        'tourDate':this.selectedDay,
                        'siteid':tools.getSessionStorage('siteId'),
                        'isOutgoing':tools.getLocalStorage('isOutgoing'),
                        'orgId':tools.getLocalStorage('orgIdw'),
                        'tourid':obj[index].id
                    }
                    // 价格策略接口绑定
                    // this.sumPrice=0;
                    getPolicysList(params).then((response)=>{
                        console.log(response);
                        if(response.meta.success==true){
                            console.log('价格策略数据获取成功');
                            this.pricePolicyList=response.data[0].pricePolicyList;
                            if(this.pricePolicyList.length!=0){
                                for(let i=0;i<this.pricePolicyList.length;i++){
                                    if(this.pricePolicyList[i].touristType==1){
                                        this.$set(this.pricePolicyList[i], 'count', 1);
                                    }
                                    else{
                                        this.$set(this.pricePolicyList[i], 'count', 0);
                                    }
                                    // this.sumPrice+=this.pricePolicyList[i].salesPrice*this.pricePolicyList[i].count;
                                }
                            }
                            console.log(this.pricePolicyList);
                        }
                        else{
                            console.log('价格策略数据获取失败');
                        }
                    }).catch((err)=>{
                        console.log('价格策略接口获取异常',err);
                        // this.$Message.info('价格策略接口获取异常');
                    });
                })
                //  console.log('first',this.four);
                //  console.log('obj',obj);
                //  console.log(this.three);
                //  console.log(this.four);
                // return;
                for(let i=0;i<obj.length;i++){
                    if(i!=index && obj[i].price!=''){
                        // console.log(obj[i].price);
                        obj[i].selected=false;
                    }
                }
                for(let i = 0;i<obj.length;i++){
                    if(obj==this.first){
                        for(let j=0;j<=(this.second.length&&this.three.length&&this.four.length);j++){
                            if(!tools.isUndefined(this.second[j]) && !tools.isUndefined(this.second[j].selected)){
                                this.second[j].selected=false;
                            }
                            if(!tools.isUndefined(this.three[j]) && !tools.isUndefined(this.three[j].selected)){
                                this.three[j].selected=false;
                            }
                            if(!tools.isUndefined(this.four[j]) && !tools.isUndefined(this.four[j].selected)){
                                this.four[j].selected=false;
                            }
                        }
                    }
                    else if(obj==this.second){
                         for(let j=0;j<=(this.first.length&&this.three.length&&this.four.length);j++){
                            if(!tools.isUndefined(this.first[j]) && !tools.isUndefined(this.first[j].selected)){
                                this.first[j].selected=false;
                            }
                            if(!tools.isUndefined(this.three[j]) && !tools.isUndefined(this.three[j].selected)){
                                this.three[j].selected=false;
                            }
                            if(!tools.isUndefined(this.four[j]) && !tools.isUndefined(this.four[j].selected)){
                                this.four[j].selected=false;
                            }
                        }
                    }
                    else if(obj==this.four){
                         for(let j=0;j<=(this.second.length&&this.three.length&&this.first.length);j++){
                            if(!tools.isUndefined(this.second[j]) && !tools.isUndefined(this.second[j].selected)){
                                this.second[j].selected=false;
                            }
                            if(!tools.isUndefined(this.three[j]) && !tools.isUndefined(this.three[j].selected) ){
                                this.three[j].selected=false;
                            }
                            if(!tools.isUndefined(this.first[j]) && !tools.isUndefined(this.first[j].selected)){
                                this.first[j].selected=false;
                            }
                        }
                    }
                    else if(obj==this.three){
                        for(let j=0;j<(this.second.length&&this.first.length&&this.four.length);j++){
                            if(!tools.isUndefined(this.second[j]) && !tools.isUndefined(this.second[j].selected)){
                                this.second[j].selected=false;
                            }
                            if(!tools.isUndefined(this.first[j]) && !tools.isUndefined(this.first[j].selected)){
                                this.first[j].selected=false;
                            }
                            if(!tools.isUndefined(this.four[j]) && !tools.isUndefined(this.four[j].selected)){
                                this.four[j].selected=false;
                            }
                        }
                    }
                } 
            }
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
        },
        // 增加出游人数
        addCount(pricePolicyList,policy){
            let countSum=0;
            for(let i=0;i<this.pricePolicyList.length;i++){
                countSum+=this.pricePolicyList[i].count;
            }
            console.log(countSum);
            console.log(this.stock);
            if(countSum>=this.stock){
                this.showTip=true;
                this.tipText="已达库存上线~"
                return;
            }
            policy.count++;
        },
        // 控制返佣价格显示隐藏及文字提示
        commissionFun(){
            this.commissionShow=!this.commissionShow;
            if(this.commissionShow==true){
                this.commissionText="点击隐藏";
            }
            else if(this.commissionShow==false){
                 this.commissionText="点击查看佣金"
            }
        },
        // 没选团期点下一步时
        nextFialFun(){
            this.showTip=true;
            this.tipText="请先选择出团日期~"
        },
        // 下一步
        nextFun(){
            if(tools.getSessionStorage('mobile')=='null' && this.userType==2){
                this.$router.push('/bind-phone/'+this.proid);
                return;
            }
            let countArr=[];
            let policyIdArr=[];
            let policyPriceArr=[];
            for(let i=0;i<this.pricePolicyList.length;i++){
                countArr.push(this.pricePolicyList[i].count);
                // 把人数存来
                tools.setLocalStorage('countArr',JSON.stringify(countArr));
                policyIdArr.push(this.pricePolicyList[i].id);
                if(this.userType==1){
                    policyPriceArr.push(this.pricePolicyList[i].salesPrice);
                }
                else if(this.userType==2){
                    policyPriceArr.push(this.pricePolicyList[i].directPrice);
                }
            }
            // 要删掉
            // this.$router.push('/select-resource/'+this.proid);
            let params={
                'policyprice':policyPriceArr,
                'policyid':policyIdArr,
                'personnum':countArr,
                'tourid':tools.getLocalStorage('tourid'),
                'siteid':tools.getSessionStorage('siteId'),
                'isOutgoing':tools.getLocalStorage('isOutgoing'),
                'orgId':tools.getLocalStorage('orgIdw'),
            }
            // 下一步验证接口绑定
            validateDetail(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('验证成功');
                    // 一会要放开
                    this.$router.push('/select-resource/'+this.proid);
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
        this.groupSelectionInit();
    },
    components: {
       PopupPicker,
       Toast,
       service
    },
}
</script>

<style lang="scss" >
.group-selection{
    background: #fff;
    min-height: calc(100vh - #{toRem(178px)});
    overflow: auto;
    padding-bottom: toRem(98px);
    .change-city{
        height: toRem(65px);
        line-height:toRem(65px);
        background-color: #f8f8f8;
        font-size: toRem(26px);
        text-align: center;
        >.vux-cell-box{
            -webkit-tap-highlight-color:rgba(255,0,0,0);
            display: inline-block;
            vertical-align: top;
            height: toRem(65px);
            line-height:toRem(65px);
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
            width:toRem(18px);
            height: toRem(10px);
            background: url('../assets/images/city-down.png') no-repeat;
            background-size: 100%;
            &.active{
                background: url('../assets/images/city-up.png') no-repeat;
                background-size: 100%;
            }
        }
    }
    .calendar{
        width:100%;
        margin-bottom: toRem(40px);
        .month-tab{
            height: toRem(104px);
            >ul{
                display: inline-block;
                width:100%;
                >li{
                    list-style: none;
                    float: left;
                    width:25%;
                    text-align: center;
                    height: toRem(104px);
                    padding-top: toRem(20px);
                    box-sizing: border-box;
                    -webkit-tap-highlight-color:rgba(255,0,0,0);
                    >a{
                        display: inline-block;
                        height: toRem(84px);
                        >p{
                            line-height: toRem(26px);
                            @include sc(toRem(26px),#333); 
                            margin-bottom: toRem(10px);
                        }
                        >h3{
                            line-height:toRem(18px);
                            @include sc(toRem(18px),#ffc33f); 
                            font-weight: normal;
                        }
                    }
                    &.active{
                        >a{
                            >p,>h3{
                                color:$main-color;
                            }
                        }
                    }
                }
            }
        }
        .calendar-week{
            line-height: toRem(47px);
            height:toRem(47px);
            background:#f4f4f4; 
            font-size:0px;
            >span{
                display: inline-block;
                width:14.28%;
                text-align: center;
                @include sc(toRem(22px),#18191a); 
            }
        }
        .calendar-bd{
            width:100%;
            margin: toRem(20px) 0;
            >ul{
                width:100%;
                >li{
                    list-style: none;
                    float: left;
                    height:toRem(90px);
                    width:14.28%;
                    text-align:center; 
                    padding-top: toRem(32px);
                    box-sizing: border-box;
                    padding-bottom: toRem(9px);
                    -webkit-tap-highlight-color:rgba(255,0,0,0);
                    position: relative;
                    >div{
                        position: absolute;
                        top:toRem(7px);
                        right:toRem(7px);
                        font-size: 0;
                        >i{
                            display: inline-block;
                            @include wh(toRem(20px),toRem(20px));
                        }
                        .ack{
                            background: url('../assets/images/zhi.png') no-repeat;
                            background-size: 100%;
                        }
                        .tail{
                            background: url('../assets/images/wei.png') no-repeat;
                            background-size: 100%;
                        }
                        .discount{
                            background: url('../assets/images/cu.png') no-repeat;
                            background-size: 100%;
                        }
                    }
                    >p{
                        @include sc(toRem(26px),#4d6687); 
                        line-height: toRem(26px);
                    }
                    >h3{
                        font-weight: normal;
                        @include sc(toRem(18px),#ffc33f); 
                    }
                    // >span{
                    //     display: inline-block;
                    //     width:100%;
                    //         @include sc(12px,#999);
                    //         >i{
                    //         font-style: normal;
                    //         }
                    // }
                    &.invalid{
                        >p{
                            @include sc(toRem(26px),#18191a); 
                        }
                    }
                    &.act{
                        background-image: $main-bg;
                        border-radius: toRem(10px);
                        >p,>h3,>span{
                            color:#fff;
                        }
                        // >i{
                        //     background: url('../assets/images/timely.png') no-repeat;
                        //     background-size: 100%;
                        // }
                    }
                    &.fail{
                        background: #ccc;
                        >p,>h3,>span{
                            color:#ddd;
                        }
                    }
                }
                &.one{
                    >li:first-child{
                        margin-left: 14.2%;
                    }
                }
                &.two{
                    >li:first-child{
                        margin-left: 28.4%;
                    }
                }
                &.three{
                    >li:first-child{
                        margin-left: 42.6%;
                    }
                }
                &.four{
                    >li:first-child{
                        margin-left: 56.8%;
                    }
                }
                &.five{
                    >li:first-child{
                        margin-left: 71%;
                    }
                }
                &.six{
                    >li:first-child{
                        margin-left: 85.2%;
                    }
                }
            }
            >p{
                clear: both;
            }
        }
    }
    .margin-color{
        height: toRem(20px);
        background: #f4f7fa;
        width: 100%;
    }
    .price-policy{
        width:100%;
        // background-color: #f4f4f4;
        // padding: toRem(26px) toRem(30px);
        box-sizing: border-box;
        padding-bottom: toRem(40px);
        >p{
            text-align: right;
            margin-top: toRem(25px);
            padding-right:toRem(22px);
            line-height: toRem(24px);
            >a{
                // display: inline-block;
                // @include wh(toRem(180px),toRem(50px));
                // line-height: toRem(50px);
                // background-image: $main-bg;
	            // border-radius: toRem(25px);
                @include sc(toRem(24px),$main-color);
            }
        }
        .policy-con{
            >div{
                padding:toRem(10px) toRem(22px) toRem(17px) toRem(22px);
                border-bottom:1px solid #e1e1e1; 
                height: auto;
                >label{
                    @include sc(toRem(26px),#18191a);
                    margin-right: toRem(5px);
                    margin-top: toRem(18px);
                    display: inline-block;
                    vertical-align: top;
                }
                .policy-price{
                    display: inline-block;
                    vertical-align: top;
                    >span{
                        @include sc(toRem(26px),#18191a);
                    }
                    >p{
                        font-size: 0;
                        >span{
                            @include sc(toRem(23px),#999);
                            margin-right: toRem(15px);
                            >i{
                                text-decoration: line-through;
                            }
                        } 
                        >em{
                            @include sc(toRem(23px),#ffba00); 
                        }
                    }
                }
                .policy-btn{
                    float: right;
                    margin-top: toRem(7px);
                    border: solid toRem(1px) #e1e1e1;
                    width:toRem(170px);
                    border-radius: toRem(6px);
                    height: toRem(56px);
                    font-size: 0;
                    >i{
                        display: inline-block;
                        width: toRem(52px);
                        height: toRem(56px);
                    }
                    .reduce{
                        background: url('../assets/images/reduce-icon.png') no-repeat center;
                        background-size: toRem(20px) toRem(2px);
                        -webkit-tap-highlight-color:rgba(255,0,0,0);
                    }
                    .add{
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
                    &.esp{
                        margin-top: toRem(20px);
                    }
                }
                >a{
                    clear: both;
                    display: block;
                }
            }
        }
    }
    .group-bottom{
        position: fixed;
        bottom: 0;
        height:toRem(98px);
        width:100%;
        background-image: $main-bg;
        text-align: center;
        color:#fff;
        padding-top: toRem(25px);
        -webkit-tap-highlight-color:rgba(255,0,0,0);
        >h2{
            font-size: toRem(30px);
        }
        >p{
            font-size: toRem(18px);
        }
        &.esp{
            background: #ddd;
        }
    }
}
</style>

