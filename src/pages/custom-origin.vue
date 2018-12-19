<!--这是定制游出发地页面-->
<template>
    <div class="custom-origin">
        <form class="search-input" action="">
            <input type="search" ref="input" placeholder="搜索出发地" autofocus="autofocus" @input="originFun()" @focus="originShow=true" @blur="originBlur" v-model="originText">
            <i></i>
        </form>
        <ul class="search-list" v-if="departuresList.length!=0&&originShow==true" >
            <li :class="deIndex==index?'active':''" @click.stop.prevent="selectedOrigin(index,de)" v-for="(de,index) in departuresList">{{de.shortname}}</li>
        </ul>
        <ul class="search-without" v-if="departuresList.length==0&&originShow==true&&originText!=''" >
            <li>找不到符合要求的出发地</li>
        </ul>
        <service></service>
    </div>
</template>
<script>
import service from '../components/service'
import tools from '../common/tools'
import { getCustomDeparture } from '../services/index'
import { Search } from 'vux'
export default {
    data(){
        return{
            originShow:false,//出发地搜索结果显隐
            originText:'',//选择的出发地
            departuresList:[],//出发地列表
            deIndex:0,//出发地默认值
        }
    },
    methods: {
        //选择出发城市
        selectedOrigin(index,obj){
            this.originText=obj.shortname;
            this.originId=obj.id;
            this.originShow=false;
            this.$router.push('/custom-first');
            // 把出发地id放入缓存
            tools.setLocalStorage('departureId',obj.id);
            // 把出发地放入缓存
            tools.setLocalStorage('departure',obj.shortname);
            // alert(tools.getLocalStorage('departure'));
        },
        //出发地搜索
        originFun(){
            this.originShow=true;
            // 定制游出发地
            if(this.originText!=''){
                let params={
                    'name':this.originText
                }
                getCustomDeparture(params).then((response)=>{
                    console.log(response);
                    if(response.meta.success==true){
                        console.log('定制游出发地数据获取成功');
                        this.departuresList=response.data;
                    }
                    else{
                        console.log('定制游出发地数据获取失败');
                    }
                }).catch((err)=>{
                    console.log('定制游出发地接口获取异常',err);
                    // this.$Message.info('定制游出发地接口获取异常');
                });
            }
        },
        // 失去焦点时出发地情况
        originBlur(){
            if(this.departuresList.length==0){
                this.originText='';
            }
        },
       
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
.custom-origin{
    padding-top: toRem(10px);
    background: #f8f8f8;
    min-height: calc(100vh - #{toRem(80px)});
    box-sizing: border-box;
    .search-input{
         height: toRem(80px);
         margin:0 toRem(30px);
         width:calc(100% - #{toRem(60px)});
         position: relative;
        >input{
            -webkit-tap-highlight-color:rgba(255,0,0,0);
            box-shadow: 0px 0px toRem(30px) 0px rgba(0, 0, 0, 0.1);
            border-radius: toRem(40px);
            height: toRem(80px);
            width:100%;
            padding-left: toRem(80px);
            padding-right: toRem(20px);
            border:none;
            outline: none;
            @include sc(toRem(24px),#333);
            &::-webkit-search-cancel-button {display: none;}
        }
        >input:-moz-placeholder{
            @include sc(toRem(24px),#999);
        }
        >i{
            display: inline-block;
            @include wh(toRem(30px),toRem(30px));
            position: absolute;
            background: url('../assets/images/home-search.png') no-repeat;
            background-size: 100%;
            left:toRem(30px);
            top:toRem(25px);
        }
    }
    .search-list{
        margin-top: toRem(50px);
        border-bottom:1px solid #ddd;
        >li{
            @include sc(toRem(30px),#333);
            padding-left: toRem(30px);
            line-height: toRem(90px);
        }
    }
    .search-without{
        margin-top: toRem(50px);
        >li{
            @include sc(toRem(30px),#999);
            padding-left: toRem(35px);
            line-height: toRem(90px);
        }
    }
}
</style>


