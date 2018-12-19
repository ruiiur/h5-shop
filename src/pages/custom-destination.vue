<!--这是定制游目的地页面-->
<template>
    <div class="custom-destination">
       <div class="destination-list">
            <ul>
                <li @click="destinationIndex=index" v-for="(destination,index) in destinationList"  :class="destinationIndex==index?'active':''">{{destination.omRouteType.routetype}}</li>
            </ul>
            <div v-for="(destination,index) in destinationList" v-if="destinationIndex==index">
                <a href="javascript:;" :class="hotCity.selected==true?'active':''"  @click.stop.prevent="selectedDes(hotCity)" v-for="(hotCity,index) in destinationList[index].omDestinations">{{hotCity.destname}}</a>
            </div>
        </div>
        <div class="show-destination">
            <p>已选（最多可选3个）</p>
            <div>
                <a href="javascript:;" v-for="des in selectedDesList.length" @click.stop.prevent="deleteDes(des)">{{selectedDesList[des-1]}}<i></i></a>
            </div>
            <button v-if="selectedDesList.length!=0" @click="destinationSubmit()">确定</button>
            <button v-if="selectedDesList.length==0" disabled >确定</button>
        </div>
        <toast v-model="showTip" type="text">最多可选择3个目的地~</toast>
        <service></service>
    </div>
</template>
<script>
import { Toast } from 'vux'
import tools from '../common/tools'
import { getDestination } from '../services/index'
import service from '../components/service'
export default {
    data(){
        return{
            destinationIndex:0,//目的地
            destinationList:[],//定制游目的地列表
            selectedDesList:[],//选择的目的地列表
            selectedDesIdList:[],//选择的目的地id列表
            showTip:false,//toast提示
        }
    },
    methods: {
        // 定制游目的地初始化
        customDestinationInit(){
            this.selectedDesList=[];
            this.selectedDesIdList=[];
            // 初始化目的地列表
            if(tools.getLocalStorage('selectedDesList')){
                this.selectedDesList=JSON.parse(tools.getLocalStorage('selectedDesList'));
            }
            // 初始化目的地id列表
            if(tools.getLocalStorage('selectedDesIdList')){
                this.selectedDesIdList=JSON.parse(tools.getLocalStorage('selectedDesIdList'));
            }
            let params=tools.getSessionStorage('siteId');
            getDestination(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('定制游目的地数据获取成功');
                    this.destinationList=response.data;
                    if(this.destinationList.length!=0){
                         for(let i=0;i<this.destinationList.length;i++){
                             for(let j=0;j<this.destinationList[i].omDestinations.length;j++){
                                this.$set(this.destinationList[i].omDestinations[j], 'selected', false);
                                // 给对应城市高亮
                                if(this.selectedDesList.length!=0){
                                    for(let k=0;k<this.selectedDesList.length;k++){
                                        if(this.destinationList[i].omDestinations[j].destname== this.selectedDesList[k]){
                                            this.destinationList[i].omDestinations[j].selected=true;
                                        }
                                    }
                                }
                            }
                         }
                    }
                    console.log('destinationList',this.destinationList);
                }
                else{
                    console.log('定制游目的地数据获取失败');
                }
            }).catch((err)=>{
                console.log('定制游目的地接口获取异常',err);
                // this.$Message.info('定制游目的地接口获取异常');
            });
        },
        // 目的地选择
        selectedDes(obj){
            // console.log( this.selectedDesList);
            // console.log( this.selectedDesIdList);
            obj.selected=!obj.selected;
            if(this.selectedDesList.length==3){
                obj.selected=!obj.selected;
                if(obj.selected==false){
                    this.showTip=true;
                }
                if(obj.selected==true){
                    for(let i=0;i<this.selectedDesList.length;i++){
                        if(this.selectedDesList[i]==obj.destname){
                            // console.log(this.selectedDesList[i]);
                            this.selectedDesList.splice(i,1);
                            this.selectedDesIdList.splice(i,1);
                            obj.selected=false;
                            // console.log( this.selectedDesList);
                            // console.log( this.selectedDesIdList);
                        }
                    }
                }
                return;
            }
            if(obj.selected==true){
                this.selectedDesList.push(obj.destname);
                this.selectedDesIdList.push(obj.destid);
            }
            else{
                for(let i=0;i<this.selectedDesList.length;i++){
                    if(this.selectedDesList[i]==obj.destname){
                        console.log(this.selectedDesList[i]);
                        this.selectedDesList.splice(i,1);
                        this.selectedDesIdList.splice(i,1);
                        obj.selected=false;
                    }
                }
            }
            console.log( this.selectedDesList);
            console.log( this.selectedDesIdList);
        },
        // 删除目的地
        deleteDes(index){
            if(this.destinationList.length!=0){
                for(let i=0;i<this.destinationList.length;i++){
                    for(let j=0;j<this.destinationList[i].omDestinations.length;j++){
                        if(this.destinationList[i].omDestinations[j].destname== this.selectedDesList[index-1]){
                            this.destinationList[i].omDestinations[j].selected=false;
                        }
                    }
                }
            }
            this.selectedDesList.splice(index-1,1);
            this.selectedDesIdList.splice(index-1,1);
            console.log(this.selectedDesList);
            console.log(this.selectedDesIdList);
        },
        // 确定目的地
        destinationSubmit(){
            // 把选择的目的地名称存起来
            tools.setLocalStorage('selectedDesList',JSON.stringify(this.selectedDesList));
            // 把选择的目的地对应的id存起来
            tools.setLocalStorage('selectedDesIdList',JSON.stringify(this.selectedDesIdList));
            // console.log(JSON.parse(tools.getLocalStorage('selectedDesList')))
            this.$router.push('/custom-first');
        }
    },
    mounted(){
        this.customDestinationInit();
    },
    components: {
        Toast,
        service
    },
}
</script>

<style lang="scss">
.custom-destination{
    .destination-list{
        // min-height: calc(100vh - #{toRem(80px)});
        height: calc(100vh - #{toRem(80px)});
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
    .show-destination{
        position: fixed;
        bottom: 0;
        left:0;
        z-index: 100;
        width:100%;
        background: #fff;
        padding: toRem(20px) 0 0 0;
        box-sizing: border-box;
        >p{
           @include sc(toRem(24px),#999); 
           margin-bottom: toRem(40px);
           padding-left: toRem(40px);
        }
        >div{
            padding-left: toRem(40px);
            margin-bottom: toRem(34px);
            font-size: 0;
            >a{
                display: inline-block;
                background-image: $main-bg;
                border-radius: toRem(30px); 
                padding: 0 toRem(58px) 0 toRem(33px);  
                line-height: toRem(58px);
                height: toRem(60px);
                @include sc(toRem(24px),#fff); 
                position: relative;
                margin-right: toRem(20px);
                >i{
                    position: absolute;
                    right:toRem(21px);
                    top:toRem(18px);
                    width:toRem(18px);
                    height: toRem(18px);
                    display: inline-block;
                    background: url('../assets/images/close.png') no-repeat;
                    background-size: 100%;
                }
            }
        }
        >button{
            height: toRem(98px);
            background-image: $main-bg;
            @include sc(toRem(30px),#fff);
            border:none;
            width:100%;
            &:disabled{
                background: #eee;
                @include sc(toRem(30px),#999);
            }
        }
    }
}
</style>


