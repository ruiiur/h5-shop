<!--这是搜索页面-->
<template>
    <div class="search">
        <div class="search-header" >
            <div class="search-search" @click="toSearch()">
                <i></i>
                <span v-if="keyWord==''">目的地/景点...</span>
                <em>{{keyWord}}</em>
            </div>
            <div class="search-type">
                <ul>
                    <li v-for="(search,index) in searchClassification" @click="typeSearch(search,index)" :class="search.selected==true?'active':''"><span>{{search.type}}</span><i :class="search.selected==true?'active':''"></i></li>
                </ul>
                <div v-if="typeIndex==0">
                    <!-- @touchmove.prevent -->
                    <div class="destination-list" >
                        <ul>
                            <li @click="selectedRouter(destination,index)" v-for="(destination,index) in destinationList"  :class="destinationIndex==index?'active':''">{{destination.omRouteType.routetype}}</li>
                        </ul>
                        <div v-for="(destination,index) in destinationList" v-if="destinationIndex==index">
                            <a href="javascript:;" :class="hotCity.selected==true?'active':''"  @click.stop.prevent="selectedDes(hotCity,index)" v-for="(hotCity,index) in destinationList[index].omDestinations">{{hotCity.destname}}</a>
                        </div>
                    </div>
                </div>
                <div v-if="typeIndex==1" class="type-list">
                    <ul>
                        <li  @click="travelTypeEmpty()">不限<i v-if="travelIndex==-1"></i></li>
                        <li v-for="(travel,index) in travelTypeList" @click="travelSelected(travel,index)">{{travel.proType}}<i v-if="travelIndex==index"></i></li>
                    </ul>
                </div>
                <div v-if="typeIndex==2" class="type-list">
                    <ul>
                        <li  @click="priceTypeEmpty()">不限<i v-if="priceIndex==-1"></i></li>
                        <li v-for="(price,index) in priceTypeList" @click="priceSelected(price,index)">{{price.price}}<i v-if="priceIndex==index"></i></li>
                    </ul>
                </div>
                <div v-if="typeIndex==3" class="type-list">
                    <ul>
                        <li @click="saleTypeEmpty()">不限<i v-if="saleIndex==-1"></i></li>
                        <li v-for="(sale,index) in saleTypes" @click="saleSelected()">{{sale.ways}}<i v-if="saleIndex==index"></i></li>
                    </ul>
                </div>
            </div>
            <p></p>
        </div>
        <scroller :on-refresh="refresh" :on-infinite="infinite" ref="myscroller"  v-if="productList.length!=0">
            <div style="height: 1px;">
            </div>
            <div class="search-product">
                <ul>
                    <li  v-for="(product,index) in productList" >
                        <a :href="'#/details/'+product.id+'/'+siteId+'/'+product.orgId+'/'+product.isOutgoing">
                            <div class="image-con">
                                <!-- <img :src="product.coverImg" alt=""> -->
                                <img v-if="product.coverImg!=''&&product.coverImg!=null" :src="product.coverImg" alt="">
                                <img v-else="product.coverImg==''||product.coverImg==null" src="../assets/images/de-url.png" alt="">    
                            </div>
                            <div class="product-intro">
                                <h2 style="width: 100%; -webkit-box-orient: vertical;">{{product.aliaseName}}</h2>
                                <div class="list-tags">
                                    <!-- <i v-if="product.isAck==1">直售</i>
                                    <i v-if="product.isAck==0">二次确认</i> -->
                                    <p v-if="product.tags!=null"><span v-for="tag in product.tags.length" v-if="tag<3">{{product.tags[tag-1]}}</span><i v-if="product.tags.length>2">...</i></p>
                                </div>
                                <p v-if="product.tours.length!=0">班期：<span v-for="index in product.tours.length" v-if="index<4">{{product.tours[index-1]}}<i v-if="index!=3">、</i></span>...</p>
                                <div class="sale-price" >
                                    <p><span class="sale" v-if="userType==1">￥{{product.salesPrice}}</span><span class="sale" v-if="userType==2">￥{{product.directPrice}}</span><span v-if="userType==1">返:<i>{{product.rebatePrice}}</i></span></p> 
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </scroller>
        <p v-if="productList.length==0" class="without-tip">暂无符合条件的产品</p>
        <div class="box" v-if="typeIndex!=-1" @click="hideType()" @touchmove.prevent></div>
        <service></service>
    </div>
