<!--这是登录页面-->
<template>
    <div class="login">
       <div class="login-header">
            <!-- <img :src="wxUser.headImgUrl" alt=""> -->
            <img v-if="wxUser.headImgUrl!=''&&wxUser.headImgUrl!=null" :src="wxUser.headImgUrl" alt="">
            <img v-else="wxUser.headImgUrl==''||wxUser.headImgUrl==null" src="../assets/images/de-headimg.png" alt="">
           <div>
               <h2>{{wxUser.nickname}}</h2>
               <p>{{wxUser.country}}<span v-if="wxUser.province!=''">·</span>{{wxUser.province}}<span v-if="wxUser.city!=''">·</span>{{wxUser.city}}</p>
           </div>
       </div>
       <div class="login-content">
            <div>
                <label for="">姓名：</label>
                <span>{{erpUserDto.userName}}</span>
            </div>
            <div>
                <label for="">公司：</label>
                <span>{{erpUserDto.travelName}}</span>
            </div>
            <div>
                <label for="">部门：</label>
                <span>{{erpUserDto.deptName}}</span>
            </div>
            <div>
                <label for="">手机号码：</label>
                <span>{{erpUserDto.mobile}}</span>
            </div>
            <div v-if="!success">
                <label for="">登陆密码：</label>
                <input type="password" v-model="password" name="" id="" placeholder="ERP账号登陆密码">
            </div>
            <p v-if="!success"><a href="javascript:;" @click="bindFun()">立即绑定</a></p>
            <p v-if="success"><a :href="'#/home?orgId='+erpUserDto.orgID">进入店铺</a></p>
        </div>
        <toast v-model="showTip" type="text">{{tipText}}</toast>
        <service></service>
    </div>
</template>
<script>
import { Toast } from 'vux'
import { erpUserInfo,bindERPUser,erpAuthorize } from '../services/index'
import tools from '../common/tools'
import service from '../components/service'
export default {
    data(){
        return{
           erpUserDto:'',
           wxUser:'',
           password:'',
           showTip:false,
           tipText:'',
           success:false,
        }
    },
    methods: {
        loginInit(){
            console.log(window.location.hash);
            console.log(window.location.search);
            if(window.location.search.indexOf('code')>0){
                let code=window.location.search.split('=')[1].split('&')[0];
                let state=window.location.search.split('=')[2];
                let params = {
                    'code':code,
                    'state':state
                }
                console.log(params);
                erpUserInfo(params).then((response)=>{
                    console.log(response);
                    if(response.meta.success==true){
                        console.log('获取ERP用户信息接口成功');
                        this.erpUserDto=response.data.erpUserDto;
                        console.log( this.erpUserDto);
                        this.wxUser=response.data.wxUser;
                        tools.setSessionStorage('openId',response.data.wxUser.openId);
                        tools.setLocalStorage('userType',response.data.wxUser.userType);
                        tools.setSessionStorage('deptName',response.data.erpUserDto.deptName);
                        tools.setSessionStorage('userName',response.data.erpUserDto.userName);
                        tools.setSessionStorage('uOrgID',response.data.erpUserDto.orgID);
                        tools.setSessionStorage('deptId',response.data.erpUserDto.id);
                        tools.setSessionStorage('uOrgName',response.data.erpUserDto.travelAgencyName);
                        tools.setSessionStorage('userId',response.data.wxUser.userId);
                    }
                    else{
                        console.log('获取ERP用户信息接口失败');
                    }
                }).catch((err)=>{
                    console.log('获取ERP用户信息接口异常',err);
                    // this.$Message.info('获取ERP用户信息接口异常');
                });
            }
            else{
                let params = {
                    'userId':window.location.href.split('=')[1],
                }
                console.log(window.location.href.split('=')[1]);
                erpAuthorize(params).then((response)=>{
                    console.log('结果',response);
                    parent.location.href =response;
                }).catch((err)=>{
                    console.log('ERP用户授权接口异常',err);
                    // this.$Message.info('ERP用户授权接口异常');
                });
            }
            
        },
        // 立即绑定
        bindFun(){
            let params={
                'acctPwd':this.password,
                'photo':this.wxUser.headImgUrl,
                'userID':this.wxUser.userId,
                'weChatOpenID_H5Shop':this.wxUser.openId,
                'dataStatus':1,
            }
            bindERPUser(params).then((response)=>{
                console.log(response);
                if(response=='Success'){
                    this.showTip=true;
                    this.tipText="绑定成功";
                    this.success=true;
                    tools.setLocalStorage('userType',1);
                }
                else{
                    this.showTip=true;
                    this.tipText=response;
                    this.success=false;
                }
                
            }).catch((err)=>{
                console.log('绑定ERP用户信息接口异常',err);
                // this.$Message.info('绑定ERP用户信息接口异常');
            });
        }
    },
    mounted(){
        this.loginInit();
    },
    components: {
      Toast,
      service
    },
}
</script>

<style lang="scss">
.login{
    min-height: calc(100vh - #{toRem(80px)});
    background: #f8f8f8;
    padding:0 toRem(30px) ;
    .login-header{
        background: #fff;
        margin-bottom: toRem(20px);
        border:toRem(10px);
        font-size: 0;
        padding: toRem(20px) toRem(34px);
        >img{
            @include wh(toRem(106px),toRem(106px));
            border-radius: 50%;
            margin-right: toRem(20px);
        }
        >div{
            display: inline-block;
            vertical-align: top;
            margin-top: toRem(23px);
            >h2{
                @include sc(toRem(30px),#333);
            }
            >p{
                @include sc(toRem(24px),#333);
            }
        }
    }
    .login-content{
        background: #fff;
        border:toRem(10px);
        font-size:0;
        padding-bottom: toRem(40px);
        >div{
            padding: toRem(39px) toRem(30px) toRem(20px) toRem(30px);
            border-bottom:1px solid #d9d9d9;
            >label{
            @include sc(toRem(26px),#666);
            }
            >span{
            float: right;
            @include sc(toRem(26px),#333);
            }
            >input{
                @include sc(toRem(26px),#333);
                -webkit-tap-highlight-color:rgba(255,0,0,0);
                outline: none;
                border: none;
                &::placeholder{
                     @include sc(toRem(26px),#999);
                }
            }
        }
        >p{
            text-align: center;
            margin-top: toRem(60px);
            >a{
                @include sc(toRem(26px),#fff);
                display: inline-block;
                @include wh(toRem(300px),toRem(60px));
                line-height: toRem(60px); 
                background-image: $main-bg;
                border-radius: toRem(10px);
            }
        }
    }
}
</style>

