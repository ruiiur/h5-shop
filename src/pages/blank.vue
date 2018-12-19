<!--无专卖店提示页面-->
<template>
    <div class="blank">
        <img src="../assets/images/none-s.png" alt="">
        <p>该旅行社暂未开通专卖店</p>
        <p>请联系</p>
        <h3>{{storeInfo.invoiceTitle}}</h3>
        <h3>{{storeInfo.tacontact}} {{storeInfo.tacontactMobile}}</h3>
    </div>
</template>
<script>
import { getOrgInfo } from '../services/index'
import tools from '../common/tools'
export default {
    data(){
        return{
            storeInfo:'',//店铺信息
        }
    },
    methods: {
         // 关于店铺页面初始化
        storeInit(){
            this.orgId=tools.getLocalStorage('orgId');
            console.log(window.location.href.split('=')[1],'aa')
            let params=window.location.href.split('=')[1];
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
            });
        }
    },
    mounted(){
        this.storeInit();
    },
    components: {
    },
}
</script>

<style lang="scss">
.blank{
    text-align: center;
    padding-top: toRem(180px);
    >img{
        @include wh(toRem(366px),toRem(241px));
    }
    >p{
        @include sc(toRem(32px),#999);
        margin-top: toRem(64px);
    }
    >h3{
        @include sc(toRem(32px),#333);
        margin-top: toRem(23px);
    }
}
</style>

