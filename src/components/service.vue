 <!--头部返回组件-->
<template>
    <div class="service" v-if="isService==true">
       <a :href="'tel:' + serviceTel"><img src="../assets/images/zaixiankefu.png" alt=""></a>
    </div>
</template>

<script>
import { GetCustomerServiceInfo } from '../services/index'
import tools from '../common/tools'
export default {
    data() {
        return {
            serviceTel:'',//客服电话
            isService:false,//是否显示
        };
    },
    methods:{
        serviceInit(){
            var telTime=setInterval(()=>{
                if(tools.getLocalStorage('orgId')!=null && tools.getLocalStorage('orgId')!='undefined'){
                    clearInterval(telTime);
                    this.orgId=tools.getLocalStorage('orgId');
                    // 客服电话
                    let paramsTel={
                        // 'orgID':'D2FB3DB0-AFFD-46C6-AE75-EBFDAF27F567'
                        'orgID':this.orgId
                    }
                    GetCustomerServiceInfo(paramsTel).then(response => {
                        console.log(response);
                        console.log("客服电话");
                        this.serviceTel=response;
                        console.log(this.isService,'this.isService11')
                        if(response!=null&&response!='null'){
                            this.isService=true;
                            console.log(this.isService,'this.isService')
                        }
                    })
                    .catch(err => {
                        console.log("客服电话异常", err);
                    });
                }
            },1000)
        }
    },
    watch:{
       
    },
    mounted(){
        this.serviceInit();
    }
};
</script>

<style lang="scss">
.service{
    position: fixed;
    top:45%;
    right:0;
    z-index: 999;
    >a{
        display: inline-block;
        >img{
            @include wh(toRem(64px),toRem(164px));
        }
    }
}
</style>

