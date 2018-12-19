<!--这是商铺搜索结果页面-->
<template>
    <div class="store-list">
        <form class="search-input" action="" onsubmit="return false;">
            <input type="search" ref="input" v-model="keyWord" autofocus="autofocus" placeholder="请输入旅行社名称" @search = "searchFun">
            <i @click="searchFun"></i>
        </form>
        <ul class="store-list-con">
            <li v-for="(store,index) in storeList" >
                <!-- :href="'#/home?orgId='+store.OrgID" -->
                <a  @click="saveSupplierFun(store)">{{store.TravelAgencyName}}<i></i></a>
            </li>
        </ul>
        <p v-if="storeList.length==0&&tipShow==true">暂无符合条件的商铺</p>
        <service></service>
    </div>
</template>
<script>
import tools from '../common/tools'
import { Search} from 'vux'
import service from '../components/service'
import { searchStore,saveSupplier } from '../services/index'
export default {
    data(){
        return{
           showCancel:false,
           keyWord:'',
           storeList:[],//商铺列表
           tipShow:false,
        }
    },
    methods: {
        // 搜索列表
        searchFun(){
            let params={
                'key':this.keyWord,
                'pagesize':10
            }
            searchStore(params).then((response)=>{
                console.log(response);
                this.storeList=response;
                if( this.storeList.length==0){
                    this.tipShow=true;
                }
            }).catch((err)=>{
                console.log('搜索商铺接口异常报错',err);
            });
        },
        // 保存搜索结果
        saveSupplierFun(obj){
            let params={
                'keyWords':obj.TravelAgencyName,
                'orgId':obj.OrgID
            }
            saveSupplier(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    this.$router.push('/home?orgId='+obj.OrgID);
                }
                
            }).catch((err)=>{
                console.log('搜索商铺接口异常报错',err);
            });
        }
    },
    mounted(){
        this.$nextTick(() => {this.$refs['input'].focus()})
    },
    components: {
      Search,
      service
    },
}
</script>

<style lang="scss">
.store-list{
    background: #f1f1f1;
    min-height: calc(100vh - #{toRem(80px)});
    padding-top: toRem(20px);
    box-sizing: border-box;
   .search-input{
        background: #fff;
        width:toRem(690px);
        height: toRem(80px);
        line-height: toRem(80px);
        margin:0 auto toRem(40px);
        position: relative;
        font-size: 0;
        border:toRem(2px) solid #ddd;
        border-radius: toRem(40px);
        padding-left: 2%;
        padding-top: toRem(7px);
        box-sizing: border-box;
        box-shadow: 0px toRem(4px) toRem(10px) 0px rgba(18, 18, 18, 0.1);
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
            &::-webkit-search-cancel-button {display: none;}
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
   .store-list-con{
       margin: 0 toRem(30px);
       >li{
           height: toRem(100px);
           line-height: toRem(100px);
           background: #fff;
           border-radius: toRem(10px);
           background: #fff;
           margin-bottom: toRem(20px);
           padding: 0 toRem(20px);
           font-size: 0;
           >a{
               display: inline-block;
               width:100%;
               @include sc(toRem(24px),#333);
               >i{ 
                    float: right;
                    @include wh(toRem(13px),toRem(100px));
                    // display: inline-block;
                    background: url('../assets/images/store-about.png') no-repeat center;
                    background-size:toRem(13px) toRem(26px);
               }
           }
           &:last-child{
               margin-bottom: 0;
           }
       }
   }
   >p{
       @include sc(toRem(30px),#999);
       padding-left: toRem(40px);
   }
}
</style>

