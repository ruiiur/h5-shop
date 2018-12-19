<!--这是首页页面-->
<template>
  <div class="home">
    <div class="home-header">
      <i class="back" @click="back"></i>
      <div class="home-search" @click="toSearch()">
        <i></i>
        <span>搜索本店产品</span>
      </div>
      <div class="all-site">
        <popup-picker :data="siteNameList" v-model="siteName" @on-show="onSiteShow" @on-hide="onSiteHide" @on-change="onSiteChange" ></popup-picker>
        <i :class="siteShow==true?'active':''"></i>
      </div>
    </div>
    <div class="home-logo">
      <img v-if="logoObj.logo!=''&& logoObj.logo!=null && logoObj.logo!='undefined'" :src="logoObj.logo" alt="">
      <img v-else="logoObj.logo==''|| logoObj.logo==null || logoObj.logo=='undefined'" src="../assets/images/de-logo.png" alt="">
      <span>{{logoObj.travelAgencyName}}</span>
      <a :href="'http://h5.'+setUrl+'//Check.aspx?uid='+userId" v-if="userType==1">返回ERP</a>
      <div class="square" @click="toSearchStore()">
        <img src="../assets/images/square.png" alt="">
        <p>搜索</p>
      </div>
    </div>
    <div class="home-banner">
      <swiper :list="listBanner" v-model="bannerIndex" @on-index-change="bannerIndexChange"></swiper>
    </div>
    <div class="route-type">
      <div class="travel-type">
        <a href="javascript:;" @click="travelTypeFun(index)" v-for="(item,index) in productType" :class="productType.length==3?'esp':''" >
          <!-- <img :src="i.image" alt="" v-for="(i,ind) in productTypeImages" v-if="index==ind"> -->
          <img :src="item.iconUrl" alt="">
          <p>{{item.proType}}</p>
        </a>
        <a href="#/custom-first">
          <img src="../assets/images/dingzhiyou.png" alt="">
          <p>定制游</p>
        </a>
         <a href="javascript:;" @click="salesFun">
          <img src="../assets/images/tajiaweidan.png" alt="">
          <p>特价促销</p>
        </a>
         <a href="javascript:;">
          <img src="../assets/images/lvyoutechan.png" alt="">
          <p>旅游特产</p>
        </a>
      </div>
      <ul class="travel-destination">
        <li v-for="(item,index) in routeTypeList" @click="routeIndex=index">
          <span>{{item.omRouteType.routetype}}</span>
          <img :src="i.image" alt="" v-for="(i,ind) in destinationTypeImages" v-if="index==ind">
          <p>
            <i v-if="index==routeIndex"></i>
          </p>
        </li>
      </ul>
      <div class="travel-destination-list" v-for="(item,index) in routeTypeList" v-if="index==routeIndex">
        <a v-for="(route,_index) in item.omDestinations" v-if="_index<3" @click="routeFun(item,_index,index)">{{route.destname}}</a>
        <a href="javascript:;" class="des-more" @click="moreFun(index)">查看更多</a>
      </div>
    </div>
    <div class="home-product" v-if="destinationProduct.length!=0">
      <h2>热门推荐</h2>
      <div>
        <!-- <img src="../assets/images/win.png" alt="" v-if="destinationAddress.length!=0"> -->
        <a href="javascript:;" v-for="addIndex in destinationAddress.length" v-if="addIndex<5"  @click="chooseAddress(addIndex)" :class="addressIndex==addIndex?'active':''">
          <span>{{destinationAddress[addIndex-1]}}</span>
          <i v-if="addressIndex==addIndex"></i>
        </a>
      </div>
      <ul class="home-product-list"  v-for="(productList,index) in destinationProduct"  v-if="addressIndex==index+1&&productList.length!=0">
        <li  v-for="(product,index) in productList" >
          <a :href="'#/details/'+product.id+'/'+siteId+'/'+product.orgId+'/'+product.isOutgoing">
            <div class="hot-images">
              <!-- <img :src="product.coverImg" alt=""> -->
              <img v-if="product.coverImg!=''&&product.coverImg!=null&& product.coverImg!='undefined'" :src="product.coverImg" alt="">
              <img v-else="product.coverImg==''||product.coverImg==null || product.coverImg=='undefined'" src="../assets/images/de-url.png" alt="">
              <!-- <i v-if="product.isAck==1" class="direct-sell"></i>
              <i v-if="product.isAck==0" class="second-sell"></i> -->
            </div>
            <div class="hot-details">
              <h2 style="-webkit-box-orient: vertical;">{{product.aliaseName}}</h2>
              <div class="list-tags">
                <p v-if="product.tags!=null"><span v-for="tag in product.tags.length" v-if="tag==1">{{product.tags[tag-1]}}</span><i v-if="product.tags.length>1">...</i></p>
              </div>
              <div class="sale-price">
                <p v-if="userType==1">￥{{product.salesPrice}}</p>
                <p v-if="userType==2">￥{{product.directPrice}}</p>
                <span v-if="userType==1">返<i>{{product.rebatePrice}}</i></span>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <div class="days-travel">
      <h2>出游天数</h2>
      <div class="days-con">
        <ul class="days-type">
          <!-- dayIndex=index -->
          <li v-for="(day,index) in dayType" :class="day.isShown==0?'esp':(dayIndex==index?'active':'')" @click="daySwitch(day,index)">{{day.days}}</li>
        </ul>
        <div v-for="(day,index) in dayType" class="days-city" v-if="index==dayIndex">
          <a href="javascript:;" v-for="city in day.destList.length" v-if="city<numDay" @click="toSearchCity(day.destList[city-1])">{{day.destList[city-1]}}</a>
          <a href="javascript:;" @click="toSearchDay()" v-if="day.destList.length!=0">全部</a>
          <a href="javascript:;" v-if="day.destList.length>7&&numDay<day.destList.length" @click="numDay=day.destList.length+1">更多</a>
          <a href="javascript:;" v-if="day.destList.length>7&&numDay>day.destList.length" @click="numDay=7">收起</a>
          <!-- <a href="javascript:;" v-if="day.destList.length>6">更多</a> -->
        </div>
      </div>
    </div>
    <div class="guess-list">
      <h2>猜你喜欢</h2>
      <ul class="guess-list-con" >
        <li v-for="(product,index) in productLikeList" >
          <a :href="'#/details/'+product.id+'/'+siteId+'/'+product.orgId+'/'+product.isOutgoing">
            <div class="image-con">
              <!-- <img :src="product.coverImg" alt=""> -->
              <img v-if="product.coverImg!=''&&product.coverImg!=null && product.coverImg!='undefined'" :src="product.coverImg" alt="">
              <img class="img-esp" v-else="product.coverImg==''||product.coverImg==null || product.coverImg=='undefined'" src="../assets/images/de-url.png" alt="">
              <!-- <i v-if="product.isAck==1" class="direct-sell"></i>
              <i v-if="product.isAck==0" class="second-sell"></i>
              <span>已售564</span> -->
            </div>
            <div class="product-intro">
              <h2 style="width: 100%; -webkit-box-orient: vertical;">{{product.aliaseName}}</h2>
              <div class="list-tags">
                <p v-if="product.tags!=null"><span v-for="tag in product.tags.length" v-if="tag<3">{{product.tags[tag-1]}}</span><i v-if="product.tags.length>2">...</i></p>
              </div>
              <p v-if="product.tours.length!=0">班期：<span v-for="index in product.tours.length" v-if="index<4">{{product.tours[index-1]}}<i v-if="index!=3">、</i></span>...</p>
              <div class="sale-price">
                <p><span class="sale" v-if="userType==1">￥{{product.salesPrice}}</span><span class="sale" v-if="userType==2">￥{{product.directPrice}}</span><span v-if="userType==1">返:<i>{{product.rebatePrice}}</i></span></p>
              </div>
            </div>
          </a>
        </li>
      </ul>
      <p v-if="productLikeList.length!=0">{{noData}}</p>
      <p v-if="withoutLike">暂无数据</p>
    </div>
    <a href="#/coupon" v-if="userType==1" class="get-coupon">
      <img src="../assets/images/lingquan.png" alt="">
    </a>
    <footerView :footerObject="footerObject"></footerView>
    <service></service>
  </div>
