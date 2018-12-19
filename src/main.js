// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'


// //引入rem.js
import Rem from './common/rem'
import router from './router'
import App from './App'
import Vuex from 'vuex'
import { WechatPlugin } from 'vux'
Vue.use(WechatPlugin)
const wx = Vue.wechat;
import { getSdkConfig,amount } from './services/index'
import store from './store/store'
import tools from './common/tools'
import utils from './common/utils'
Vue.use(Vuex);
import clipboard from 'clipboard';
//注册到vue原型上
Vue.prototype.clipboard = clipboard;
// 路由切换前处理
router.beforeEach((to, from, next) => {
  // let title = '事达国旅';
//   console.log(from,'from');
//   console.log(to,'to');
//     if(from.fullPath!='/'){
//         tools.setLocalStorage("fromPath",from.fullPath);
//     }
//   console.log(this.$route,'to');
  to.matched.forEach((path) => {
      if (path.meta.title) {
          // title = `${path.meta.title}`;
          document.title = path.meta.title;
      }
      // if(window.location.href.indexOf('home')>0){
      //   // alert('1');
      //   document.title=tools.getLocalStorage('travelAgencyName');
      // }
      let url=window.location.href.split('#')[0];
      console.log(url);
      let params={
       'url':url
      }
      getSdkConfig(params).then((response)=>{
        console.log(response);
        console.log('获取微信js-sdk配置参数成功');
        let Data=response.data;
        // console.log(Data.appid);
        wx.config({
          debug: false, // 开启调试模式,开发时可以开启  
          appId: Data.appid,   // 必填，公众号的唯一标识   由接口返回
          timestamp: Data.timestamp, // 必填，生成签名的时间戳 由接口返回
          nonceStr: Data.nonceStr,    // 必填，生成签名的随机串 由接口返回
          signature: Data.signature,   // 必填，签名 由接口返回
          jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 此处填你所用到的方法 
        }); 
        
        if(window.location.href.indexOf('details')<=0 && window.location.href.indexOf('search-store')<=0){
          wx.ready(()=> {
            wx.onMenuShareAppMessage({
                title: tools.getSessionStorage('travelAgencyName'), // 分享标题
                desc: document.title, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: tools.getLocalStorage('logo'), // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: ()=> {
                    // 用户确认分享后执行的回调函数
                    // alert('分享成功');
                    let myDate = new Date();
                    let pageType='';
                    if(window.location.href.indexOf('home')>0){
                        pageType=2;
                    }
                    else{
                        pageType=3;
                    }
                    let paramsAmount={
                        'createDate':myDate,
                        'orgId': tools.getLocalStorage('orgId'),
                        'orgName': tools.getSessionStorage('travelAgencyName'),
                        // 'loginStatus':1, 		//登录状态：0.未登录 1.登录
                        'userId':tools.getLocalStorage('userType')==1?tools.getSessionStorage('userId'):'', 			//用户ID
                        'userType':tools.getLocalStorage('userType'),
                        'userName':tools.getLocalStorage('userType')==1?tools.getSessionStorage('userName'):tools.getSessionStorage('nickname'),
                        'deptId': tools.getLocalStorage('userType')==1?tools.getSessionStorage('deptId'):'',			//部门ID B端
                        'deptName':tools.getLocalStorage('userType')==1?tools.getSessionStorage('deptName'):'', 			//部门名称 B端
                        'uOrgId': tools.getLocalStorage('userType')==1?tools.getSessionStorage('uOrgId'):'',			//用户旅行社ID B端 
                        'uOrgName':tools.getLocalStorage('userType')==1?tools.getSessionStorage('uOrgName'):'',			//用户旅行社名称 B端
                        'pageType':pageType,
                        'url':window.location.href,
                        'urlTitle':tools.getSessionStorage('travelAgencyName'),
                        'desc':document.title,
                    }
                    amount(paramsAmount).then((response)=>{
                        console.log(response);
                        console.log('分享统计接口请求成功');
                    }).catch((err)=>{
                        console.log('分享统计接口异常',err);
                    });
                   
                },
                cancel: ()=> {
                    // alert('分享失败')
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareTimeline({
              title: tools.getSessionStorage('travelAgencyName'), // 分享标题
              desc: document.title, // 分享描述
              link: window.location.href,
              imgUrl: tools.getSessionStorage('logo'), // 分享图标
              success: function() {
                  // 用户确认分享后执行的回调函数
              },
              cancel: function() {
                  // 用户取消分享后执行的回调函数
              }
            });
          });
        }
        if(window.location.href.indexOf('search-store')>0){
            wx.ready(()=> {
                wx.onMenuShareAppMessage({
                    title: '竞界科技微专卖店', // 分享标题
                    desc: '旅游新零售，带你轻松玩转旅游社交电商圈', // 分享描述
                    link: window.location.href, // 分享链接
                    imgUrl: 'http://h5s.aipinzan.cn/file/icon/holyrobot_logo.png', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: ()=> {
                        // 用户确认分享后执行的回调函数
                        // alert('分享成功');
                    },
                    cancel: ()=> {
                        // alert('分享失败')
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareTimeline({
                    title: '竞界科技微专卖店', // 分享标题
                    desc:'旅游新零售，带你轻松玩转旅游社交电商圈', // 分享描述
                    link: window.location.href,
                    imgUrl: 'http://h5s.aipinzan.cn/file/icon/holyrobot_logo.png', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
        }
      }).catch((err)=>{
          console.log('获取微信js-sdk配置参数异常',err);
      });
      //路由切换页面到顶部
      window.scrollTo(0,0);
      // if(path.meta.requireAuth){
      //     let token=tools.getCookie('token');
      //     console.log('token===',token);
      //     if (token) {  // 判断当前的token是否存在
      //         next();
      //       }
      //       else {
      //         next({
      //           path: '/',
      //           query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      //         })
      //       }
      // }
      next();
  });
});
// 路由切换后
router.afterEach((to, from) => {
});


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