</template>
<script>
import tools from '../common/tools'
import VueScroller from 'vue-scroller'
import service from '../components/service'
import Vue from 'vue'
import { getDestination,getProductList,getProductType,newProductlist } from '../services/index'
Vue.use(VueScroller);
export default {
    data(){
        return{
            destinationIndex:0,//目的地初始值
            destinationList:[],//定制游目的地列表
            typeIndex:-1,//分类类型默认值
            siteId:'',//站点
            siteName:'',//站点名称
            destination:'',//目的地
            proType:'',//产品类型
            lowPrice:'',//最低价格
            highPrice:'',//最高价格
            orgId:[],//
            searchClassification:[
               {type:'线路',selected:false},
               {type:'类型',selected:false},
               {type:'价格',selected:false},
               {type:'售卖方式',selected:false},
            ],// 搜索类型分类
            productList:[
            ],//产品列表
            travelTypeList:[],//旅行类型
            priceTypeList:[
                {price:'1000以下'},
                {price:'1000~2000'},
                {price:'2000~4000'},
                {price:'4000以上'},
            ],//价格类型列表
            saleTypes:[
                {ways:'促销'},          
           ],//销售类型
            keyWord:'',
            userType:'',
            saleIndex:-1,//搜索类型默认值
            priceIndex:-1,//价格默认值
            travelIndex:-1,
            routetypeId:'',//线路类型
            // tipShow:false,// 没有数据的提示
            total:'',//产品总数
            page:0,//页码
            noData:'',
            tourDayScope:'',//间隔几天
            marketType:-1//是否特价促销
        }
    },
    methods: {
        // 去搜索页
        toSearch(){
            this.$router.push('/search/1');
        },
        // 搜索方法
        searchFun(page){
            let paramsEs={
                'siteId':this.siteId,
                'destination':this.destination,
                'start':page,
                'size':10,
                "routeTypeId":this.routetypeId,
//                 "site":this.siteName,
                "proType":this.proType,
                "lowPrice":this.lowPrice,
                "highPrice":this.highPrice,
                "keywords":this.keyWord,
                "orgId":tools.getLocalStorage('orgId'),
                "tourDayScope":this.tourDayScope,
                'marketType':this.saleIndex+1
            }
            // 产品查询
            // getProductList(paramsEs).then((response)=>{
            newProductlist(paramsEs).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('ES查询数据获取成功');
                    for(let i=0;i<response.data.length;i++){
                         if(response.data[i].tours!=null){
                            response.data[i].tours=response.data[i].tours.split(',');
                        }
                        else{
                            response.data[i].tours=[];
                        }
                        this.productList.push(response.data[i]);
                    }
                    this.total=response.code;
                }
                else{
                    console.log('ES查询数据获取失败');
                }
            }).catch((err)=>{
                console.log('ES查询接口获取异常',err);
                // this.$Message.info('ES查询接口获取异常');
            });
        },

        // 类型搜索
        typeSearch (obj,index){
            obj.selected=!obj.selected;
            if(obj.selected==false){
                this.typeIndex=-1;    
            }
            else{
                this.typeIndex=index;
            }
            for(let i=0;i<this.searchClassification.length;i++){
                if(i!=index){
                    this.searchClassification[i].selected=false;
                }
            }
        },
        // 隐藏类型框
        hideType(){
            this.typeIndex=-1;
            for(let i=0;i<this.searchClassification.length;i++){
                this.searchClassification[i].selected=false;
            }
        },
        //分类页面初始化
        classificationInit(){
            this.siteName=tools.getSessionStorage('siteName');
            this.siteId=tools.getSessionStorage('siteId');
            this.keyWord=tools.getLocalStorage('keyWord');
            this.tourDayScope=tools.getLocalStorage('tourDayScope')==null?"":tools.getLocalStorage('tourDayScope');
            this.orgId.push(tools.getLocalStorage('orgId'));
            this.userType=tools.getLocalStorage('userType');
            this.searchFun(0);
            let params=this.siteId;
            // 线路
            getDestination(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('搜索页线路数据获取成功');
                    this.destinationList=response.data;
                    if(this.destinationList.length!=0){
                         for(let i=0;i<this.destinationList.length;i++){
                             for(let j=0;j<this.destinationList[i].omDestinations.length;j++){
                                this.$set(this.destinationList[i].omDestinations[j], 'selected', false);
                            }
                         }
                    }
                    console.log('destinationList',this.destinationList);
                }
                else{
                    console.log('搜索页线路数据获取失败');
                }
            }).catch((err)=>{
                console.log('搜索页接口获取异常',err);
                // this.$Message.info('定制游目的地接口获取异常');
            });

            // 产品类型接口
            getProductType().then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('产品类型数据获取成功');
                    this.travelTypeList=response.data;
                    for(let i=0;i<this.travelTypeList.length;i++){
                        this.$set(this.travelTypeList[i],'selected',false);
                    }
                }
                else{
                    console.log('产品类型数据获取失败');
                }
            }).catch((err)=>{
                console.log('产品类型接口获取异常',err);
                // this.$Message.info('产品类型接口获取异常');
            });
        },
        // routerType类型选择
        selectedRouter(obj,index){
            this.destinationIndex=index;
            this.routeTypeId=obj.omRouteType.id;
            console.log(obj);
            console.log( this.routeTypeId);
            this.productList=[];
            this.searchFun(0);
        },
        // 线路选择
        selectedDes(obj,index){
            obj.selected=true;
            this.destination=obj.destname;
            for(let i=0;i<this.destinationList.length;i++){
                for(let j=0;j<this.destinationList[i].omDestinations.length;j++){
                    if(j!=index){
                        this.destinationList[i].omDestinations[j].selected=false;
                    }
                } 
            }
            this.productList=[];
            this.searchFun(0);
            this.typeIndex=-1; 
        },
        // 旅游类型选择
        travelSelected(obj,index){
            this.travelIndex=index;
            // this.proType=obj.proType;
            this.proType=obj.id;
            this.productList=[];
            this.searchFun(0);
            this.typeIndex=-1; 
             // 把旅游类型选项置为原始状态
            this.searchClassification[1].selected=false;
        },
        // 价格类型选择
        priceSelected(obj,index){
            this.priceIndex=index;
            if(this.priceIndex==0){
                this.lowPrice='';
                this.highPrice=1000;
            }
            if(this.priceIndex==1){
                this.lowPrice=1000;
                this.highPrice=2000;
            }
            if(this.priceIndex==2){
                this.lowPrice=2000;
                this.highPrice=4000;
            }
            if(this.priceIndex==3){
                this.lowPrice=4000;
                this.highPrice='';
            }
            this.productList=[];
            this.searchFun(0);
            this.typeIndex=-1; 
             // 把价格选项置为原始状态
            this.searchClassification[2].selected=false;
        },
        //销售类型选择
        saleSelected(){
            this.saleIndex=0;
            this.productList = [];
            this.searchFun(0);
            this.typeIndex=-1; 
            // 把销售类型选项置为原始状态
            this.searchClassification[3].selected=false;
        },
        // 销售类型置空
        saleTypeEmpty(){
            this.saleIndex=-1;
            this.productList = [];
            this.searchFun(0);
            this.typeIndex=-1;
             // 把销售类型选项置为原始状态
            this.searchClassification[3].selected=false;
        },
         // 价格类型置空
        priceTypeEmpty(){
            this.priceIndex=-1;
            this.highPrice='';
            this.lowPrice='';
            this.searchFun(0);
            this.typeIndex=-1; 
            // 把价格选项置为原始状态
            this.searchClassification[2].selected=false;
        },
        //旅行类型置空
        travelTypeEmpty(){
            this.travelIndex=-1;
            this.proType='';
            this.searchFun(0);
            this.typeIndex=-1; 
            // 把旅游类型选项置为原始状态
            this.searchClassification[1].selected=false;
        },
        // 下拉刷新上拉加载功能实现
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
                    this.searchFun(this.page);
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
                    this.productList = [];
                    this.searchFun(0);
                })
            }, 1500)
        }
    },
    created(){
        this.classificationInit();
    },
    components: {
       VueScroller,
       service
    },
}
</script>

