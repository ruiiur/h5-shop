<!--这是关于店铺页面-->
<template>
    <div class="about-store">
       <div>
            <!-- <img :src="storeInfo.logo" alt=""> -->
            <img v-if="storeInfo.logo!=''&&storeInfo.logo!=null" :src="storeInfo.logo" alt="">
            <img v-else="storeInfo.logo==''||storeInfo.logo==null" src="../assets/images/de-logo.png" alt="">
            <p>{{storeInfo.travelAgencyName}}</p>
       </div>
       <ul>
            <li>电话：{{storeInfo.phone}}</li>
            <li>地址：{{storeInfo.address}}</li>
            <li>税号：{{storeInfo.taxNumber}}</li>
            <li>许可证号：{{storeInfo.socialCreditCode}}</li>
        </ul>
        <a :href="'#/home?orgId='+orgId">返回店铺首页</a>
        <service></service>
    </div>
</template>
<script>
import service from '../components/service'
import { getOrgInfo } from '../services/index'
import tools from '../common/tools'
export default {
    data(){
        return{
            orgId:'',
            storeInfo:'',//店铺信息
        }
    },
    methods: {
         // 关于店铺页面初始化
        storeInit(){
            this.orgId=tools.getLocalStorage('orgId');
            let params=this.orgId;
            getOrgInfo(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('店铺信息获取成功');
                    this.storeInfo=response.data;
                }
                else{
                    console.log('店铺信息获取失败');
                }
            }).catch((err)=>{
                console.log('店铺信息获取异常',err);
                // this.$Message.info('店铺信息获取异常');
            });
        }
    },
    mounted(){
        this.storeInit();
    },
    components: {
        service
    },
}
</script>

<style lang="scss">
.about-store{
    padding: 0 toRem(30px);
    min-height: calc(100vh - #{toRem(80px)});
     background: #f8f8f8;
    >div{
        padding-top: toRem(40px);
        text-align: center;
        >img{
            width:toRem(235px);
            height: toRem(70px);
            margin-bottom: toRem(20px);
        }
        >p{
            @include sc(toRem(26px),#333);
        }
    }
    >ul{
        background: #fff;
        border-radius: toRem(10px);
        margin: toRem(40px) 0;
        padding: 0 toRem(28px);
        >li{
            @include sc(toRem(26px),#18191a);  
            line-height: toRem(26px);
            padding:toRem(40px) 0;
            border-bottom: toRem(2px) solid #ddd;
            &:last-child{
                border-bottom:none;
            }
        }
    }
    >a{
        width:100%;
        @include sc(toRem(28px),#fff);
        background-image: $main-bg;
        border-radius: toRem(10px);
        height: toRem(80px);
        line-height: toRem(80px);
        display: inline-block;
        text-align: center;
        text-align: center;
    }
}
</style>

