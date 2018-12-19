<!--这是我的页面-->
<template>
    <div class="mine">
        <div class="mine-header">
            <h2>店铺信息<a href="#/quote" v-if="userType==1">查看最新报价<i></i></a></h2>
            <div>
                <div>
                    <!-- <img :src="storeInfo.logo" alt=""> -->
                    <img v-if="storeInfo.logo!=''&&storeInfo.logo!=null" :src="storeInfo.logo" alt="">
                    <img v-else="storeInfo.logo==''||storeInfo.logo==null" src="../assets/images/de-logo.png" alt="">
                    <p>{{storeInfo.travelAgencyName}}</p>
                </div>
                <p><a href="#/about-store">关于店铺<i></i></a></p>
            </div>
        </div>
        <div class="personal-information">
            <h2>个人信息</h2>
            <ul v-if="userType==1">
                <li><img src="../assets/images/com.png">公司<span>{{orgInfo.travelAgencyName}}</span></li>
                <li><img src="../assets/images/dept.png">部门<span>{{mineInfo.deptName}}</span></li>
                <li><img src="../assets/images/name.png">姓名<span>{{mineInfo.userName}}</span></li>
            </ul>
            <!-- <p v-if="userType==1"><a href="javascript:;">切换账号</a></p> -->
            <div v-if="userType==2">
                <!-- <img :src="headImgUrl" alt=""> -->
                <img v-if="headImgUrl!=''&&headImgUrl!=null" :src="headImgUrl" alt="">
                <img v-else="headImgUrl==''||headImgUrl==null" src="../assets/images/de-headimg.png" alt="">
                <h2>{{nickname}}</h2>
                <p>{{country}}<span v-if="province!=''">·</span>{{province}}<span v-if="city!=''">·</span>{{city}}</p>
            </div>
        </div>
        <div v-if="userType==1" class="setting">
            <h2>设置</h2>
            <a :href="'http://omp.'+setUrl+'/Module/QA/FeedbackByPhone.aspx?CreatedByType=1&CreatedBy='+nickName+'&CreatedByID='+userId+'&System=4'"><img src="../assets/images/yijianfankui.png" alt="">意见反馈 <i></i></a>
        </div>
        <div v-if="userType==2" class="mine-bind">
            <h2>设置</h2>
            <p>手机号：{{bindTel}}<a href="#/bind-phone/1" v-if="bindTel==''">绑定<i></i></a></p>
            <p @click="feedFun()">意见反馈<a href="javascript:;"><i></i></a></p>
        </div>
        <footerView :footerObject="footerObject"></footerView>
        <service></service>
    </div>
</template>
<script>
import { getOrgInfo,getErpUser } from '../services/index'
import footerView from '../components/footer'
import tools from '../common/tools'
import service from '../components/service'
export default {
    data(){
        return{
           footerObject:'mine',
           orgId:'',
           storeInfo:'',//店铺信息
           mineInfo:'',//个人信息
           orgInfo:'',
           userType:'',
           nickname:'',//昵称
           headImgUrl:'',//头像
           province:'',//省份
           city:'',//城市
           country:'',//国家
           bindTel:'',//绑定的手机号
           nickName:'',//昵称
           userId:'',
           setUrl:'',
        }
    },
    methods: {
        // 我的页面初始化
        mineInit(){
            this.setUrl= window.location.href.split('//')[1].split('/')[0].split('.')[1]+'.'+window.location.href.split('//')[1].split('/')[0].split('.')[2];
            this.userType=tools.getLocalStorage('userType');
            this.orgId=tools.getLocalStorage('orgId');
            this.bindTel=tools.getSessionStorage('mobile');
            if(this.userType==1){
                this.nickName=tools.getSessionStorage('nickname');
                this.userId=tools.getSessionStorage('userId');
            }
            if(this.bindTel=='null'){
                this.bindTel='';
            }
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

            // 我的信息
            if(this.userType==1){
                getErpUser().then((response)=>{
                    console.log(response);
                    if(response.meta.success==true){
                        console.log('我的信息获取成功');
                        this.mineInfo=response.data.erpUserDto;
                        this.orgInfo=response.data.orgInfo;
                    }
                    else{
                        console.log('我的信息获取失败');
                    }
                }).catch((err)=>{
                    console.log('我的信息获取异常',err);
                    // this.$Message.info('我的信息获取异常');
                });
            }

            if(this.userType==2){
                this.nickname=tools.getSessionStorage('nickname');
                this.headImgUrl=tools.getSessionStorage('headImgUrl');
                this.city=tools.getSessionStorage('city');
                this.country=tools.getSessionStorage('country');
                this.province=tools.getSessionStorage('province');
            }
        },
        feedFun(){
            window.location.href='http://omp.'+this.setUrl+'/Module/QA/FeedbackByPhone.aspx?CreatedByType=2&CreatedBy=&CreatedByID=&System=4';
        }
    },
    mounted(){
        this.mineInit();
    },
    components: {
      footerView,
      service
    },
}
</script>