<style lang="scss">
.search{
    ._v-container{
        top:toRem(283px) !important;
        box-shadow: 0px toRem(-4px) toRem(6px) 0px rgba(0, 0, 0, 0.1);
	    border-radius: toRem(10px) toRem(10px) 0px;
    }
    .without-tip{
        @include sc(toRem(30px),#999);
        padding-left: toRem(30px);
        padding-top: toRem(30px);
    }
    .search-header{
        position: relative;
        padding-top: toRem(10px) ;
        z-index: 10;
        background: #f8f8f8;
        .search-search{
            width: toRem(690px);
            height: toRem(80px);
            background-color: #fff;
            box-shadow: 0px 0px toRem(30px) 0px rgba(0, 0, 0, 0.1);
            border-radius: toRem(40px);
            margin: 0 toRem(30px) toRem(40px);
            background: #fff;
            >i{
                display: inline-block;
                vertical-align: middle;
                @include wh(toRem(30px),toRem(30px));
                background: url("../assets/images/home-search.png") no-repeat;
                background-size: 100%;
                margin-left: toRem(32px);
                margin-right: toRem(22px);
                margin-top: toRem(5px);
            }
            >span{
                display: inline-block;
                line-height: toRem(80px);
                @include sc(toRem(18px),#b3b3b3);
            }
            >em{
                @include sc(toRem(26px),#18191a);
            }
        }
        .search-type{  
            >ul{
                padding: 0 toRem(40px);
                font-size: 0;
                width:100%;
                box-sizing: border-box;
                padding-bottom: toRem(40px);
                height: toRem(66px);
                >li{
                    float: left;
                    width:25%;
                    text-align: center;
                    >span{
                        @include sc(toRem(26px),#18191a);
                        margin-right: toRem(6px);
                    }
                    >i{
                       display: inline-block;
                       @include wh(toRem(20px),toRem(10px));
                       background: url('../assets/images/type-down.png') no-repeat;
                       background-size:100%;
                       &.active{
                            background: url('../assets/images/type-up.png') no-repeat;
                            background-size:100%;
                       }
                    }
                    &.active{
                        >span{
                            @include sc(toRem(26px),$main-color);
                        }
                    }
                }
            }
            .destination-list{
                height: calc(100vh - #{toRem(195px)});
                font-size: 0;
                >ul{
                    display: inline-block;
                    width:toRem(199px);
                    background: #f8f8f8;
                    height: 100%;
                    padding: toRem(40px) 0 0 toRem(60px);
                    box-sizing: border-box;
                    >li{
                        @include sc(toRem(26px),#18191a);
                        margin-bottom: toRem(50px);
                        &.active{
                            @include sc(toRem(26px),$main-color);
                        }
                    }
                }
                >div{
                    display: inline-block;
                    vertical-align: top;
                    width:calc(100% - #{toRem(199px)});
                    background: #eee;
                    height: 100%;
                    padding: toRem(40px) 0 0 toRem(25px);
                    box-sizing: border-box;
                    overflow: auto !important;
                    >a{
                        display: inline-block;
                        @include sc(toRem(26px),#18191a);
                        margin-bottom: toRem(30px);
                        margin-right: toRem(40px);
                        &.active{
                            @include sc(toRem(26px),$main-color);
                        }
                    }
                }
            }
            .type-list{
                >ul{
                    >li{
                        @include sc(toRem(26px),#18191a);
                        padding: toRem(35px) toRem(30px);
                        >i{
                            float:right;
                            vertical-align: middle;
                            width:toRem(30px);
                            height: toRem(30px);
                            background: url('../assets/images/selected.png') no-repeat;
                            background-size:100%;
                            margin-top: toRem(5px);
                        }
                    }
                }
            }
        }
        p{
            clear: both;
        }
    }
    .search-product{
        font-size: 0;
        padding:toRem(25px) toRem(30px) 0 toRem(30px);
        box-sizing: border-box;
        min-height: toRem(200px);
       >ul{
            >li{
                margin-bottom: toRem(30px);
                border-bottom:1px solid #ddd;
                padding-bottom: toRem(20px);
            >a{
                display: inline-block;
                width:100%;
                .image-con{
                    display: inline-block;
                    width:toRem(190px);
                    height: toRem(130px);
                    overflow: hidden;
                    text-align: center;
                    border-radius: toRem(8px);
                    margin-right: toRem(20px);
                    >img{
                        height: toRem(130px);
                        min-width:100%;
                    }
                }
                .product-intro{
                    display: inline-block;
                    height: toRem(180px);
                    position: relative;
                    vertical-align: top;
                    width:calc(100% - #{toRem(210px)});
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
                    }
                    .list-tags{
                        margin: toRem(8px) 0 toRem(5px) 0;
                        >i{
                            height: toRem(32px);
                            line-height: toRem(34px);
                            padding: 0 toRem(11px);
                            display: inline-block;
                            background-image: $main-bg;
                            border-radius: toRem(4px); 
                            @include sc(toRem(20px),#fff);
                            margin-right: toRem(10px);
                        }
                        >p{
                            display: inline-block;
                            >span{
                                display: inline-block;
                                @include sc(toRem(20px),#999);
                                border: solid 1px #dddddd;
                                border-radius: toRem(4px);
                                height: toRem(30px);
                                line-height: toRem(32px);
                                padding: 0 toRem(13px);
                                margin-right: toRem(5px);
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
                        @include sc(toRem(20px),#666);
                    }
                    .sale-price{
                        position: absolute;
                        bottom:0;
                        width:100%;
                        left:0;
                        >span{
                            @include sc(toRem(24px),#666);
                            margin-right: toRem(24px);
                        }
                        >p{
                            display: inline-block;
                            vertical-align: top;
                            width:calc(100% - #{toRem(139px)});
                            >span{
                                @include sc(toRem(24px),#666);
                                >i{
                                    font-style: normal;
                                    @include sc(toRem(24px),#ff6326);
                                }
                            }
                            .sale{
                                float: right;
                                vertical-align: top;
                                margin-top: toRem(-8px);
                                @include sc(toRem(32px),#ff6326);
                                font-weight: bold;
                                &:before{
                                    content: 'RMB';
                                    @include sc(toRem(24px),#999);
                                    margin-right: toRem(10px);
                                    font-weight: normal;
                                }
                                &:after{
                                    content: '起';
                                    @include sc(toRem(18px),#999);
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
    .box{
        position: fixed;
        height:calc(100vh - #{toRem(300px)});
        width:100%;
        bottom:0;
        left:0;
        opacity: .6;
        background: #000;
        z-index: 1;
    }
}
</style>