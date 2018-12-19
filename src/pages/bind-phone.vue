<!--这是绑定手机页面-->
<template>
    <div class="bind-phone">
        <div class="bind-input-tel">
            <i></i>
            <input type="tel" placeholder="请输入手机号" v-model="tel">
        </div>
        <div class="bind-input-code">
            <i></i>
            <input type="tel" placeholder="请输入验证码" v-model="code">
            <button class="sendSmsBtn" :class="disabled?'dissendSmsBtn':''" type="button" @click="start" :disabled="disabled || time > 0">{{ text }}</button>
        </div>
        <p>
            <a href="javascript:;" @click="bindFun()">立即绑定</a>
        </p>
        <toast v-model="showTip" type="text">{{tipText}}</toast>
        <service></service>
    </div>
</template>
<script>
import service from '../components/service'
import tools from '../common/tools'
import { WechatBindmobile,sendMessage,checkCode,UserLoginByMobile,resetUserId } from '../services/index'
import { Toast } from 'vux'
export default {
    data(){
        return{
            orgId:'',
            // 发送验证码相关
            time: 0,
            disabled: false,
            second: 60,
            showTip:false,//提示框显隐
            tipText:'',//提示框文字
            tel:'',//手机号
            code:'',//验证码
            proid:'',//产品id
        }
    },
    methods: {
        // 开始获取验证码
        start() {
            if (this.judgeFirst() == false) {
                return;
            } else {
                this.time = this.second;
                console.log(this.disabled);
                this.timer();
                // 发送短信验证码
                let params = {
                    'phone': this.tel,
                };
                sendMessage(params).then(response => {
                    console.log(response);
                    if (response.meta.success == true) {
                        console.log("短信验证码获取成功");
                    } else {
                        console.log("短信验证码获取失败");
                    }
                });
            }
        },

        // 验证手机号
        judgeFirst(){
            if (tools.trim(this.tel) == "") {
                this.showTip=true;
                this.tipText="手机号码不能为空";
                return false;
            }
            let pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
            if (!pattern.test(this.tel)) {
                this.showTip=true;
                this.tipText="请输入正确的手机号码";
                return false;
            }
        },

        // 验证手机号是否绑定
        // checkTel(){
        //     let paramsTel={
        //         'mobile':this.tel
        //     }
        //     UserLoginByMobile(paramsTel).then(response => {
        //         console.log(response);
        //         if(response!=null){
        //             this.showTip=true;
        //             this.tipText="该手机号已绑定";
        //             return ;
        //         }
        //     });
        // },
        // 定时器
        timer() {
            if (this.time > 0) {
                this.time--;
                setTimeout(this.timer, 1000);
            } else {
                this.disabled = false;
            }
        },
        // 立即绑定
        bindFun(){
            if (this.judgeFirst() == false) {
                return;
            }
            if(this.code==""){
                this.showTip=true;
                this.tipText="请输入验证码";
                return;
            }
            let params1=this.tel;
            let params2=this.code;
            checkCode(params1,params2).then(response => {
                console.log(response);
                if (response.meta.success == true) {
                    console.log("验证码验证成功");
                    // 验证手机号
                    let paramsTel={
                        'mobile':this.tel
                    }
                    UserLoginByMobile(paramsTel).then(response => {
                        console.log(response);
                        // if(response!=null){
                        //     this.showTip=true;
                        //     this.tipText="该手机号已绑定";
                        //     return ;
                        // }
                        // else{
                            // 绑定
                            let paramsBind={
                                'openID':tools.getSessionStorage('openId'),
                                'mobile':this.tel,
                            }
                            WechatBindmobile(paramsBind).then(response => {
                                console.log(response);
                                if(response.ResultCode==2){
                                    this.showTip=true;
                                    this.tipText="绑定成功";
                                    if(response.User!=null){
                                        let paramsUser={
                                            'id':response.User.ID,
                                            'mobile':response.User.Mobile
                                        }
                                        resetUserId(paramsUser).then(response => {
                                            console.log(response);
                                        });
                                    }
                                    tools.setSessionStorage('mobile',this.tel);
                                    if(this.proid==1){
                                        this.$router.push('/mine'); 
                                    }
                                    else{
                                        this.$router.push('/group-selection/'+this.proid);
                                    }
                                }
                                else{
                                    this.showTip=true;
                                    this.tipText=response.Message;
                                }
                            });
                        // }
                    });
                } else {
                    this.showTip=true;
                    this.tipText=response.meta.message;
                    console.log("验证码验证失败");
                }
            });
        },
        bindInit(){
            this.orgId= tools.getLocalStorage('orgId');
            // 获取产品id
            this.proid=this.$route.params.id;
        }
    },
    mounted(){
        this.bindInit();
    },
    computed: {
        text: function() {
        return this.time > 0 ? this.time + "s 后重获取" : "获取验证码";
        }
    },
    components: {
      Toast,
      service
    },
}
</script>

<style lang="scss">
.bind-phone{
    padding-top: toRem(100px);
    background: #fff;
   .sendSmsBtn {
        height: toRem(30px);
        min-width: toRem(120px);
        line-height: toRem(30.5px);
        padding: 0 toRem(15px);
        border-radius: toRem(15px);
        border: toRem(1px) solid #ddd;
        color: #999;
        background: #fff;
        box-sizing: border-box;
        font-size: toRem(18px);
        margin-top: toRem(25px);
        float: right;
        outline: none;
        // &:disabled {
        //     color: #333;
        //     border: 1px solid #333;
        //     background: #fff;
        // }
    }
    // .sendSmsBtn.dissendSmsBtn {
    //     background-color: #ffe39f;
    // }
    .bind-input-tel{
        box-shadow: 0px toRem(10px) toRem(30px) 0px 
		rgba(0, 128, 255, 0.12);
	    border-radius: toRem(40px);
        margin: auto;
        line-height: toRem(80px);
        >i{
            display: inline-block;
            @include wh(toRem(26px),toRem(80px));
            background: url('../assets/images/phone.png') no-repeat center;
            background-size:toRem(26px),toRem(38px);
            margin-right: toRem(20px);
        }
    }
    .bind-input-code{
        margin: auto;
        margin-top: toRem(40px);
        margin-bottom: toRem(100px);
        >i{
            display: inline-block;
            @include wh(toRem(36px),toRem(80px));
            background: url('../assets/images/code.png') no-repeat center;
            background-size:toRem(36px) toRem(29px);
            margin-right: toRem(10px);
             vertical-align: middle;
        }
       
    }
    .bind-input-code,.bind-input-tel{
        @include wh(toRem(690px),toRem(80px));
        padding: 0 toRem(40px);
        box-sizing: border-box;
        font-size: 0;
        line-height: toRem(80px);
        >input{
            display: inline-block;
            width:toRem(300px);
            height: toRem(80px);
            vertical-align: top;
            box-sizing: border-box;
            @include sc(toRem(24px),#333);
            border: none;
            outline: none;
            -webkit-tap-highlight-color:rgba(255,0,0,0);
            &::placeholder{
                 @include sc(toRem(24px),#999);
            }
        }
    }
    >p{
        text-align: center;
        >a{
            display: inline-block;
            @include wh(toRem(690px),toRem(80px));
            background-image: $main-bg;
	        border-radius: toRem(40px);
            line-height: toRem(80px);
            @include sc(toRem(30px),#fff);
        }
    }
}
</style>

