 <!--头部返回组件-->
<template>
    <div>
        <div class="header" v-if="isShow">
            <span @click="back"><i></i></span>
            {{title}}
            <i v-if="isDetailShow" class="share">向上点击分享<img src="../assets/images/double.png" alt=""></i>
        </div>
        <div class="classification-header" v-if="isClassificationShow">
            <i class="back" @click="back"></i>
            <div class="home-search" @click="toSearch()">
                <i></i>
                <span>搜索本店产品</span>
            </div>
        </div>
    </div>
</template>

<script>
import tools from '../common/tools'
export default {
  data() {
    return {
        title:'',
        isShow:false,
        isClassificationShow:false,//分类页是否显示
        isDetailShow:false,//详情页是否显示
    };
  },
//   props: [],
    methods:{
        back(){
            this.$router.go(-1);//返回上一层
        },
        // 到搜索页
        toSearch(){
            this.$router.push('/search/2');
        },
        // 头部初始化
        // headerInit(){
        //     this.title=window.document.title;
        //     console.log('title',window.document.title);
        // }
    },
    watch:{
        $route(now,old){  
            console.log('now',now);   //监控路由变换，控制返回按钮的显示
            if(now.path.indexOf("home")>-1||now.path.indexOf("classification")>-1||now.path.indexOf("blank")>0||now.path.indexOf("jump")>-1){
                    this.isShow=false;
            } else{
                this.isShow=true;
            }
            if(now.path.indexOf("classification")>-1){
                this.isClassificationShow=true;
            }
            else{
                this.isClassificationShow=false;
            }
             if(now.path.indexOf("/details")>-1){
                this.isDetailShow=true;
            }
            else{
                this.isDetailShow=false;
            }
            this.title=now.meta.title;
            // console.log(now.meta.title);
            
        }
    },
  mounted(){
    // this.headerInit();
  }
};
</script>

<style lang="scss">
.header{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    z-index: 999;
    height: toRem(80px);
    background-image: $main-bg;
    text-align: center;
    @include sc(toRem(32px),#fff);
    line-height: toRem(80px);
    >span{
        position: absolute;
        left:toRem(30px);
        display: inline-block;
        // vertical-align: middle;
        // height: toRem(80px);
        // line-height: toRem(80px);
        @include sc(toRem(32px),#fff);
        >i{
            display: inline-block;
            vertical-align: top;
            @include wh(toRem(30px),toRem(80px));
            background: url('../assets/images/back.png') no-repeat center center;
            background-size:toRem(30px) toRem(30px);
            
        }
    }
    .share{
        position: absolute;
        font-size: toRem(28px);
        right:toRem(40px);
        >img{
            display: inline-block;
            margin-top: toRem(25px);
            vertical-align: top;
            @include wh(toRem(32px),toRem(32px))
        }
    }
}
.classification-header{
    position: fixed;
    background-image: linear-gradient(69deg, #5b8cfe 0%, #73aafc 100%), linear-gradient(#333333, #333333);
    top:0;
    width:100%;
    height: toRem(80px);
    z-index: 10001;
    padding-top: toRem(13px);
    box-sizing: border-box;
    .back{
        display: inline-block;
        vertical-align: top;
        margin-top: toRem(5px);
        @include wh(toRem(40px),toRem(40px));
        background: url('../assets/images/back-home.png') no-repeat center;
        background-size:toRem(14px) toRem(24px);
    }
    .home-search{
        display: inline-block;
        background: #fff;
        width:toRem(520px);
        height: toRem(54px);
        border-radius: toRem(6px);
        position: relative;
        margin-left:toRem(65px);
        >i{
            position: absolute;
            display: inline-block;
            @include wh(toRem(26px),toRem(26px));
            background: url("../assets/images/home-search.png") no-repeat;
            background-size: 100%;
            top:toRem(16px);
            left:toRem(45px);
        }
        >span{
            position: absolute;
            @include sc(toRem(24px),#7d7d7d); 
            top:toRem(10px);
            left:toRem(199px);
        }
    }
}
</style>

