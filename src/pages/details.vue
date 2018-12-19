<!--这是详情页面-->
<template>
    <div class="details">
        <!-- 详情头部 -->
        <div class="details-header">
            <div>
                <p>产品编号：{{productDetails.prono}}</p>
                <!-- <img :src="productDetails.mobilecoverimg" alt=""> -->
                <swiper :list="imageList" v-model="imgIndex" @on-index-change="onIndexChange"></swiper>
                <i></i>
                <span>{{imgIndex+1}}/{{imageList.length}}张</span>
            </div>
            <div>
                <h2>{{productDetails.aliasename}}</h2>
                <p><span class="now">￥{{nowPrice}}</span>
                   <span class="old" v-if="oldPrice!=nowPrice">原价：<i>￥{{oldPrice}}</i></span>
                    <!-- <span>403人出游</span> -->
                </p>
                <div>
                    <a href="javascript:;" v-for="tag in productTags.length">{{productTags[tag-1]}}</a>
                </div>
            </div>
        </div>
        <p class="margin-line"></p>
       <!-- 详情页选择团期 -->
        <div class="detials-select-con">
            <div class="detials-select-city">
                <!-- <popup-picker :data="departureNameList" v-model="departureCity" @on-show="onDepartureShow" @on-hide="onDepartureHide" @on-change="onDepartureChange" ></popup-picker>
                <span >[ 更改 ]</span> -->
                <label for="">{{departureCity}}</label>
                <a href="#/departure-city">[更改]</a>
