<!--无专卖店提示页面-->
<template>
    <div class="blank-coupon">
        <img src="../assets/images/none-s.png" alt="">
        <p class="title">若您尚未注册老旅游SaaS综合业务系统</p>
        <a href="http://zhuce.laolvyou.vip/#/loginPhone">点击注册</a>
        <p>若您已注册，请前往<br>电脑端<span>“个人中心”</span>进行扫码绑定</p>
    </div>
</template>
<script>
// import { getOrgInfo } from '../services/index'
// import tools from '../common/tools'
export default {
    data(){
        return{
            // storeInfo:'',//店铺信息
        }
    },
    methods: {
        //  // 关于店铺页面初始化
        // storeInit(){
        //     this.orgId=tools.getLocalStorage('orgId');
        //     console.log(window.location.href.split('=')[1],'aa')
        //     let params=window.location.href.split('=')[1];
        //     getOrgInfo(params).then((response)=>{
        //         console.log(response);
        //         if(response.meta.success==true){
        //             console.log('店铺信息获取成功');
        //             this.storeInfo=response.data;
        //         }
        //         else{
        //             console.log('店铺信息获取失败');
        //         }
        //     }).catch((err)=>{
        //         console.log('店铺信息获取异常',err);
        //     });
        // }
    },
    mounted(){
        // this.storeInit();
    },
    components: {
    },
}
</script>

<style lang="scss">
.blank-coupon{
    text-align: center;
    padding-top: toRem(180px);
    >img{
        @include wh(toRem(366px),toRem(241px));
    }
    >p{
        @include sc(toRem(32px),#999);
        margin-top: toRem(64px);
         font-weight: bold;
    }
    // >h3{
    //     @include sc(toRem(32px),#333);
    //     margin-top: toRem(23px);
    // }
    .title{
        font-weight: bold;
        color: #333;
    }
    >a{
        font-size: toRem(32px);
        color: #5b82ff;
        display: block;
        margin-top: toRem(80px);
    }
    >p>span{
        color: #666;
        font-weight: normal;
    }
}
</style>

