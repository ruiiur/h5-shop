<!--这是搜索商铺页面-->
<template>
    <div class="search-store">
        <img src="../assets/images/store-logo.png" alt="">
        <form class="search-input" action="" onsubmit="return false;" @click="toStoreList()">
            <input type="search" readonly placeholder="请输入旅行社名称" onsearch = "function(){}">
            <i></i>
       </form>
       <div class="history-list">
           <a href="javascript:;" v-for="(supplier,index) in suppliersList" @click="toFun(supplier)">{{supplier.keyWords}}<i v-if="showCancel==true" @click.stop.prevent="delectSuppliers(supplier,index)"></i></a>
           <!-- <a href="javascript:;">海南事达国际旅行社<i v-if="showCancel==true" @click="delectSuppliers()"></i></a>
           <a href="javascript:;">长沙事达国际旅行社<i v-if="showCancel==true"></i></a>
           <a href="javascript:;">苏州八爪鱼旅行社<i v-if="showCancel==true"></i></a> -->
       </div>
       <p class="cancel-btn"><i :class="showCancel==true?'active':''" @click="showCancel=!showCancel"></i></p>
       <!-- <service></service> -->
    </div>
</template>
<script>
import tools from '../common/tools'
import { Search} from 'vux'
// import service from '../components/service'
import { userInfo,storeListAuth,searchSuppliers,delSuppliers } from '../services/index'
export default {
    data(){
        return{
           showCancel:false,
           keyWord:'',
           suppliersList:[],//供应商列表
        }
    },
    methods: {
        toStoreList(){
            this.$router.push('/store-list');
        },
        searchStoreInit(){
            tools.setSessionStorage('siteId','');
            tools.setSessionStorage('siteName','');
            if(window.location.search.indexOf('code')>0){
                let code=window.location.search.split('=')[1].split('&')[0];
                // let state=window.location.search.split('=')[2];
                // console.log(code);
                // console.log(params);
                if(tools.getSessionStorage('openId')==null || tools.getSessionStorage('openId')==undefined){
                     let params = {
                        'code':code,
                    }
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
                            this.searchHisSuppliers();
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
                     this.searchHisSuppliers();
                }
            }
            else{
                storeListAuth().then((response)=>{
                    console.log('结果',response);
                    parent.location.href =response;
                }).catch((err)=>{
                    console.log('商铺列表授权接口异常',err);
                });
            }
        },

        //  搜索历史记录
        searchHisSuppliers(){
             searchSuppliers().then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('搜索供应商接口成功');
                    this.suppliersList=response.data;
                }
                else{
                    console.log('搜索供应商接口失败');
                }
            }).catch((err)=>{
                console.log('搜索供应商接口异常',err);
            });
        },

        // 删除供应商
        delectSuppliers(obj,index){
            let params=obj.keyWords;
             delSuppliers(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('删除供应商接口成功');
                    this.suppliersList.splice(index,1);
                }
                else{
                    console.log('删除供应商接口失败');
                }
            }).catch((err)=>{
                console.log('删除供应商接口异常',err);
            });
        },

        // 跳转到供应商页面
        toFun(obj){
           this.$router.push('/home?orgId='+obj.orgId);
        }
    },
    mounted(){
      this.searchStoreInit();
    },
    components: {
      Search,
    //   service
    },
}
</script>

<style lang="scss">
.search-store{
   >img{
       width:100%;
       margin-bottom: toRem(100px);
   }
   .search-input{
        width:toRem(690px);
        height: toRem(80px);
        line-height: toRem(80px);
        margin:0 auto toRem(80px);
        position: relative;
        font-size: 0;
        border:toRem(2px) solid #ddd;
        border-radius: toRem(40px);
        padding-left: 2%;
        padding-top: toRem(7px);
        box-sizing: border-box;
        >input{
            width:96%;
            height: toRem(50px);
            line-height: toRem(50px);
            border:none;
            outline: none;
            -webkit-tap-highlight-color:rgba(255,0,0,0);
            padding-left: toRem(30px);
            box-sizing: border-box;
            @include sc(toRem(24px),#333);
            &::placeholder{
                @include sc(toRem(24px),#999);
            }
        }
        >i{
            display: inline-block;
            @include wh(toRem(42px),toRem(42px));
            background: url('../assets/images/search-store.png') no-repeat;
            background-size:100%;
            position: absolute;
            top:toRem(19px);
            right:toRem(40px);
        }
   }
   .history-list{
        padding-left:toRem(30px);
        font-size: 0;
        >a{
            display: inline-block;
            padding: 0 toRem(35px);
            line-height: toRem(50px);
            line-height: toRem(50px);
            background: #eee;
            border-radius: toRem(25px);
            @include sc(toRem(24px),#666);
            position: relative;
            min-width: toRem(250px);
            box-sizing: border-box;
            text-align: center;
            margin-right: toRem(50px);
            margin-bottom: toRem(40px);
            >i{
                position: absolute;
                @include wh(toRem(40px),toRem(40px));
                display: inline-block;
                background: url('../assets/images/cancel.png') no-repeat center;
                background-size:toRem(34px) toRem(34px);
                right:toRem(-10px);
                top:toRem(-10px);
            }
        }
   }
   .cancel-btn{
       text-align: center;
       position: fixed;
       bottom:0;
       padding-bottom: toRem(30px);
       width: 100%;
       >i{
            display: inline-block;
            @include wh(toRem(40px),toRem(40px));
            background: url('../assets/images/delect-active.png') no-repeat center;
            background-size:toRem(34px) toRem(36px);
            &.active{
                background: url('../assets/images/history-cancel.png') no-repeat center;
                background-size:toRem(34px) toRem(36px);
            }
       }
   }
}
</style>