<!-- <input value="[ 更改 ]" type="text" disabled="disabled"> -->
            </div>
            <div class="detials-select-tour">
                <a href="javascript:;" v-for="(date,index) in tourinfoList" @click="selectedTour(date,index)" :class="tourIndex==index?'active':''">
                    <h3>{{date.tourDateCopy}}</h3>
                    <p v-if="userType==1">￥{{date.salesPrice}}起</p>
                    <p v-if="userType==2">￥{{date.directPrice}}起</p>
                </a>
                <!-- '#/group-selection/'+productDetails.id -->
                <a @click="toGroupFun" href="javascript:;" class="more">更多日期</a>
            </div>
        </div>
         <p class="margin-line"></p>
        <!-- 行程介绍及一些说明区 -->
        <div class="trip-info">
            <!-- 导航 -->
            <div class="trip-info-nav" :class="searchBarFixed == true ? 'isFixed' :''" id="nav">
                 <ul >
                    <li :class="detailIndex==0?'active':''" @click.prevent="tripAnchor('features')">
                        <p>产品特色</p>
                        <span v-if="detailIndex==0"></span>
                    </li>
                    <li :class="detailIndex==1?'active':''" @click.prevent="tripAnchor('trip-line')">
                        <p>行程信息</p>
                        <span v-if="detailIndex==1"></span>
                    </li>
                    <li :class="detailIndex==2?'active':''" @click.prevent="tripAnchor('price')">
                        <p>价格说明</p>
                        <span v-if="detailIndex==2"></span>
                    </li>
                    <li :class="detailIndex==3?'active':''" @click.prevent="tripAnchor('reservation')">
                        <p>预定须知</p>
                        <span v-if="detailIndex==3"></span>
                    </li>
                    <li :class="detailIndex==4?'active':''" @click.prevent="tripAnchor('change')">
                        <p>退改规则</p>
                        <span v-if="detailIndex==4"></span>
                    </li>
                    <li :class="detailIndex==5?'active':''" @click.prevent="tripAnchor('other')">
                        <p>其他说明</p>
                        <span v-if="detailIndex==5"></span>
                    </li>
                </ul>
            </div>
            <!-- 产品特色 -->
            <a href="javascript:;" id="features" :class="searchBarFixed == true ? 'esp' :''"></a>
            <div class="trip-features">
                <!-- <h1>产品特色</h1> -->
                <div>
                    <div>
                        <h4 class="title-line">产品特色</h4>
                        <p v-html="productDetails.feature">{{productDetails.feature}}</p>
                    </div>
                    <a href="javascript:;" id="trip-line"></a>
                </div>
            </div>
            <!-- 行程介绍内容区 -->
            <div class="trip-introduce">
                <h1 class="title-line">行程信息</h1>
                <a href="javascript:;" v-if="!isDetailsTrip" @click="isDetailsTrip=true" class="trip-icon"><img src="../assets/images/xiangxixingcheng.png" alt=""></a>
                <a href="javascript:;" v-if="isDetailsTrip" @click="isDetailsTrip=false" class="trip-icon"><img src="../assets/images/jiaoyaoxingcheng.png" alt=""></a>
                <div>
                    <div class="trip-introduce-first">
                        <!-- 参考航班 -->
                        <!-- <h2 class="fly-line"><img src="../assets/images/fly.png" alt="">机票</h2> -->
                        <p class="flight-tip" v-if="trafficList.length==0">暂无参考航班</p>
                        <div class="trip-line" v-for="traffic in trafficList" v-if="trafficList.length!=0">
                            <p v-if="traffic.datastatus==1">出发</p>
                            <p v-if="traffic.datastatus==2">回程</p>
                            <div class="flight-path">
                                <h1>{{traffic.deptime}}</h1>
                                <h2>{{traffic.depname}}</h2>          
                            </div>
                            <div class="flight-line">
                                <p>{{traffic.trafficno}}</p>
                                <i></i>
                            </div>
                            <div class="flight-path esp">
                                <h1>{{traffic.arrtime}}</h1>
                                <h2>{{traffic.arrname}}</h2>
                            </div>
                            <!-- <div class="flight-info">
                                <p><i></i>{{traffic.airline}}</p>
                                <p></p>
                            </div> -->
                        </div>
                    </div>
                    <!-- 行程安排 -->
                    <div class="all-trip">
                        <div class="trip-introduce-last" :id="'trip'+(index+1)" v-for="(sche,index) in scheduleList">
                            <a href="javascript:;" :id="index+1" ></a>
                            <div class="trip-plan" >
                                <p class="plan-day">D{{sche.schDay}} <span>{{sche.schName}}</span></p>
                                <!-- <h2></h2> -->
                                <div class="plan-main-con" v-if="sche.schInfo!=''">
                                    <i v-if="isDetailsTrip"></i>
                                    <div class="plan-main" v-html="sche.schInfo" v-if="isDetailsTrip">
                                        {{sche.schInfo}}
                                    </div>
                                    <div class="plan-main-images" v-if="isDetailsTrip">
                                        <div v-for="img in sche.images">
                                            <img :src="img.imagesrc"  alt="">
                                            <p>{{img.imageinfo}}</p>
                                        </div>
                                    </div>
                                    <p  class="plan-main-hotel"><i v-if="sche.schStay!=''"></i>{{sche.schStay}}</p>
                                    <div class="plan-main-eat">
                                        <p>
                                            <i v-if="sche.schRepast!=0"></i>
                                            <span v-if="sche.schRepast==1">有早餐</span>
                                            <span v-if="sche.schRepast==2">有午餐</span>
                                            <span v-if="sche.schRepast==4">有晚餐</span>
                                            <span v-if="sche.schRepast==5">有早餐 有晚餐</span>
                                            <span v-if="sche.schRepast==3">有早餐 有午餐</span>
                                            <span v-if="sche.schRepast==6">有午餐 有晚餐</span>
                                            <span v-if="sche.schRepast==7">有早餐 有午餐 有晚餐</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <!-- <i></i> -->
                        </div>
                    </div>
                    <a href="javascript:;" id="price"  style="position: relative;top: 80px;"></a>
                </div>    
            </div>
            <!-- 价格说明 -->
            <div class="trip-price">
                <!-- <h1>价格说明</h1> -->
                <div>
                    <div>
                        <h4 class="title-line">价格包含</h4>
                        <p v-html="productDetails.feeincludes">{{productDetails.feeincludes}}</p>
                    </div>
                    <div>
                        <h4 class="title-line">价格不包含</h4>
                        <p v-html="productDetails.feenonincludes">{{productDetails.feenonincludes}}</p>
                    </div>
                    <a href="javascript:;" id="reservation"  style="position: relative;top: 80px;"></a>
                </div>
                
            </div>
            <!-- 预定须知 --> 
            <div class="trip-reservation">
                <!-- <h1>预定须知</h1> -->
                <div>
                    <div>
                        <h4 class="title-line">预定须知</h4>
                        <p v-html="productDetails.attention">{{productDetails.attention}}</p>
                    </div>
                    <a href="javascript:;" id="change"></a>
                </div>
                
            </div>
            <!-- 退改规则 -->
            <div class="trip-change">
                <!-- <h1>退改规则</h1> -->
                <div>
                    <div>
                        <h4 class="title-line">退改规则</h4>
                        <p v-html="productDetails.bactorule">{{productDetails.bactorule}}</p>
                    </div>
                    <a href="javascript:;" id="other"></a>
                </div>
                
            </div>
            <!-- 其他说明 -->
            <div class="trip-other">
                <!-- <h1>其他说明</h1> -->
                <div>
                    <div>
                        <h4 class="title-line">保险说明</h4>
                        <p v-html="productDetails.insurance">{{productDetails.insurance}}</p>
                    </div>
                    <div>
                        <h4 class="title-line">购物说明</h4>
                        <p v-html="productDetails.shopping">{{productDetails.shopping}}</p>
                    </div>
                    <div>
                        <h4 class="title-line">补充说明</h4>
                        <p v-html="productDetails.tips">{{productDetails.tips}}</p>
                    </div>
                    <a href="javascript:;" id="esp"></a>
                </div>
            </div>
        </div>
        <div class="details-bottom">
            <!-- <ul>
                <li>
                    <img src="../assets/images/collection.png" alt="">
                    <p>收藏</p>
                </li>
                <li>
                    <img src="../assets/images/service.png" alt="">
                    <p>客服</p>
                </li>
            </ul> -->
             <!-- :href="'#/group-selection/'+productDetails.id" -->
            <a @click="toGroupFun" href="javascript:;">立即预定</a>
        </div>
         <a :href="'http://'+domainRe+'/Module/Pro/PosterTransferInit.aspx?PicBindProductID='+PicBindProductID+'&openId='+openId" class="forward" v-if="tranShow==true">
            <img src="../assets/images/zhuanfa.png" alt="">
        </a>
        <service></service>
    </div>
