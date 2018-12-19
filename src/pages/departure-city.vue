<!-- 出发城市页面-->
<template>
    <div class="departure-city">
        <h1>出发城市（{{cityNum}}）</h1>
        <div>
            <p>推荐</p>
            <div>
                <a href="javascript:;" @click.stop.prevent="selectedOrigin(departureCityT)">{{departureCityT.departure}}</a>
            </div>
        </div>
        <div v-for="(dep,key) in departuresGroup" v-if="dep.length!=0">
            <p>{{key}}</p>
            <div>
                <a href="javascript:;" v-for="(city,index) in dep" @click.stop.prevent="selectedOrigin(city)">{{city.departure}}</a>
            </div>
        </div>
        <service></service>
    </div>
</template>
<script>
import service from '../components/service'
import { getProductDepartures } from '../services/index'
import tools from '../common/tools'
export default {
    data(){
        return{
            orgId:'',
            cityNum:20,//出发城市个数
            proId:'',//产品id
            departuresGroup:[],//分组出发地
            departureCityT:'',//推荐城市
        }
    },
    methods: {
        // 选择出发地
        selectedOrigin(obj){
            // 把出发地id放入缓存
            tools.setLocalStorage('departureId',obj.id);
            // 把出发地放入缓存
            tools.setLocalStorage('departure',obj.departure);
            this.$router.go(-1);
        },
         // 出发城市页面初始化
        departureCityInit(){
            this.proId=tools.getLocalStorage('proId');
            let params={
                'proid':this.proId,
                'siteid':tools.getSessionStorage('siteId'),
                'isOutgoing':tools.getLocalStorage('isOutgoing'),
                'orgId':tools.getLocalStorage('orgIdw'),
            };
            // 出发地接口绑定
            getProductDepartures(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('出发地数据获取成功');
                    this.departureCityT = response.data.departure;
                    this.departuresGroup = response.data.departuresGroup;
                }
                else{
                    console.log('出发地数据获取失败');
                }
            }).catch((err)=>{
                console.log('出发地异常报错',err);
            });
        },
    },
    mounted(){
        this.departureCityInit();
    },
    components: {
        service
    },
}
</script>

<style lang="scss">
.departure-city{
    >h1{
        height: toRem(70px);
        line-height: toRem(70px);
        @include sc(toRem(28px),#333);
        padding-left: toRem(22px);
        background: #fff;
    }
    >div{
        >p{
            height: toRem(44px);
            line-height: toRem(44px); 
            @include sc(toRem(26px),#333);
            background: #f4f7fa;
            padding-left: toRem(22px);
        }
        >div{
            padding-left: toRem(22px);
            font-size: 0;
            padding-top: toRem(16px);
            >a{
                display: inline-block;
                @include wh(toRem(210px),toRem(60px));
                @include sc(toRem(26px),#333);
                line-height: toRem(58px);
                border:1px solid #e1e1e1;
                text-align: center;
                margin-right: toRem(28px);
                margin-bottom: toRem(16px);
            }
        }
    }
}
</style>

