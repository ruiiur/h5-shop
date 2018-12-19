<!--授权过渡提示页面-->
<template>
  <div class="auth">
    <img src="../assets/images/jump.gif" alt="">
    <p>加载中...</p>
  </div>
</template>
<script>
  import { auth,userInfo } from '../services/index'
  import tools from '../common/tools'
  export default {
    data(){
      return{
        oldUrl:'',
      }
    },
    methods: {
      // 授权初始化
      authInit(){
        console.log(window.location.href);
        // 判断路径中是否包含code
        if(window.location.search.indexOf('code')>0){
          let code=window.location.search.split('=')[1].split('&')[0];
          console.log('code',code);
          let params = {
            'code':code,
          }
          //调用获取用户信息接口
          userInfo(params).then((response)=>{
            console.log(response);
            if(response.meta.success==true){
              console.log('获取直客用户信息接口成功');
              //授权前url
              let url = window.location.href.split('url=')[1];
              //拼接用户信息参数
              let parm = 'userType='+response.data.userType+
                '&openId='+response.data.openId+
                '&nickname='+response.data.nickname+
                '&headImgUrl='+response.data.headImgUrl+
                '&city='+response.data.city+
                '&country='+response.data.country+
                '&province='+response.data.province+
                '&mobile='+response.data.mobile+
                '&userId='+response.data.userId;
              //如果授权前url中可能包含？
              if(url.indexOf("?")>0){
                url = url + "&" + parm;
              }else {
                url = url + "?" + parm;
              }
              // tools.setLocalStorage('userType',response.data.userType);
              // tools.setSessionStorage('openId',response.data.openId);
              // tools.setSessionStorage('nickname',response.data.nickname);
              // tools.setSessionStorage('headImgUrl',response.data.headImgUrl);
              // tools.setSessionStorage('city',response.data.city);
              // tools.setSessionStorage('country',response.data.country);
              // tools.setSessionStorage('province',response.data.province);
              // tools.setSessionStorage('mobile',response.data.mobile);
              // tools.setSessionStorage('userId',response.data.userId);
              console.log(url,"授权之前的页面url");
              //跳转到授权之前的页面
              window.location.href=decodeURIComponent(url);
            }
            else{
              console.log('获取直客用户信息接口失败');
            }
          }).catch((err)=>{
            console.log('获取直客用户信息接口异常',err);
            // this.$Message.info('获取直客用户信息接口异常');
          });
        }else{
          //调用接口，获取授权跳转url，请求参数：当前页面全路径
          let params={'url':decodeURIComponent(window.location.href)};
          console.log(params,'paramsparamsparamsparamsparams');
          auth(params).then((response)=>{
            console.log(response,'页面url');
            window.location.href=response;
          }).catch((err)=>{
            console.log('授权获取异常',err);
          });
        }

        // this.oldUrl=decodeURIComponent(window.location.href.split('url=')[1]);
        // let params={'url':this.oldUrl};
        // console.log(params,'paramsparamsparamsparamsparams');
        // auth(params).then((response)=>{
        //     console.log(response,'页面url');
        //     window.location.href=response;
        // }).catch((err)=>{
        //     console.log('授权获取异常',err);
        // });
      }
    },
    mounted(){
      this.authInit();
    },
    components: {
    },
  }
</script>

<style lang="scss">
  .auth{
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