</template>
<script>
  // import VueScroller from 'vue-scroller'
  // import BScroll from 'better-scroll'
  import {getSite,getAllSite,newProductlist,getDestination,getProductType,getProductByDest,newProductAndDest,getRecommendPro,getLogo,userInfo,authorize,getDestinationByTourDays} from '../services/index'
  import footerView from '../components/footer'
  import service from '../components/service'
  import Vue from 'vue'
  import tools from '../common/tools'
  import { PopupPicker,Swiper } from 'vux'
  import { SIGHUP } from 'constants';
  const baseList = [{
    url: 'javascript:',
    img: require('../assets/images/banner.png'),
  }, {
    url: 'javascript:',
    img: require('../assets/images/banner.png'),
  }, {
    url: 'javascript:',
    img: require('../assets/images/banner.png'),
  }]
  export default {
    data(){
      return{
        phone:18856152571,
        footerObject:'',//传给footerView组件的值
        addressIndex:1,//首页产品地区列表默认值
        routeIndex:0,//默认显示的线路目的地
        siteShow:false,//选择站点区域显隐
        siteId:'',//站点
        siteList:[],//站点列表
        routeTypeList:[],//线路目的地列表
        productType:[],//产品类型列表
        destinationTypeImages:[
          {
            image:require('../assets/images/type5.png'),
          },
          {
            image:require('../assets/images/type6.png'),
          },
          {
            image:require('../assets/images/type7.png'),
          },
        ],//线路目的地icon
        siteName:[],//站点初始值
        siteNameList:[],//所有站点名称
        destinationProduct:[],//目的地产品
        destinationAddress:[],//目的地产品
        userType:'',//用户类型
        orgId:[],//商铺orgId
        orgIdString:'',
        productLikeList:[],//猜你喜欢产品
        logoObj:'',//首页logo
        page:0,
        totalNum:'',//总订单
        noData:'',
        listBanner:baseList,//轮播图
        bannerIndex:0,
        withoutLike:false,
        userId:'',
        setUrl:'',//不同环境的域名
        dayType:[],//根据天数查目的地
        dayIndex:0,//默认显示对应天数的出发地
        numDay:7,//默认显示条数
        dayText:'',//天数
      }
    },
    methods: {
      // 选择全部
      toSearchDay(){
        tools.setLocalStorage('keyWord','');
        tools.setLocalStorage('tourDayScope',this.dayText);
        this.$router.push('/search-list');
      },
      // 选择城市
      toSearchCity(obj){
        tools.setLocalStorage('keyWord',obj);
        tools.setLocalStorage('tourDayScope','');
        this.$router.push('/search-list');
      },
      // 从跟团游跳转
      travelTypeFun(index){
        tools.setLocalStorage('keyWord','');
        this.$router.push('/classification/'+index);
      },
      // 特价促销
      salesFun(){
        tools.setLocalStorage('saleIndex',0);
        this.$router.push('/classification/-1');
      },
      //返回
      back(){
        this.$router.go(-1);//返回上一层
      },
      // 轮播图
      bannerIndexChange (index) {
        this.bannerIndex = index;
      },
      //popup框显示
      onSiteShow () {
        this.siteShow=!this.siteShow;
      },
      //popup框隐藏
      onSiteHide (type) {
        // console.log('on hide', type);
        this.siteShow=!this.siteShow;
      },
      //popup框值改变
      onSiteChange (val) {
        console.log('val change', val);
        console.log('siteList',this.siteList);
        console.log('siteNameList',this.siteNameList);
        this.routeIndex=0;
        for(let i=0;i<this.siteList.length;i++){
          if(val==this.siteList[i].sitename){
            tools.setSessionStorage('siteName',this.siteList[i].sitename);
            tools.setSessionStorage('siteId',this.siteList[i].id);
            this.siteId=this.siteList[i].id;
            this.productLikeList=[];
            this.callBackInit();
          }
        }
      },
      // 到搜索页
      toSearch(){
        this.$router.push('/search/1');
      },
      // 选择目的地产品
      chooseAddress(addIndex){
        this.addressIndex=addIndex;
        console.log(this.addressIndex);
      },
      // 首页初始化
      homeInit(){
        this.setUrl= window.location.href.split('//')[1].split('/')[0].split('.')[1]+'.'+window.location.href.split('//')[1].split('/')[0].split('.')[2];;
        // 为了防止选择团期显示价格策略时日期与团期不对应，清楚日期和团期
        tools.setLocalStorage('selectedDay','');
        tools.setLocalStorage('tourid','');
        tools.setLocalStorage('marketType',-1);
        // 验证
        console.log(window.location.hash);
        console.log(window.location.search);
        this.orgId=[];
        // 存orgId
        // console.log(window.location.hash);
        tools.setLocalStorage('orgId',window.location.hash.split('=')[1]);
        console.log('orgId',tools.getLocalStorage('orgId'));
        this.orgIdString=tools.getLocalStorage('orgId');
        this.orgId.push(window.location.hash.split('=')[1]);
        this.userId=tools.getSessionStorage('userId');
        console.log('',this.orgId);
        console.log("cookie",tools.getSessionStorage('openId'));
        console.log(tools.getSessionStorage('openId')!=null);
        console.log(typeof tools.getSessionStorage('openId'));
        // alert(tools.getSessionStorage('openId'));
        if(tools.getSessionStorage('openId')!=null&&tools.getSessionStorage('openId')!="null"&&tools.getSessionStorage('openId')!=undefined){
          // 调取首页接口
          this.homeApi();
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
                  tools.setSessionStorage('userId',response.data.userId);
                  // 调取首页接口
                  this.homeApi();
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
              this.homeApi();
            }
          }
          else{
            let params = {
              'orgId':this.orgIdString,
            }
            console.log(params);
            authorize(params).then((response)=>{
              console.log('结果',response);
              parent.location.href=response;
            }).catch((err)=>{
              console.log('直客用户授权接口异常',err);
              // this.$Message.info('直客用户授权接口异常');
            });
          }
        }
      },
      // 切换日期
      daySwitch(obj,index){
        console.log(obj,'objobj');
        this.dayText=obj.days;
        if(obj.isShown!=0){
          this.dayIndex=index;
        }
      },
      // 首页调接口
      homeApi(){
        this.userType=tools.getLocalStorage('userType');
        // 获取站点接口
        // 初始化站点名
        if(tools.getSessionStorage('siteName')){
          this.siteName.push(tools.getSessionStorage('siteName'));
          // 初始化站点id
          if(tools.getSessionStorage('siteId')){
            this.siteId=tools.getSessionStorage('siteId');
          }
          this.callBackInit();
        }
        else{
          let params={
						'orgId':this.orgIdString
					}
          getSite(params).then((response)=>{
            console.log(response);
            if(response.meta.success==true){
              console.log('站点数据获取成功');
              // this.siteList=response.data;
              this.siteName.push(response.data.siteName);
              tools.setSessionStorage('siteName',response.data.siteName);
              tools.setSessionStorage('siteId',response.data.siteID);
              this.siteId=response.data.siteID;
              this.callBackInit();
            }
            else{
              console.log('站点数据获取失败');
            }
          }).catch((err)=>{
            console.log('站点接口获取异常',err);
            // this.$Message.info('站点接口获取异常');
          });
        }

        // 获取所有站点
        let paramsOrg=this.orgIdString;
        getAllSite(paramsOrg).then((response)=>{
          console.log(response);
          if(response.meta.success==true){
            console.log('所有站点数据获取成功');
            this.siteList=response.data;
            let allName=[];
            this.siteNameList=[];
            for(let i=0;i<this.siteList.length;i++){
              allName.push(this.siteList[i].sitename);
            }
            this.siteNameList.push(allName);
          }
          else{
            console.log('所有站点数据获取失败');
          }
        }).catch((err)=>{
          console.log('所有站点接口获取异常',err);
          // this.$Message.info('站点接口获取异常');
        });

        // 产品类型接口
        getProductType().then((response)=>{
          console.log(response);
          if(response.meta.success==true){
            console.log('产品类型数据获取成功');
            this.productType=response.data;
          }
          else{
            console.log('产品类型数据获取失败');
          }
        }).catch((err)=>{
          console.log('产品类型接口获取异常',err);
          // this.$Message.info('产品类型接口获取异常');
        });

        // 获取logo
        let paramsLogo=this.orgIdString;
        getLogo(paramsLogo).then((response)=>{
          console.log(response);
          if(response.meta.success==true){
            console.log('首页logo获取成功');
            if(response.data!=null){
              this.logoObj=response.data;
              tools.setSessionStorage('logo',response.data.logo);
              tools.setSessionStorage('travelAgencyName',response.data.travelAgencyName);
            }
          }
          else{
            console.log('首页logo获取失败');
          }
        }).catch((err)=>{
          console.log('首页logo获取异常',err);
        });

        //根据出行天数查询目的地
        let paramsDay={
          // 'orgId':'D2FB3DB0-AFFD-46C6-AE75-EBFDAF27F567'
          'orgId':this.orgIdString
        }
        getDestinationByTourDays(paramsDay).then((response)=>{
          console.log(response);
          if(response.meta.success==true){
            console.log('根据出行天数查询目的地');
            if(response.data!=null){
              this.dayType=response.data;
              this.dayText=response.data[0].days;
            }
          }
          else{
            console.log('根据出行天数查询目的地失败');
          }
        }).catch((err)=>{
          console.log('根据出行天数查询目的地异常',err);
        });
      },
      // 获取站点值之后调用的一些接口
      callBackInit(){
        //线路目的地接口绑定
        let params=this.siteId;
        getDestination(params).then((response)=>{
          console.log(response);
          if(response.meta.success==true){
            console.log('线路目的地数据获取成功');
            // this.siteList=response.data;
            this.routeTypeList=response.data;
            for(let i=0;i<this.routeTypeList.length;i++){
              this.$set(this.routeTypeList[i], 'indexCity', -1);
            }
          }
          else{
            console.log('线路目的地数据获取失败');
          }
        }).catch((err)=>{
          console.log('线路目的地接口获取异常',err);
          // this.$Message.info('线路目的地接口获取异常');
        });

        // 目的地产品
        let paramsProduct={
          'siteId':this.siteId,
          'orgId':this.orgIdString
        }
        // getProductByDest(paramsProduct).then((response)=>{
        newProductAndDest(paramsProduct).then((response)=>{
          console.log(response);
          this.destinationProduct=[];
          this.destinationAddress=[];
          if(response.meta.success==true){
            console.log('目的地产品数据获取成功');
            for(let i=0;i<response.data.length;i++){
              this.destinationProduct.push(response.data[i].productList);
              this.destinationAddress.push(response.data[i].destination);
            }
            console.log( this.destinationAddress);
            console.log( this.destinationProduct);
          }
          else{
            console.log('目的地产品数据获取失败');
          }
        }).catch((err)=>{
          console.log('目的地产品接口获取异常',err);
          // this.$Message.info('目的地产品接口获取异常');
        });
        this.likeProductFun(0);
      },
      likeProductFun(page){
        // this.productLikeList=[];
        // 猜你喜欢产品
        let paramsLikeProduct={
          'siteId':this.siteId,
          'orgId':this.orgIdString,
          'start':page,
          'size':10
        }
        // getRecommendPro(paramsLikeProduct).then((response)=>{
        newProductlist(paramsLikeProduct).then((response)=>{
          console.log(response);
          if(response.meta.success==true){
            console.log('猜你喜欢数据获取成功');
            this.totalNum=response.code;
            if(response.data.length!=0){
              for(let i=0;i<response.data.length;i++){
                if(response.data[i].tours!=null){
                  response.data[i].tours=response.data[i].tours.split(',');
                }
                else{
                  response.data[i].tours=[];
                }
                this.productLikeList.push(response.data[i]);
              }
              this.withoutLike=false;
            }
            else{
              this.withoutLike=true;
            }
          }
          else{
            console.log('猜你喜欢数据获取失败');
          }
        }).catch((err)=>{
          console.log('猜你喜欢接口获取异常',err);
          // this.$Message.info('猜你喜欢接口获取异常');
        });
      },
      //选择目的地跳转到列表页
      routeFun(item,_index,index){
        item.indexCity=_index;
        // 存线路类型的下标
        tools.setLocalStorage('destinationIndex',index);
        tools.setLocalStorage('keyWord','');
        // 把选中的目的地信息存放在localstorage中
        tools.setLocalStorage('destinations',JSON.stringify(item.omDestinations[_index]));
        this.$router.push('/classification/-1');
      },

      // 从更多跳到分类页
      moreFun(index){
        tools.setLocalStorage('destinationIndex',index);
        tools.setLocalStorage('keyWord','');
        // 把选中的目的地信息存放在localstorage中
        // console.log(this.routeTypeList[this.routeIndex]);
        tools.setLocalStorage('routeTypeId',this.routeTypeList[this.routeIndex].omRouteType.id);
        this.$router.push('/classification/-1');
      },
      // 去搜索店铺页
      toSearchStore(){
        this.$router.push('/search-store');
      },
    },
    created(){
      this.homeInit();
      window.onscroll=()=>{
        let clientHeight = document.documentElement.clientHeight;
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        let scrollHeight = document.body.scrollHeight;
        if(scrollTop + clientHeight == scrollHeight){
          this.page++;
          if(this.page>=this.totalNum/10){
            this.noData = "没有更多数据啦";
          }
          else{
            this.likeProductFun(this.page);
          }
        }
      }
    },
    components: {
      footerView,
      PopupPicker,
      Swiper,
      service
    },
  }
