<!--过渡提示页面-->
<template>
    <div class="jump">
        <img src="../assets/images/jump.gif" alt="">
        <p>加载中...</p>
    </div>
</template>
<script>
import { jump,jumpAuthorize,userInfo } from '../services/index'
import tools from '../common/tools'
export default {
    data(){
        return{
            orgId:'',
            status:'',
            userId:'',
        }
    },
    methods: {
         // 关于店铺页面初始化
        jumpInit(){
            // console.log(window.location.href,'aa')
            // console.log(window.location.href.split('=')[4].split('&')[0],'aa')
            if(window.location.search.indexOf('code')!=-1){
                this.orgId=window.location.href.split('=')[3].split('&')[0];
                this.status=window.location.href.split('=')[4].split('&')[0];
                this.userId=window.location.href.split('=')[5];
            }
            else{
                this.orgId=window.location.href.split('=')[1].split('&')[0];
                this.status=window.location.href.split('=')[2].split('&')[0];
                this.userId=window.location.href.split('=')[3];
            }
           
            if(this.status==3){
                // 授权
                if(tools.getSessionStorage('openId')!=null&&tools.getSessionStorage('openId')!="null"&&tools.getSessionStorage('openId')!=undefined){
                    let params={
                        'orgId':this.orgId,
                        'status':this.status,
                        'userId':this.userId,
                    }
                    // 调取首页接口
                    this.jumpApi(params);
                }
                else{
                    if(window.location.search.indexOf('code')!=-1){
                        let code=window.location.search.split('=')[1].split('&')[0];
                        console.log('code',code);
                        let params = {
                            'code':code,
                        }
                        console.log(params);
                        if(!tools.getLocalStorage('code')||code!=tools.getLocalStorage('code')){
                            tools.setLocalStorage('code',code);
                            userInfo(params).then((response)=>{
                                console.log(response);
                                if(response.meta.success==true){
                                    console.log('获取直客用户信息接口成功');
                                    tools.setLocalStorage('userType',response.data.userType);
                                    tools.setSessionStorage('openId',response.data.openId);
                                    tools.setSessionStorage('nickname',response.data.nickname);
                                    tools.setSessionStorage('headImgUrl',response.data.headImgUrl);
                                    tools.setSessionStorage('city',response.data.city);
                                    tools.setSessionStorage('country',response.data.country);
                                    tools.setSessionStorage('province',response.data.province);
                                    tools.setSessionStorage('mobile',response.data.mobile);
                                    this.userId=response.data.openId;
                                    let params={
                                        'orgId':this.orgId,
                                        'status':this.status,
                                        'userId':this.userId,
                                    }
                                    // 调取首页接口
                                    this.jumpApi(params);
                                }
                                else{
                                    console.log('获取直客用户信息接口失败');
                                }
                            }).catch((err)=>{
                                console.log('获取直客用户信息接口异常',err);
                                // this.$Message.info('获取直客用户信息接口异常');
                            });
                        }
                        else{
                            let params={
                                'orgId':this.orgId,
                                'status':this.status,
                                'userId':this.userId,
                            }
                            // 调取首页接口
                            this.jumpApi(params);
                        }
                    }
                    else{
                        let params = {
                            'orgId':this.orgId,
                        }
                        console.log(params);
                        jumpAuthorize(params).then((response)=>{
                            console.log('结果',response);
                            parent.location.href=response;
                        }).catch((err)=>{
                            console.log('直客用户授权接口异常',err);
                            // this.$Message.info('直客用户授权接口异常');
                        });
                    }
                }
            }
            else{
                let params={
                            'orgId':this.orgId,
                            'status':this.status,
                            'userId':this.userId,
                        }
                // 调取首页接口
                this.jumpApi(params); 
            }
        },
        jumpApi(params){
            jump(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('跳转信息获取成功');
                    parent.location.href=response.meta.message;
                }
                else{
                    console.log('跳转信息获取失败');
                }
            }).catch((err)=>{
                console.log('跳转信息获取异常',err);
            });
        }
    },
    mounted(){
        this.jumpInit();
    },
    components: {
    },
}
</script>

<style lang="scss">
.jump{
    text-align: center;
    padding-top: toRem(180px);
    >img{
        width: toRem(400px);
    }
    >p{
        @include sc(toRem(32px),#999);
        margin-top: toRem(64px);
    }
}
</style>