</template>
<script>
import { getDetails,getTours,getPolicysList,getProductDepartures,getSdkConfig,visits,detailAuthorize,userInfo,amount } from '../services/index'
import Vue from 'vue'
import { PopupPicker,WechatPlugin } from 'vux'
import tools from '../common/tools'
import service from '../components/service'
import { Swiper } from 'vux'
Vue.use(WechatPlugin)
const wx = Vue.wechat;
export default {
    data(){
        return{
            departuresList:[],//出发地列表
            productDestination:[],//产品目的地列表
            productPrice:[],//产品价格
            scheduleList:[],//产品详情介绍数组
            trafficList:[],//参考航班列表
            productDetails:{},//产品详情
            departureCity:[],//出发城市
            departureNameList:[],//出发城市
            detailIndex:0,//说明导航区默认值
            searchBarFixed:false,//控制说明导航是否吸顶
            tourinfoList:[],//七个团期信息
            selectedDay:'',//选择的日期
            tourIndex:-1,//七个日期默认值
            productTags:[],//产品标签
            wxtitle:'',//微信分享标题
            wxsharesummary:'',//微信分享摘要
            wxpublicityimage:'',//微信分享图片
            tranShow:false,//是否有转发图片
            domainRe:'',//上个页面的域名
            PicBindProductID:'',
            openId:'',
            isDetailsTrip:true,//是否显示详细行程
            imageList: [],//轮播产品集合
            imgIndex:0,
            nowPrice:'',//现价
            oldPrice:'',//原价
        }
    },
    methods: {
        // 轮播
        onIndexChange (index) {
            this.imgIndex = index
        },
        //popup框显示
        onDepartureShow () {
        },
        //popup框隐藏
        onDepartureHide (type) {   
        },
        //popup框值改变
        onDepartureChange (val) {
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
         //详情页初始化
        detailsInit(){
            // 获取用户类型
            // console.log('www',window.location.search.split('=')[2]);
            // console.log('www',window.location.search);
            this.userType=tools.getLocalStorage('userType');
            // 保存产品id
            tools.setLocalStorage('proId',this.$route.params.id);
            // selectedDay
            // console.log(this.$route.params.siteId);
            console.log(window.location.hash,'sssssssssssssssssssss');
            if(tools.getSessionStorage('siteId')==null||tools.getSessionStorage('siteId')==undefined){
                tools.setSessionStorage('siteId',window.location.hash.split('/')[3]);
            }
            if(tools.getLocalStorage('orgId')==null||tools.getLocalStorage('orgId')==undefined){
                tools.setLocalStorage('orgId',window.location.hash.split('/')[4]);
            }
            // console.log(window.location);
            // this.state=window.location.search.split('=')[2];
            // console.log(this.state,'00000000000000000000000');
            // 分享后的授权验证
            if(tools.getSessionStorage('openId')!=null&&tools.getSessionStorage('openId')!="null"&&tools.getSessionStorage('openId')!=undefined){
                // 调取首页接口
                this.detailsApi();
            }
            else{
                if(window.location.search.indexOf('code')>0){
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
                                // 调取详情页接口
                                this.detailsApi();
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
                        // 调取详情页接口
                        this.detailsApi();
                    }
                }
                else{
                    let params = {
                        'url':window.location.href,
                    }
                    console.log(params);
                    detailAuthorize(params).then((response)=>{
                        console.log('结果',response);
                        parent.location.href=response;
                    }).catch((err)=>{
                        console.log('详情页授权接口异常',err);
                    });
                }
            }

            
            // console.log('day',tools.getLocalStorage('selectedDay'))
            // console.log('list',this.tourinfoList)
            
        },
        //详情页api
        detailsApi(){
            this.userType=tools.getLocalStorage('userType');
            if(window.location.href.indexOf('PicBindProductID')!=-1){
                this.tranShow=true;
                this.PicBindProductID=window.location.href.split('PicBindProductID=')[1].split('&')[0];
                this.openId=window.location.href.split('openId=')[1].split('&')[0];
                this.domainRe=window.location.href.split('url=')[1];
                console.log(this.PicBindProductID);
                console.log(this.openId);
                console.log(this.domainRe);
            }
            else{
                this.tranShow=false;
            }
             // 获取url中的id
            let params={
                'proid':this.$route.params.id,
                'siteid':this.$route.params.siteId,
                'isOutgoing':this.$route.params.state,
                'orgId':this.$route.params.orgid,
                // 'siteid':tools.getLocalStorage('siteId'),
            };
            // 获取详情接口绑定
            getDetails(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('产品详情数据获取成功');
                    // 产品目的地获取
                    this.productDestination=response.data.destination;
                    // 产品价格获取
                    if(this.userType==1){
                        this.productPrice=response.data.salesPrice;
                    }
                    else if(this.userType==2){
                         this.productPrice=response.data.directPrice;
                    }
                    // this.productPrice=response.data.price;
                     // 产品原价现价
                    this.nowPrice=response.data.newPrice.nowPrice;
                    this.oldPrice=response.data.newPrice.oldPrice;
                    // 产品行程介绍数组
                    this.scheduleList=response.data.scheduleList;
                    // 产品图片
                   
                    this.imageList=[];
                    this.imageList.push({
                        // 'id':'',
                        'img':response.data.product.coverimg,
                        // 'productid':''
                    })
                    for(let f=0;f<response.data.imageList.length;f++){
                        this.imageList.push({
                            'img':response.data.imageList[f].imagesrc
                        });
                    }
                    console.log(this.imageList,'this.imageListthis.imageListthis.imageList')
                    // 产品参考航班
                    this.trafficList=response.data.trafficList;
                    // 产品详情
                    this.productDetails=response.data.product;
                    this.wxpublicityimage=response.data.product.wxpublicityimage;
                    this.wxsharesummary=response.data.product.wxsharesummary;
                    this.wxtitle=response.data.product.wxtitle;
                    this.productTags=response.data.tags;
                    // 转换回车
                    if(this.scheduleList!=null){
                        for(let i=0;i<this.scheduleList.length;i++){
                            // console.log('old',this.scheduleList[i].schInfo);
                            // this.scheduleList[i].schInfo=this.Trim(this.scheduleList[i].schInfo);
                            this.scheduleList[i].schInfo=this.scheduleList[i].schInfo;
                            // console.log('new',this.scheduleList[i].schInfo);
                        }
                    }
                    let myDate = new Date();
                    let paramsVisits={
                        'projectType':2,
                        'createDate':myDate,
                        'orgId': tools.getLocalStorage('orgId'),
                        'orgName': response.data.product.travelname,
                        'loginStatus':1, 		//登录状态：0.未登录 1.登录
                        'userId':tools.getLocalStorage('userType')==1?tools.getSessionStorage('userId'):'', 			//用户ID
                        'userType':tools.getLocalStorage('userType'),
                        'userName':tools.getLocalStorage('userType')==1?tools.getSessionStorage('userName'):tools.getSessionStorage('nickname'),
                        'deptId': tools.getLocalStorage('userType')==1?tools.getSessionStorage('deptId'):'',			//部门ID B端
                        'deptName':tools.getLocalStorage('userType')==1?tools.getSessionStorage('deptName'):'', 			//部门名称 B端
                        'uOrgId': tools.getLocalStorage('userType')==1?tools.getSessionStorage('uOrgId'):'',			//用户旅行社ID B端 
                        'uOrgName':tools.getLocalStorage('userType')==1?tools.getSessionStorage('uOrgName'):'',			//用户旅行社名称 B端
                        'proId':response.data.product.id,			//产品ID
                        'proType': response.data.product.protype,			//产品类型
                        'proRouretType':response.data.product.procategory,		//产品线路类型
                        'aliaseName':response.data.product.aliasename,		//产品分销名（别名）
                        'localProName':response.data.product.localproname, 		//地接产品名称
                        'proNo': response.data.product.prono,				//产品编号
                        'tourDays':response.data.product.tourdays, 			//行程天数
                        'startDate':response.data.product.startdate, 		//有效开始日期
                        'dueDate':response.data.product.duedate, 			//有效截止日期
                        'departure':response.data.product.departure, 			//出发地
                        'destination':response.data.product.destination, 		//目的地
                        'proTag':response.data.product.protag, 			//产品标签
                        'isAck':response.data.product.isack, 
                        'salesType':response.data.product.salestype,	
                        'proProp':response.data.product.proprop,			//产品属性 1：打包产品；2：单项产品
                        'starLevel':response.data.product.starlevel, 			//产品星级，用于产品排序
                        'trafficType':response.data.product.traffictype, 
                        'routeSubType':response.data.product.routesubtype, 		//线路子类型
                        'routeSubTypeName':response.data.product.routesubtypename
                    }
                    visits(paramsVisits).then((response)=>{
                        console.log(response);
                        console.log('统计访问量接口请求成功');
                    }).catch((err)=>{
                        console.log('统计访问量接口异常',err);
                    });
                    let shareHref=window.location.href.split('?')[0]+'#'+window.location.href.split('#')[1];
                    // let shareHref=window.location.href.split('?')[0]+'#'+window.location.href.split('#')[1]+'?siteId='+tools.getLocalStorage('siteId');
                    // console.log('url222',window.location.href.split('?')[0]+'#'+window.location.href.split('#')[1]);
                    console.log('url222',shareHref);
                    wx.ready(()=> {
                        wx.onMenuShareAppMessage({
                            title: (this.wxtitle==null||this.wxtitle=='')?this.productDetails.travelname:this.wxtitle, // 分享标题
                            desc: (this.wxsharesummary==null||this.wxsharesummary=='')?this.productDetails.aliasename:this.wxsharesummary, // 分享描述
                            link: shareHref, // 分享链接
                            imgUrl: (this.wxpublicityimage==null||this.wxpublicityimage=='')?this.productDetails.coverimg:this.wxpublicityimage, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: ()=> {
                                // 用户确认分享后执行的回调函数
                                let paramsAmount={
                                    'createDate':myDate,
                                    'orgId': tools.getLocalStorage('orgId'),
                                    'orgName': response.data.product.travelname,
                                    // 'loginStatus':1, 		//登录状态：0.未登录 1.登录
                                    'userId':tools.getLocalStorage('userType')==1?tools.getSessionStorage('userId'):'', 			//用户ID
                                    'userType':tools.getLocalStorage('userType'),
                                    'userName':tools.getLocalStorage('userType')==1?tools.getSessionStorage('userName'):tools.getSessionStorage('nickname'),
                                    'deptId': tools.getLocalStorage('userType')==1?tools.getSessionStorage('deptId'):'',			//部门ID B端
                                    'deptName':tools.getLocalStorage('userType')==1?tools.getSessionStorage('deptName'):'', 			//部门名称 B端
                                    'uOrgId': tools.getLocalStorage('userType')==1?tools.getSessionStorage('uOrgId'):'',			//用户旅行社ID B端 
                                    'uOrgName':tools.getLocalStorage('userType')==1?tools.getSessionStorage('uOrgName'):'',			//用户旅行社名称 B端
                                    'pageType':1,
                                    'url':shareHref,
                                    'urlTitle':(this.wxtitle==null||this.wxtitle=='')?this.productDetails.travelname:this.wxtitle,
                                    'desc':(this.wxsharesummary==null||this.wxsharesummary=='')?this.productDetails.aliasename:this.wxsharesummary,
                                    'proId':response.data.product.id,			//产品ID
                                    'proType': response.data.product.protype,			//产品类型
                                    'proRouretType':response.data.product.procategory,		//产品线路类型
                                    'aliaseName':response.data.product.aliasename,		//产品分销名（别名）
                                    'localProName':response.data.product.localproname, 		//地接产品名称
                                    'proNo': response.data.product.prono,				//产品编号
                                    'tourDays':response.data.product.tourdays, 			//行程天数
                                    'startDate':response.data.product.startdate, 		//有效开始日期
                                    'dueDate':response.data.product.duedate, 			//有效截止日期
                                    'departure':response.data.product.departure, 			//出发地
                                    'destination':response.data.product.destination, 		//目的地
                                    'proTag':response.data.product.protag, 			//产品标签
                                    'isAck':response.data.product.isack, 
                                    'salesType':response.data.product.salestype,	
                                    'proProp':response.data.product.proprop,			//产品属性 1：打包产品；2：单项产品
                                    'starLevel':response.data.product.starlevel, 			//产品星级，用于产品排序
                                    'trafficType':response.data.product.traffictype, 
                                    'routeSubType':response.data.product.routesubtype, 		//线路子类型
                                    'routeSubTypeName':response.data.product.routesubtypename
                                }
                                amount(paramsAmount).then((response)=>{
                                    console.log(response);
                                    console.log('分享统计接口请求成功');
                                }).catch((err)=>{
                                    console.log('分享统计接口异常',err);
                                });
                            },
                            cancel: ()=> {
                                // alert('分享失败')
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareTimeline({
                            title: (this.wxtitle==null||this.wxtitle=='')?this.productDetails.travelname:this.wxtitle, // 分享标题
                            desc:  (this.wxsharesummary==null||this.wxsharesummary=='')?this.productDetails.aliasename:this.wxsharesummary, // 分享描述
                            link: shareHref,
                            imgUrl: (this.wxpublicityimage==null||this.wxpublicityimage=='')?this.productDetails.coverimg:this.wxpublicityimage, // 分享图标
                            success: function() {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function() {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                    });
                }
                else{
                    console.log('产品详情数据获取失败');
                }
            }).catch((err)=>{
                console.log('产品详情接口获取异常',err);
                // this.$Message.info('产品详情接口获取异常');
            });

            // 出发地接口绑定
            let paramsDeparture={
                'proid':this.$route.params.id,
                'siteid':this.$route.params.siteId,
            }
            getProductDepartures(paramsDeparture).then((response)=>{
                console.log(response);
                 this.departuresList=[];
                 this.departureCity='';
                //  this.departureCity=[];
                 this.departureNameList=[];
                if(response.meta.success==true){
                    console.log('出发地数据获取成功');
                    this.departuresList=response.data.departures;
                    // this.departureCity.push(response.data.departure.departure);
                    this.departureCity=tools.getLocalStorage('departure')?tools.getLocalStorage('departure'):response.data.departure.departure;
                    let deNameArr=[];
                    for(let i=0;i<this.departuresList.length;i++){
                        deNameArr.push(this.departuresList[i].departure);
                    }
                    this.departureNameList.push(deNameArr);
                    console.log(this.departureNameList);
                    // 把出发地id放入缓存
                    if(!tools.getLocalStorage('departureId')){
                        tools.setLocalStorage('departureId',response.data.departure.id);
                    }
                    // 把出发地放入缓存
                    if(!tools.getLocalStorage('departure')){
                        tools.setLocalStorage('departure',response.data.departure.departure);
                    }
                }
                else{
                    console.log('出发地数据获取失败');
                }
            }).catch((err)=>{
                console.log('出发地异常报错',err);
                // this.$Message.info('出发地接口获取异常');
            });

            // 团期接口绑定
            getTours(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('团期接口数据获取成功'); 
                    let tourDefault=response.data.tourinfoList;
                    for(let i=0;i<tourDefault.length;i++){
                         this.tourinfoList.push({
                             'directPrice':tourDefault[i].directPrice,
                             'salesPrice':tourDefault[i].salesPrice,
                             'id':tourDefault[i].id,
                             'dueDate':tourDefault[i].dueDate,
                             'tourDateCopy':tourDefault[i].tourDate.split('-')[1]+'/'+tourDefault[i].tourDate.split('-')[2],
                             'tourDate':tourDefault[i].tourDate
                         })
                    }
                    // 高亮团期
                    if(tools.getLocalStorage('selectedDay')){
                        for(let i=0;i<this.tourinfoList.length;i++){
                            if(this.tourinfoList[i].tourDate==tools.getLocalStorage('selectedDay')){
                                this.tourIndex=i;
                            }
                        }
                    } 
                    console.log('tourinfoList',this.tourinfoList);   
                }
                else{
                    console.log('团期接口数据获取失败');
                }
            }).catch((err)=>{
                console.log('团期接口获取异常',err);
                // this.$Message.info('团期接口获取异常');
            });
        },
        Trim(str) { 
            //str表示要转换的字符串  
            return str.replace(/\n|\r\n/g,"<br/>");
        },
        // 判断页面滚动高度
        handleScroll () {
            // 计算滚动高度
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            // console.log(scrollTop);
            // 计算说明导航距离顶部的高度
            let offsetTop = document.querySelector('#nav').offsetTop;
            // 产品特色区域距离顶部的高度
            let featureTop = document.querySelector('#features').offsetTop;
            // 行程介绍区域距离顶部的高度 
            let tripLineTop = document.querySelector('#trip-line').offsetTop-100;
            // 产品价格区域距离顶部的高度
            let priceTop = document.querySelector('#price').offsetTop-100;
            // 预定须知区域距离顶部的高度
            let reservationTop = document.querySelector('#reservation').offsetTop-100;
            // 退改规则区域距离顶部的高度
            let changeTop = document.querySelector('#change').offsetTop-100;
            // 其他说明区域距离顶部的高度
            let otherTop = document.querySelector('#other').offsetTop-100;
           
            // console.log('heightArr',heightArr);
            // let secondH=document.querySelector('#trip2').offsetHeight;
            // let threeH=document.querySelector('#trip3').offsetHeight;
            // let fourH=document.querySelector('#trip4').offsetHeight;
            // let fiveH=document.querySelector('#trip5').offsetHeight;
            // 说明导航定位判断
            if (scrollTop > offsetTop) {
                this.searchBarFixed = true;
            } else {
                this.searchBarFixed = false;
                this.detailIndex=0;
            }
            // 滚动联动
            if(scrollTop>featureTop&&scrollTop<tripLineTop){
                this.detailIndex=0;
            }
            else if(scrollTop>tripLineTop&&scrollTop<priceTop){
                this.detailIndex=1;
            }
            else if(scrollTop>priceTop&&scrollTop<reservationTop){
                this.detailIndex=2;
            }
            else if(scrollTop>reservationTop&&scrollTop<changeTop){
                this.detailIndex=3;
            }
            else if(scrollTop>changeTop&&scrollTop<otherTop){
                this.detailIndex=4;
            }
            else if(scrollTop>otherTop){
                this.detailIndex=5;
            }

            // 回顶部锚点
            if(scrollTop>2000){
                this.scrollShow=true;
            }
            else{
                this.scrollShow=false;
            }
             
        },
        //导航锚点定位
        tripAnchor(anchorName) {
            // 找到锚点
            let anchorElement = document.getElementById(anchorName);
            let y=anchorElement.offsetTop;
            while ((anchorElement = anchorElement.offsetParent)) {
                y += anchorElement.offsetTop;
            }
            y -= 100; /*悬浮菜单的高度*/
            window.scrollTo(0, y);
            // 如果对应id的锚点存在，就跳转到锚点
            // if(anchorElement) { anchorElement.scrollIntoView(); }

            // e = document.getElementById(e); /*以id命名的锚点*/
            // let y = e.offsetTop;
            // while ((e = e.offsetParent)) {
            //     y += e.offsetTop;
            // }
            // y -= 80; /*悬浮菜单的高度*/
            // window.scrollTo(0, y);
            // 给锚点加样式
            if(anchorName=="features"){
                this.detailIndex=0;
            }
            else if(anchorName=="trip-line"){
                this.detailIndex=1;
            }
            else if(anchorName=="price"){
                this.detailIndex=2;
            }
            else if(anchorName=="reservation"){
                this.detailIndex=3;
            }
            else if(anchorName=="change"){
                this.detailIndex=4;
            }
            else if(anchorName=="other"){
                this.detailIndex=5;
            }
            // alert(anchorName);
        },
        // 选择团期
        selectedTour(obj,index){
            console.log(obj);
            this.tourIndex=index;
            this.selectedDay=obj.tourDate;
            // 把选择的日期标记
            tools.setLocalStorage('tourIndex',this.tourIndex);
            //把选择人日期放入缓存
            tools.setLocalStorage('selectedDay',this.selectedDay);
            //把团期id放入缓存
            tools.setLocalStorage('tourid',obj.id);
            // 
            tools.setLocalStorage('isOutgoing',this.$route.params.state);
            tools.setLocalStorage('orgIdw',this.$route.params.orgid);
            //跳转到选择班期
            this.$router.push('/group-selection/'+this.productDetails.id);
        },
        // 去选择团期页面
        toGroupFun(){
            tools.setLocalStorage('isOutgoing',this.$route.params.state);
            tools.setLocalStorage('orgIdw',this.$route.params.orgid);
            //跳转到选择班期
            this.$router.push('/group-selection/'+this.productDetails.id);
        }
    },
    mounted(){
        window.addEventListener('scroll', this.handleScroll);
        this.detailsInit();
    },
    destroyed () {
        window.removeEventListener("scroll", this.handleScroll)
    },
    components: {
      PopupPicker,
      WechatPlugin,
      Swiper,
      service
    },
}
</script>

<style lang="scss" >
.details{
    padding-bottom: toRem(130px);
    background: #fff;
    .forward{
        position: fixed;
        top:toRem(230px);
        right: toRem(30px);
        z-index: 10000;
        >img{
          @include wh(toRem(77px),toRem(94px));  
        }
    }
    .margin-line{
        width:100%;
        height:toRem(20px);
	    background-color: #f8f8f8;
    }
    .num_list li{
        list-style:disc !important;
        display: block;
        &::before{
            content:'';
            display: inline-block;
            vertical-align: middle;
            @include wh(toRem(8px),toRem(8px));
            background: #333;
            border-radius: 50%;
        }
    }
    .trip-introduce-first{

    }
    .all-trip{
        *{
            font-size: toRem(27px) !important;
            color:#333 !important;
            font-weight: normal !important;
        }
    }
    .flight-tip{
        color:#999;
        margin: toRem(10px);
    }
    .trip-introduce-last{
        position: relative;
        // padding-left: toRem(25px);
        // >i{
        //     display: inline-block;
        //     @include wh(toRem(18px),toRem(18px));
        //     background: url('../assets/images/disc.png') no-repeat;
        //     background-size:100%;
        //     position: absolute;
        //     left:0;
        //     top:toRem(10px);
        // }
        .trip-plan{
            margin-top: toRem(40px);
            font-size: 0;
            .plan-day{
                // padding-bottom: toRem(5px);
                // border-bottom: toRem(1px) solid #626262;
                margin-bottom: toRem(44px);
                @include sc(toRem(50px),#333);
                >span{
                    display: inline-block;
                    vertical-align: top;
                    @include sc(toRem(28px),#333);
                    margin-left: toRem(25px);
                    max-width:toRem(580px) ;
                }
            }
            // >h2{
            //     @include sc(toRem(26px),$main-color);
            //     line-height: toRem(40px);
            // }
            .plan-main-con{
                border-left:toRem(1px) solid #e1e1e1;
                margin-left: toRem(44px);
                padding-left: toRem(55px);
                @include sc(toRem(28px),#333);
                position: relative;
                >i{
                    display: inline-block;
                    position: absolute;
                    left:toRem(-12px);
                    top:toRem(10px);
                    @include wh(toRem(22px),toRem(23px));
                    background: url('../assets/images/xingcheng.png') no-repeat;
                    background-size:100%;
                    vertical-align: middle;
                    margin-right: 5px;
                }
            }
            .plan-main{
                // margin: toRem(10px) 0;
                margin-bottom: toRem(15px);
                br{
                    line-height: 0 !important;
                }
            }
            .plan-main-images{
                margin-bottom: toRem(15px);
                >div{
                    display: inline-block;
                    width:48%;
                    margin-right: 2%;
                    vertical-align: top;
                    height: toRem(180px) !important;
                    margin-bottom: toRem(10px);
                    position: relative;
                    >img{
                        height:toRem(180px) !important;
                        width:100%;
                    }
                    >p{
                        position: absolute;
                        bottom: 0;
                        left:0;
                        width: 100%;
                        color:#fff !important;
                        font-size: toRem(17px) !important;
                        // @include sc(toRem(17px),#fff);
                        background: rgba(0, 0, 0, 0.42);
                        line-height: toRem(30px);
                        padding-left: toRem(10px);
                        box-sizing: border-box;
                        text-align: center;
                    }
                }
            }
            .plan-main-hotel{
                position: relative;
                margin-bottom: toRem(40px);
                >i{
                    display: inline-block;
                    position: absolute;
                    left:toRem(-65px);
                    top:toRem(10px);
                    @include wh(toRem(22px),toRem(23px));
                    background: url('../assets/images/jiudian.png') no-repeat;
                    background-size:100%;
                    vertical-align: middle;
                    margin-right: 5px;
                }
            }
            .plan-main-eat{
                >p{
                    position: relative;
                    >i{
                        position: absolute;
                        display: inline-block;
                        left:toRem(-65px);
                        top:toRem(10px);
                        @include wh(toRem(23px),toRem(23px));
                        background: url('../assets/images/yongcan.png') no-repeat;
                        background-size:100%;
                        vertical-align: middle;
                        margin-right: 5px;
                    }
                }
            }
        }
    }
    .details-header{
        padding-bottom: toRem(28px);
        >div{
            &:nth-child(1){
                width: toRem(750px);
                height: toRem(510px);
                position: relative;
                overflow: hidden;
                >p,>span{
                    position: absolute;
                    bottom: toRem(45px);
                    z-index: 10;
                    // height: toRem(46px);
                    // line-height: toRem(46px);
                    // border-radius: toRem(10px);
                    // background-image: $main-bg;
                    @include sc(toRem(24px),#fff);
                    // padding: 0 toRem(10px);
                }
                >p{
                    left:toRem(23px);
                }
                >span{
                    right:toRem(23px);
                }
                // >img{
                //     width: 100%;
                //     height: toRem(510px);
                //     // border-radius: 0px 0px toRem(10px) toRem(10px);
                // }
                .vux-slider{
                    width: 100%;
                    height: toRem(510px) !important;
                    .vux-swiper{
                        width: 100%;
                        height: toRem(510px) !important;
                    }
                    .vux-indicator-right{
                        display: none;
                    }
                }
                >i{
                    display: inline-block;
                    position: absolute;
                    bottom:0; 
                    z-index: 1;
                    width:100%;
                    height: toRem(90px);
                    background: url('../assets/images/sha.png') no-repeat;
                    background-size: 100%;
                    
                }
            }
            &:nth-child(2){
                width:100%;
                padding: toRem(25px) toRem(28px) 0 toRem(20px);
                box-sizing: border-box;
                margin-top: toRem(-30px);
                position: relative;
                z-index: 20;
                background: #fff;
                border-radius: toRem(30px) toRem(30px) 0 0;
                >h2{
                    @include sc(toRem(28px),#333);
                    line-height: toRem(42px);
                }
                >p{
                    >span{
                        &:nth-child(1){
                            @include sc(toRem(32px),#ffba00);
                            &:after{
                                content: '起/人';
                                @include sc(toRem(24px),#333);
                            }
                        }
                        &:nth-child(2){
                            margin-top: toRem(18px);
                            @include sc(toRem(20px),#7d7d7d);
                            margin-left: toRem(18px);
                            >i{
                                text-decoration: line-through;
                            }
                        }
                    }
                }
                >div{
                    font-size: 0;
                    margin-top: toRem(15px);
                    >a{
                        display: inline-block;
                        padding: 0 toRem(12px);
                        height: toRem(30px);
                        line-height: toRem(30px);
                        @include sc(toRem(20px),#fff);
                        background-image: $main-bg;
                        border-radius: toRem(4px);
                        margin-right: toRem(20px);
                        &:last-child{
                            margin-right: 0;
                        }
                    }
                }
            }
        }
    }
    .detials-select-con{
        font-size: 0;
        padding: toRem(60px) toRem(30px) toRem(30px) toRem(30px);
    }
    .detials-select-city{
         position: relative;
        // >span{
        //    @include sc(toRem(24px),#18191a);
        // }
        >label{
            @include sc(toRem(24px),#18191a);
        }
        >a{
           @include sc(toRem(18px),#5381eb); 
           margin-left: toRem(10px);
           position: absolute;
           z-index: 0;
           left:toRem(90px);
           top:toRem(3px);
           display: inline-block;
        }
        .vux-cell-box{
            -webkit-tap-highlight-color:rgba(255,0,0,0);
            display: inline-block;
            width:toRem(200px);
            z-index: 2;
            .vux-popup-picker-select{
                text-align: left !important;
            }
            .vux-popup-picker-value{
                @include sc(toRem(24px),#18191a);
            }
            .weui-cell__ft{
                display: none;
            }
            .weui-cell{
                padding: 0 !important;
            }
        }
    }
    .detials-select-tour{
        margin-top: toRem(17px);
        >a{
            display: inline-block;
            vertical-align: top;
            border-radius: toRem(10px);
            border: solid toRem(2px) #dddddd;
            width:toRem(151px);
            height: toRem(60px);
            text-align: center;
            margin-right: toRem(17px);
            margin-bottom: toRem(19px);
            // box-sizing: border-box;
            -webkit-tap-highlight-color:rgba(255,0,0,0);
            &:nth-child(4){
                margin-right:0;
            }
            >h3{
                @include sc(toRem(24px),#18191a);
                font-weight: normal;
                line-height: toRem(24px);
                padding-top: toRem(8px);
            }
            >p{
                @include sc(toRem(18px),#999);
            }
            &.active{
                border:none;
                background: $main-bg;
                height: toRem(62px);
                >h3,>p{
                    color:#fff;
                }
            }
        }
        .more{
            @include sc(toRem(20px),#5381eb); 
            line-height: toRem(60px);
            display: inline-block;
            vertical-align: top;
            width:toRem(151px);
            margin-right:0;
            // >i{
            //     display: inline-block;
            //     vertical-align: middle;
            //     width:toRem(10px);
            //     height: toRem(19px);
            //     background: url('../assets/images/more.png') no-repeat;
            //     background-size: 100%;
            //     margin-left: toRem(10px);
            // }
        }
    }
    .trip-info{
        .trip-info-nav{
            padding-left: toRem(30px);
            width:auto;
            overflow-x: scroll !important;
            white-space: nowrap;
            padding-top: toRem(40px);
            padding-bottom: toRem(2px);
            font-size: 0;
            &::-webkit-scrollbar {display:none}
            >ul{
                width:125%;
                >li{
                    display: inline-block;
                    vertical-align: top;
                    margin-right: toRem(65px);
                    text-align: center;
                    -webkit-tap-highlight-color:rgba(255,0,0,0);
                    >p{
                        @include sc(toRem(24px),#18191a); 
                        margin-bottom: toRem(10px); 
                    }
                    >span{
                        display: inline-block;
                        width: toRem(110px);
                        height: toRem(2px);
                        border-radius: toRem(1px);
                        background-color:#5381eb;
                    }
                    &.active{
                        color:#5381eb;
                    }
                    &:last-child{
                        margin-right:toRem(10px);
                    }
                }
            }
            &.isFixed{
                position: fixed;
                background-color:#fff;
                top:0;
                z-index:1000;
                box-shadow:0 2px 5px rgba(0, 0, 0, .1);
                width:auto;
                overflow-x: scroll !important;
                // white-space: nowrap;
            }
        }
        .trip-features{
            border-top:1px solid #e1e1e1;
        }
        .trip-features,.trip-introduce,.trip-price,.trip-reservation,.trip-change,.trip-other{
            font-size: toRem(28px) !important;
            padding: 0 toRem(30px);
            white-space:normal; 
            word-break:break-all;
            max-width: 100%;
            overflow: hidden;
            *{
                font-weight: normal !important;
                color:#333 !important;
                font-size: toRem(27px) !important;
            }
            table{
                width: 100% !important;
                font-weight: normal !important;
            }
            .title-line{
                @include sc(toRem(30px),#5381eb);
                margin:toRem(60px) 0 toRem(40px) 0;
                &::before{
                    content:'';
                    display: inline-block;
                    @include wh(toRem(8px),toRem(21px));
                    background-image: $main-bg;
                    margin-right: toRem(20px);
                }
            }
            img{
                max-width:100% !important;
                height: auto !important;
            }
        }
        .trip-introduce{
            position: relative;
            .trip-icon{
                position: absolute;
                right: toRem(22px);
                top:toRem(70px);
                @include wh(toRem(74px),toRem(74px));
            }
        }
        .fly-line{
            >img{
                @include wh(toRem(45px),toRem(39px));
                display: inline-block;
                vertical-align: bottom;
                margin-right: toRem(7px);
            }
            @include sc(toRem(24px),#29abe2);
            font-weight: bold;
        }
        .trip-line{
            // padding: toRem(35px) 0 toRem(40px);
            border-bottom:dotted 1px #a0a0a0;
            padding-bottom: toRem(40px);
            margin-bottom: toRem(28px);
            font-size:0 !important;
            &:last-child{
                border-bottom:none;
                padding-bottom: 0;
            }
            >p{
                @include sc(toRem(28px),#333);  
                line-height: toRem(28px);
                margin-bottom: toRem(39px);
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
                    @include sc(toRem(19px),#333);
                    text-align: center;
                }
                >h1{
                    @include sc(toRem(36px),#18191a);
                    line-height: toRem(36px);
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
    }
    .details-bottom{
        border-top: solid 1px #e1e1e1;
        position: fixed;
        bottom: 0;
        width:100vw;
        // width:toRem(706px);
        height: toRem(98px);
        // left:toRem(22px);
        // box-shadow: 0px toRem(2px) toRem(16px) 0px rgba(0, 0, 0, 0.5);
	    // border-radius: toRem(50px);
        z-index:100;
        background: #fff;
        >ul{
            display: inline-block;
            padding-left: toRem(7px);
            >li{
                float: left;
                text-align: center;
                margin-left: toRem(59px);
                font-size:0;
                padding-top: toRem(30px);
                >img{
                    display: inline-block;
                }
                // >p{
                //     @include sc(toRem(20px),#666);
                //     margin-top: toRem(10px);
                // }
                &:nth-child(1){
                    >img{
                        width:toRem(35px);
                        height: toRem(34px);
                    }
                }
                &:nth-child(2){
                    >img{
                        width:toRem(36px);
                        height: toRem(30px);    
                    }
                }
            }
        }
        >a{
            // width:toRem(440px);
            width: 100%;
            height: toRem(99px);
            float: right;
            background-image: $main-bg;
	        // border-radius: 0px toRem(50px) toRem(50px) 0px;
            text-align: center;
            @include sc(toRem(36px),#fff);
            line-height: toRem(98px);
        }
    }
}
</style>