</script>

<style lang="scss">
  .home{
    padding-bottom: toRem(98px);
    background: #fff;
    .home-header{
      position: fixed;
      background-image: linear-gradient(69deg, #5b8cfe 0%, #73aafc 100%), linear-gradient(#333333, #333333);
      top:0;
      width:100%;
      height: toRem(80px);
      z-index: 1000;
      padding-top: toRem(13px);
      box-sizing: border-box;
      .back{
        display: inline-block;
        vertical-align: top;
        margin-top: toRem(5px);
        @include wh(toRem(40px),toRem(40px));
        background: url('../assets/images/back-home.png') no-repeat center;
        background-size:toRem(14px) toRem(24px);
      }
      .home-search{
        display: inline-block;
        background: #fff;
        width:toRem(520px);
        height: toRem(54px);
        border-radius: toRem(6px);
        position: relative;
        >i{
          position: absolute;
          display: inline-block;
          @include wh(toRem(26px),toRem(26px));
          background: url("../assets/images/home-search.png") no-repeat;
          background-size: 100%;
          top:toRem(16px);
          left:toRem(45px);
        }
        >span{
          position: absolute;
          @include sc(toRem(24px),#7d7d7d);
          top:toRem(10px);
          left:toRem(199px);
        }
      }
      .all-site{
        -webkit-tap-highlight-color:rgba(255,0,0,0);
        display: inline-block;
        vertical-align: top;
        font-size: 0;
        text-align: right;
        margin-top: toRem(5px);
        margin-left: toRem(8px);
        .weui-cell{
          padding: 0;
          font-size: 0;
          display: inline-block !important;
        }
        .vux-cell-box{
          display: inline-block;
          vertical-align: middle;
          font-size: 0;
          .weui-cell__ft:after{
            display: none;
          }
        }
        .vux-popup-picker-value{
          font-size: toRem(28px) !important;
          margin-right: toRem(10px);
          color:#fff;
        }
        >i{
          display: inline-block;
          vertical-align: middle;
          width:toRem(21px);
          height: toRem(13px);
          background: url("../assets/images/site-down.png") no-repeat;
          background-size: 100%;
          &.active{
            background: url("../assets/images/site-up.png") no-repeat;
            background-size: 100%;
          }
        }
      }
    }
    .home-logo{
      font-size: 0;
      padding: toRem(20px);
      >img{
        display: inline-block;
        vertical-align: middle;
        width:toRem(182px);
        max-height: toRem(84px);
        min-height: toRem(60px);
      }
      >a{
        @include sc(toRem(28px),$main-color);
        display: inline-block;
        vertical-align: middle;
        margin-right: toRem(10px);
      }
      >span{
        display: inline-block;
        vertical-align: middle;
        @include sc(toRem(28px),#333);
        margin-left: toRem(35px);
        width:toRem(305px);
        max-width:toRem(305px);
      }
      .square{
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        font-size: 0;
        float: right;
        >img{
          @include wh(toRem(32px),toRem(31px));
        }
        >p{
          @include sc(toRem(28px),$main-color);
        }
      }
    }
    .home-banner{
      padding: 0 toRem(20px);
      .vux-slider{
        border-radius: toRem(6px);
        height: toRem(220px);
        .vux-img{
          height: toRem(220px) !important;
        }
      }
    }
    .route-type{
      // box-shadow: 0px toRem(4px) toRem(20px) 0px rgba(0, 0, 0, 0.1);
      // border-radius: toRem(20px) toRem(20px) 0px 0px;
      padding-top: toRem(40px);
      .travel-type{
        font-size: 0;
        padding-bottom: toRem(30px);
        border-bottom: 1px solid #e1e1e1;
        >a{
          display: inline-block;
          width:20%;
          text-align: center;
          -webkit-tap-highlight-color:rgba(255,0,0,0);
          >img{
            width:toRem(115px);
            height: toRem(115px);
          }
          >p{
            @include sc(toRem(26px),#333);
            line-height: toRem(26px);
            // margin-top: toRem(20px);
          }
        }
      }
      .travel-destination{
        width:100%;
        margin-top: toRem(26px);
        box-sizing: border-box;
        font-size: 0;
        padding: 0 toRem(20px);
        >li{
          -webkit-tap-highlight-color:rgba(255,0,0,0);
          float: left;
          width: toRem(220px);
          height: toRem(122px);
          margin-right: toRem(24px);
          position: relative;
          margin-bottom: toRem(30px);
          >img{
            position: absolute;
            top:toRem(38px);
            right:toRem(18px);
          }
          >span{
            display: inline-block;
            margin-left: toRem(19px);
            @include sc(toRem(30px),#fff);
            line-height: toRem(122px);
          }
          >p{
            margin-top: toRem(15px);
            text-align: center;
            >i{
              display: inline-block;
              width:toRem(120px);
              height: toRem(2px);
              line-height: toRem(4px);
              background-image: linear-gradient(0deg, #0080ff 0%, #27c1ff 100%);
            }
          }
          &:nth-child(1){
            background: url('../assets/images/surround.png') no-repeat;
            background-size:100%;
            >img{
              width:toRem(50px);
              height: toRem(50px);
            }
          }
          &:nth-child(2){
            background: url('../assets/images/domestic.png') no-repeat;
            background-size:100%;
            >img{
              width:toRem(50px);
              height: toRem(46px);
            }
          }
          &:nth-child(3){
            background: url('../assets/images/city.png') no-repeat;
            background-size:100%;
            margin-right: 0;
            >img{
              width:toRem(48px);
              height: toRem(45px);
            }
          }
        }
      }
      .travel-destination-list{
        display: block;
        clear: both;
        padding: 0 toRem(20px);
        box-sizing: border-box;
        padding-bottom: toRem(46px);
        font-size:0;
        >a{
          display: inline-block;
          @include sc(toRem(26px),#333);
          height: toRem(60px);
          width: toRem(158px);
          text-align: center;
          line-height: toRem(58px);
          margin-right: toRem(25px);
          border:1px solid #eee;
          box-sizing: border-box;
          -webkit-tap-highlight-color:rgba(255,0,0,0);
        }
        .des-more{
          @include sc(toRem(26px),#5b8cfe);
          float: right;
          margin-right: 0;
          -webkit-tap-highlight-color:rgba(255,0,0,0);
        }
      }
    }
    .home-product{
      clear: both;
      margin-left: toRem(20px);
      >h2{
        &:before{
          content: '';
          @include wh(toRem(4px),toRem(19px));
          display: inline-block;
          background: url('../assets/images/border-left.png') no-repeat;
          background-size:100%;
          margin-right: toRem(20px);
        }
        @include sc(toRem(30px),#222);
        margin-bottom: toRem(40px);
        font-weight: bold;
      }
      >div{
        margin-left: toRem(10px);
        font-size: 0;
        >a{
          display: inline-block;
          vertical-align: top;
          margin-right: toRem(48px);
          font-size:0;
          >span{
            @include sc(toRem(28px),#333);
          }
          >i{
            display: inline-block;
            @include wh(100%,toRem(5px));
            background: url('../assets/images/border-b.png') no-repeat center;
            background-size:toRem(26px) toRem(5px);
            margin-top: toRem(18px);
          }
        }
      }
      .home-product-list{
        height: toRem(410px);
        margin-top: toRem(26px);
        width:auto;
        overflow-x: scroll !important;
        white-space: nowrap;
        font-size:0;
        margin-bottom: toRem(47px);
        &::-webkit-scrollbar {display:none}
        >li{
          display: inline-block;
          vertical-align: top;
          width:toRem(240px);
          overflow: hidden;
          margin-right: toRem(26px);
          border-radius: toRem(10px);
          // box-shadow: 0px 0px toRem(30px) 0px rgba(0, 0, 0, 0.1);
          >a{
            width:toRem(240px);
            height: toRem(410px);
            display: inline-block;
            .hot-images{
              position: relative;
              >img{
                display: block;
                width: 100%;
                height:toRem(240px);
                margin: auto;
                border-radius: toRem(10px);
              }
              >i{
                display: inline-block;
                position: absolute;
                top:0;
                z-index: 2;
                right:toRem(10px);
                @include wh(toRem(38px),toRem(47px));
              }
              .direct-sell{
                background: url('../assets/images/direct-sell.png') no-repeat;
                background-size: 100%;
              }
              .second-sell{
                background: url('../assets/images/second-sell.png') no-repeat;
                background-size: 100%;
              }
            }
            .hot-details{
              font-size: 0;
              position: relative;
              height: toRem(160px);
              box-sizing: border-box;
              >h2{
                @include sc(toRem(26px),#333);
                width: 100%;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                display: -webkit-box !important;
                -webkit-box-orient: vertical !important;
                line-height: toRem(35px);
                margin: toRem(15px) 0 toRem(10px) 0;
                -webkit-line-clamp: 2 !important;
                max-height: toRem(70px);
                white-space:initial;//文本不会换行（单行文本溢出）
              }
              .list-tags{
                >p{
                  display: inline-block;
                  >span{
                    display: inline-block;
                    @include sc(toRem(20px),#fff);
                    border-radius: toRem(4px);
                    height: toRem(30px);
                    line-height: toRem(30px);
                    padding: 0 toRem(13px);
                    margin-right: toRem(5px);
                    background-image: linear-gradient(36deg, #5280eb 0%, #83b4fc 100%), linear-gradient(#ffffff, #ffffff);
                  }
                  >i{
                    display: inline-block;
                    @include sc(toRem(25px),#999);
                    vertical-align: top;
                    margin-top: toRem(-8px);
                    margin-left: toRem(5px);
                  }
                }
              }
              .sale-price{
                position: absolute;
                bottom:0;
                font-size: 0;
                >p{
                  display: inline-block;
                  @include sc(toRem(28px),#ffba00);
                  //   &:before{
                  //       content: 'RMB';
                  //       @include sc(toRem(24px),#999);
                  //       margin-right: toRem(10px);
                  //   }
                  &:after{
                    content: '起';
                    @include sc(toRem(20px),#7d7d7d);
                  }
                }
                >span{
                  display: inline-block;
                  margin-left: toRem(17px);
                  // vertical-align: top;
                  // margin-top: toRem(10px);
                  // float: right;
                  @include sc(toRem(18px),#7d7d7d);
                  >i{
                    font-style: normal;
                    @include sc(toRem(18px),#ffba00);
                  }
                }
              }
            }
          }
        }
      }
    }
    .days-travel{
      font-size: 0;
      // box-sizing: border-box;
      >h2{
        &:before{
          content: '';
          @include wh(toRem(4px),toRem(19px));
          display: inline-block;
          background: url('../assets/images/border-left.png') no-repeat;
          background-size:100%;
          margin-right: toRem(20px);
        }
        @include sc(toRem(30px),#222);
        margin-bottom: toRem(40px);
        font-weight: bold;
        padding-left: toRem(30px);
      }
      .days-con{
        .days-type{
          display: block;
          border-bottom: 1px solid #e1e1e1;
          margin-bottom: toRem(20px);
          >li{
            display: inline-block;
            width: 21.5%;
            margin: 0 toRem(13px);
            box-sizing: border-box;
            text-align: center;
            padding:0 toRem(5px) toRem(20px) toRem(5px);
            @include sc(toRem(28px),#333);
            &.active{
              border-bottom:1px solid #5280eb;
              color:#5280eb;
            }
            &.esp{
              color:#999;
            }
          }
        }
        .days-city{
          padding-bottom: toRem(10px);
          >a{
            display: inline-block;
            @include sc(toRem(26px),#333);
            @include wh(toRem(158px),toRem(60px));
            line-height: toRem(60px);
            text-align: center;
            margin-left: toRem(22px);
            margin-bottom: toRem(22px);
            border:1px solid #eee;
          }
        }
      }
    }
    .guess-list{
      padding-left: toRem(30px);
      box-sizing: border-box;
      font-size: 0;
      >h2{
        &:before{
          content: '';
          @include wh(toRem(4px),toRem(19px));
          display: inline-block;
          background: url('../assets/images/border-left.png') no-repeat;
          background-size:100%;
          margin-right: toRem(20px);
        }
        @include sc(toRem(30px),#222);
        margin-bottom: toRem(40px);
        font-weight: bold;
      }
      >p{
        @include sc(toRem(30px),#999);
        text-align: center;
        padding-bottom: toRem(10px);
      }
      // ._v-container{
      // // top:toRem(203px);
      // // box-shadow: 0px toRem(-4px) toRem(6px) 0px rgba(0, 0, 0, 0.1);
      // // border-radius: toRem(10px) toRem(10px) 0px;
      //     position: relative;
      //     bottom:toRem(98px);
      //     // overflow: scroll;
      // }
      // .wrapper{
      // height:100vh;
      .guess-list-con{
        padding-right: toRem(30px);
        // height: auto;
        >li{
          margin-bottom: toRem(20px);
          >a{
            display: inline-block;
            width:100%;
            .image-con{
              display: inline-block;
              width:toRem(200px);
              height: toRem(200px);
              overflow: hidden;
              text-align: center;
              border-radius: toRem(8px);
              margin-right: toRem(20px);
              position: relative;
              >img:not(.img-esp){
                height: toRem(200px);
                transform: translateX(-25%);
                min-width: toRem(200px);
                min-width: 135%;

              }
              .img-esp{
                width:toRem(200px);
                height: toRem(200px);
              }
              >span{
                position: absolute;
                min-width: toRem(90px);
                height: toRem(30px);
                // @include wh(toRem(90px),toRem(30px));
                border-radius: toRem(4px);
                line-height: toRem(30px);
                @include sc(toRem(18px),#fff);
                text-align: center;
                z-index: 1;
                background: #ffba00;
                bottom: toRem(10px);
                left:0;
                padding: 0 toRem(10px);
                box-sizing: border-box;
              }
              >i{
                display: inline-block;
                position: absolute;
                top:0;
                z-index: 2;
                right:toRem(10px);
                @include wh(toRem(38px),toRem(47px));
              }
              .direct-sell{
                background: url('../assets/images/direct-sell.png') no-repeat;
                background-size: 100%;
              }
              .second-sell{
                background: url('../assets/images/second-sell.png') no-repeat;
                background-size: 100%;
              }
            }
            .product-intro{
              display: inline-block;
              height: toRem(200px);
              position: relative;
              vertical-align: top;
              width:calc(100% - #{toRem(230px)});
              >h2{
                @include sc(toRem(28px),#333);
                width:100%;
                overflow: hidden !important;
                -webkit-box-orient: vertical !important;
                text-overflow: ellipsis !important;
                display: -webkit-box !important;
                -webkit-line-clamp: 2 !important;
              }
              .list-tags{
                margin: toRem(10px) 0 toRem(15px) 0;
                >p{
                  display: inline-block;
                  >span{
                    display: inline-block;
                    @include sc(toRem(20px),#fff);
                    border-radius: toRem(4px);
                    height: toRem(30px);
                    line-height: toRem(30px);
                    padding: 0 toRem(13px);
                    margin-right: toRem(5px);
                    background-image: linear-gradient(36deg, #5280eb 0%, #83b4fc 100%), linear-gradient(#ffffff, #ffffff);
                  }
                  >i{
                    display: inline-block;
                    @include sc(toRem(25px),#999);
                    vertical-align: top;
                    margin-top: toRem(-8px);
                    margin-left: toRem(5px);
                  }
                }
              }
              >p{
                @include sc(toRem(20px),#7d7d7d);
              }
              .sale-price{
                position: absolute;
                bottom:0;
                width:100%;
                left:0;
                >p{
                  display: inline-block;
                  font-size: 0;
                  >span{
                    @include sc(toRem(24px),#333);
                    >i{
                      font-style: normal;
                      @include sc(toRem(24px),#ffba00);
                    }
                  }
                  .sale{
                    @include sc(toRem(32px),#ffba00);
                    margin-right: toRem(32px);
                    line-height: toRem(32px);
                    &:after{
                      content: '起';
                      @include sc(toRem(24px),#333);
                      font-weight: normal;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .get-coupon{
      position: fixed;
      bottom:toRem(220px);
      right: toRem(30px);
      >img{
        @include wh(toRem(154px),toRem(213px));
      }
    }
  }
</style>