<style lang="scss">
.mine{
    background: #f8f8f8;
    min-height: calc(100vh - #{toRem(80px)});
    .mine-header{
        background: #fff;
        // padding: toRem(54px) toRem(30px) toRem(70px);
        // box-sizing: border-box;
        font-size: 0;
        >h2{
            @include sc(toRem(28px),#333);
            line-height: toRem(70px);
            padding: 0 toRem(20px);
            border-bottom:1px solid #e1e1e1;
            font-weight: bold;
            >a{
                float: right;
                @include sc(toRem(28px),$main-color); 
                font-weight: normal;
                >i{
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: toRem(20px);
                    background: url('../assets/images/offer.png') no-repeat;
                    @include wh(toRem(12px),toRem(20px));
                    background-size: 100%;
                }
            }
        }
        >div{
            padding: toRem(20px) toRem(20px) toRem(20px) toRem(33px);
            >div{
                display: inline-block;
                vertical-align: middle;
                width:toRem(555px);
                >img{
                    width:toRem(141px);
                    max-height: toRem(84px);
                    margin-bottom: toRem(20px);
                }
                >p{
                    @include sc(toRem(28px),#333);
                }
            }
            >p{
                display: inline-block;
                // margin-top: toRem(65px);
                >a{
                    display: inline-block;
                    @include sc(toRem(26px),#333); 
                    >i{
                        display: inline-block;
                        // vertical-align:middle;
                        width:toRem(12px);
                        height: toRem(20px);
                        margin-left: toRem(20px);
                        background: url('../assets/images/about.png') no-repeat;
                        background-size: 100%;
                    }
                }
            }
        }
    }
    .personal-information{
        background: #fff;
        // margin: toRem(40px) toRem(30px) 0;
        margin-top: toRem(20px);
        border-radius: toRem(10px);
        // padding-bottom: toRem(36px);
        // padding: toRem(20px) toRem(28px) toRem(37px);
        >h2{
            // @include sc(toRem(30px),#18191a); 
            // text-align: center;
            // font-weight: bold;
            @include sc(toRem(28px),#333);
            line-height: toRem(70px);
            padding: 0 toRem(20px);
            border-bottom:1px solid #e1e1e1;
            font-weight: bold;
        }
        >ul{
            >li{
               @include sc(toRem(26px),#18191a);  
               line-height: toRem(90px);
               height: toRem(90px);
               padding:0 toRem(22px);
               border-bottom: toRem(2px) solid #ddd;
               >img{
                   display: inline-block;
                   vertical-align: middle;
                   @include wh(toRem(46px),toRem(46px));
                   margin-right: toRem(30px);
               } 
               >span{
                   float: right;
                   @include sc(toRem(28px),#333);
               }
               &:last-child{
                   border-bottom: none;
               }
            }
        }
        >p{
            font-size: 0;
            padding-top: toRem(40px);
            text-align: center;
            >a{
                @include sc(toRem(26px),$main-color);
            }
        }
        >div{
            text-align: center;
            font-size: 0;
            padding-bottom: toRem(36px);
            >img{
                @include wh(toRem(100px),toRem(100px));
                border-radius: 50%; 
                margin-top: toRem(40px);
            }
            >h2{
                @include sc(toRem(30px),#333);
                margin-top: toRem(30px);
                margin-bottom: toRem(5px);
            }
            >p{
                @include sc(toRem(24px),#333);
            }
        }
    }
    .setting{
        background: #fff;
        margin-top: toRem(20px);
        >h2{
            @include sc(toRem(28px),#333);
            line-height: toRem(70px);
            padding: 0 toRem(20px);
            border-bottom:1px solid #e1e1e1;
            font-weight: bold;
        }
        >a{
            padding:0 toRem(22px);
            line-height: toRem(90px);
            height: toRem(90px);
            display: block;
            >img{
                display: inline-block;
                vertical-align: middle;
                @include wh(toRem(46px),toRem(46px));
                margin-right: toRem(30px);
            }
            @include sc(toRem(28px),#333);
            >i{
                float: right;
                // vertical-align: middle;
                @include wh(toRem(12px),toRem(20px));
                background: url('../assets/images/about.png') no-repeat;
                background-size:100%;
                margin-left: toRem(20px);
                margin-top: toRem(35px);
            }
        }
    }
    .mine-bind{
        background: #fff;
        margin-top: toRem(20px);
        >h2{
            @include sc(toRem(28px),#333);
            line-height: toRem(70px);
            padding: 0 toRem(20px);
            border-bottom:1px solid #e1e1e1;
            font-weight: bold;
        }
        >p{
            background: #fff;
            // margin: toRem(20px) toRem(30px) 0;
            // border-radius: toRem(10px);
            height: toRem(80px);
            line-height: toRem(80px);
            @include sc(toRem(28px),#333);
            padding: 0 toRem(20px);
            border-bottom:1px solid #e1e1e1;
            >a{
                float: right;
                @include sc(toRem(24px),#7d7d7d);
                >i{
                    display: inline-block;
                    // vertical-align: middle;
                    @include wh(toRem(12px),toRem(20px));
                    background: url('../assets/images/about.png') no-repeat;
                    background-size:100%;
                    margin-left: toRem(20px);
                }
            }
        }
    }
}
</style>

