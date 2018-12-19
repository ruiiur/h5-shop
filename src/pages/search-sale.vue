<!--这是搜索销售人员页面-->
<template>
    <div class="search-sale">
        <form class="search-input" action="">
            <input type="search" ref="input" placeholder="搜索销售人员姓名" autofocus="autofocus"  @focus="saleShow=true"  v-model="saleName">
            <i></i>
        </form>
        <ul class="search-list" v-if="salesList.length!=0&&saleShow==true" >
            <li :class="saleIndex==index?'active':''" @click.stop.prevent="selectedSale(index,sale)" v-for="(sale,index) in salesList">{{sale.UserName}}</li>
        </ul>
        <ul class="search-without" v-if="salesList.length==0&&saleShow==true&&saleName!=''" >
            <li>找不到符合要求的销售人员</li>
        </ul>
        <service></service>
    </div>
</template>
<script>
import tools from '../common/tools'
import { GetAllUserByCondition } from '../services/index'
import { Search } from 'vux'
import service from '../components/service'
export default {
    data(){
        return{
            saleShow:false,//出发地搜索结果显隐
            saleName:'',//销售人员姓名
            salesList:[],//销售人员列表
            saleIndex:0,//销售人员默认值
            saleID:'',//销售id
            deptID:'',
            deptName:'',
            orgId:''
        }
    },
    methods: {
        //选择销售人员
        selectedSale(index,obj){
            this.saleIndex = index;
            this.saleName = obj.UserName;
            this.saleID=obj.ID;
            this.deptID=obj.DeptID;
            this.deptName=obj.DeptName;
            this.saleShow = !this.saleShow;
            // 信息放入缓存
            tools.setSessionStorage('saleName',obj.UserName);
            tools.setSessionStorage('saleID',obj.ID);
            tools.setSessionStorage('deptID',obj.DeptID);
            tools.setSessionStorage('deptName',obj.DeptName);
            this.$router.go(-1);
        },
        saleInit(){
            this.orgId=tools.getLocalStorage('orgId');
        }
    },
    mounted(){
        this.saleInit();
        this.$nextTick(() => {this.$refs['input'].focus()})
    },
    watch:{
        saleName:async function (){
            this.salesList=[];
            if(this.saleName!==''){
                let params={
                'orgID':this.orgId,
                'userName':this.saleName,
                }
                await GetAllUserByCondition(params).then((response)=>{
                    console.log(response);
                    console.log('搜索销售人员成功');
                    if(response.length!=0){
                    this.salesList=response;
                    }
                    else{
                    this.saleName='';
                    }
                }).catch((err)=>{
                    console.log('搜索销售人员异常',err);
                });
            }
        }
    },
    components: {
        Search,
        service
    },
}
</script>

<style lang="scss">
.search-sale{
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