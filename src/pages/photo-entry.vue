<!--这是信息填写页面-->
<template>
    <div class="photo-entry">
        <div class="tourist-information">
            <p>游客信息<a :href="'#/fill-information/'+proid">[手动录入]</a></p>
            <div>
                <p>可直接将游客信息拍照录入<span>(图片大小必须小于20M)</span></p>
                <ul v-for="img in imgUrls.length">
                    <li><img :src="imgUrls[img-1]" alt="" @click="clickImg($event)"><i @click="cancelImg(img)"></i></li>
                </ul>
                <div>
                    <img src="../assets/images/shangchuanyoukexinxi.png" alt="" >
                    <input accept="image/*" type="file" multiple  @change="onFileChange">
                </div>
            </div>
        </div>
        <div class="contact-information">
            <p>联系人信息</p>
            <div class="contact-name">
                <label for="">姓名</label>
                <input type="text" v-model="mainName" placeholder="与证件保持一致" @blur="identityNameFun(mainName)" >
                <p v-if="mainNameCon!=''">{{mainNameCon}}</p>
            </div>
            <div class="contact-tel">
                <label for="">手机号</label>
                <input  type="tel" placeholder="接收确认信息" v-model="mainTel" @blur="identityTelFun(mainTel)" >
                <p v-if="mainTelCon!=''">{{mainTelCon}}</p>
            </div>
        </div>
        <div class="note">
            <h2>因服务能力有限，请您核实以下情况，以免造成出行不便。</h2>
            <p>★ [ "您选择的航班仅支持小于80岁乘客预订" ]</p>
            <p>★ 18岁以下未成年人需要至少一名家长或成年旅客全程陪同</p>
            <p>★ 本产品不接受儿童按成人提交订单，敬请谅解。</p>
        </div>
         <div class="bottom-info">
            <div>
                总价<span>￥{{sumPrice}}</span>
                <a href="javascript:;" @click="checkPrice()">费用明细</a>
            </div>
            <a @click="addOrderFun()" v-if="isAck==1">立即支付</a>
            <a @click="addReserveFun()" v-if="isAck!=1">立即预定</a>
        </div>
        <div class="bottom-alert" v-if="priceShow==true">
            <h2>费用明细</h2>
            <div>
                <p v-for="policy in pricePolicyList" v-if="policy.count>0">{{policy.policyName}}<span v-if="policy.beforeDiscountDirectPrice==null">{{policy.count}}*￥{{policy.directPrice}}=￥{{mul(policy.count,policy.directPrice)}}</span><span v-if="policy.beforeDiscountDirectPrice!=null">{{policy.count}}*￥{{policy.beforeDiscountDirectPrice}}=￥{{mul(policy.count,policy.beforeDiscountDirectPrice)}}</span></p>
                <!-- <p v-for="policy in pricePolicyList" v-if="policy.count>0&&userType==1">{{policy.policyName}}<span>{{policy.count}}*{{policy.salesPrice}}={{policy.count*policy.salesPrice}}</span></p>
                <p v-for="policy in pricePolicyList" v-if="policy.count>0&&userType==2">{{policy.policyName}}<span>{{policy.count}}*{{policy.directPrice}}={{policy.count*policy.directPrice}}</span></p> -->
                <!-- <p v-if="singlePrice!=''&&userType==1">单房差<span>{{singlePrice}}</span></p>
                <p v-if="userType==2">单房差<span>{{singleRoomPrice}}</span></p> -->
                <p v-if="userType==1">返佣<span>￥{{rebateSum}}</span></p>
                <p v-if="discountPrice!=0">优惠<span>￥{{discountPrice}}</span></p>
            </div>
        </div>
        <div class="box" v-if="priceShow==true" @click="priceShow=false" @touchmove.prevent>
        </div>
        <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
        <toast v-model="showTip" type="text">{{tipText}}</toast>
        <div class="order-tip">
            <alert v-model="orderSubmitTip"  hide-on-blur> 
               <img src="../assets/images/custom-submit.png" alt="" v-if="submitState==true">
               <img src="../assets/images/submit-fail.png" alt="" v-if="submitState==false">
               <p v-if="submitState==true">订单提交成功！</p>
               <p v-if="submitState==false" class="fail">{{failTip}}！</p>
               <h2 v-if="submitState==true">需求单号：{{orderNo}}</h2>
               <h2 v-if="submitState==false">请核对信息重新提交</h2>
               <a v-if="submitState==true" href="#/order">查看订单</a>
            </alert>
        </div>
        <service></service>
    </div>
</template>
<script>
import Exif from 'exif-js'  
import service from '../components/service'
import BigImg from '../components/big-img'
import tools from '../common/tools'
import { getPrice,getPolicysList,addOrderInfo,uploadTourImg,newUploadTourImg } from '../services/index'
import { Alert,TransferDomDirective as TransferDom,Toast } from 'vux'  
export default {
    data(){
        return{
            priceShow:false,//费用明细的显隐
            showImg:false,//大图是否显示
            imgSrc: '',//大图路径
            takePictures:false,//上传图片模态框
            // content: {
            //     menu1:'拍照',
            //     menu2:'从相册选择'
            // },
            sumPrice:'',//总价
            pricePolicyList:[],//价格策略
            singlePrice:'',//ERP用户单房差
            singleRoomPrice:'',//C端单房差
            userType:'',//用户类型
            rebateSum:'',//返佣总价
            tourArr:[],//组合数组
            proid:'',//产品id
            countArr:[],//人数数组
            isAck:'',//产品是直售还是二次确认
            mainName:'',//联系人姓名
            mainNameCon:'',//联系人姓名提示
            mainTel:'',//联系人电话
            mainTelCon:'',//联系人电话提示
            policyIdArr:[],//价格策略id列表
            showTip:false,//提示框显隐
            tipText:'',//提示框内容
            imgUrls: [],
            imgData: {  
                accept: 'image/jpeg, image/png, image/jpg',  
            },
            orderSubmitTip:false,//订单提交提示框显隐
            submitState:true,//订单提交的状态
            orderNo:'',//订单号
            failTip:'',//提交错误提示
            isOutgoing:'',
            discountPrice:'',//优惠价格
            useDiscount:''
        }
    },
    methods: {
          // 加
        add(a, b) {
            var c, d, e;
            try {
                c = a.toString().split(".")[1].length;
            } catch (f) {
                c = 0;
            }
            try {
                d = b.toString().split(".")[1].length;
            } catch (f) {
                d = 0;
            }
            return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
        },
        // 减
        sub(a, b) {
            var c, d, e;
            try {
                c = a.toString().split(".")[1].length;
            } catch (f) {
                c = 0;
            }
            try {
                d = b.toString().split(".")[1].length;
            } catch (f) {
                d = 0;
            }
            return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
        },
        //乘
        mul(a, b) {
            var c = 0,
                d = a.toString(),
                e = b.toString();
            try {
                c += d.split(".")[1].length;
            } catch (f) {}
            try {
                c += e.split(".")[1].length;
            } catch (f) {}
            return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
        },
        // 除
        div(a, b) {
            var c, d, e = 0,
                f = 0;
            try {
                e = a.toString().split(".")[1].length;
            } catch (g) {}
            try {
                f = b.toString().split(".")[1].length;
            } catch (g) {}
            return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
        },
        click (key) {
            console.log(key)
        },
        // 费用明细
        checkPrice(){
            this.priceShow=!this.priceShow;
        },
        // 显示图片
        clickImg(e) {
            this.showImg = true;
            // 获取当前图片地址
            this.imgSrc = e.currentTarget.src;
        },
        // 隐藏图片
        viewImg(){
            this.showImg = false;
        },
        //联系人姓名失去焦点的时候验证
        identityNameFun(str){
            console.log(str);
            if(str==''){
                this.mainNameCon="姓名不能为空";
            }
            else{
                this.mainNameCon='';
            }
        },
        //联系人电话失去焦点的时候验证
        identityTelFun(str){
            let pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
            if(!pattern.test(str)&&str!=''){
                    this.mainTelCon="请输入正确的电话号码";
            }
            else if(str==''){
                this.mainTelCon="联系人手机号码不能为空";
            }
            else{
                    this.mainTelCon="";
            }
        },
         // 填写信息初始化
        photoEntryInit(){
            // 获取用户类型
            this.userType=tools.getLocalStorage('userType');
            this.isOutgoing=tools.getLocalStorage('isOutgoing');
            this.isAck=tools.getLocalStorage('isAck');
            this.proid=this.$route.params.id;
            this.countArr=JSON.parse(tools.getLocalStorage('countArr'));
            this.tourid=tools.getLocalStorage('tourid');
            let params=tools.getLocalStorage('key');
            this.useDiscount=tools.getLocalStorage('useDiscount');
            console.log(params);
            getPrice(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('总价格获取成功');
                    this.sumPrice=response.data.price;
                    this.discountPrice=response.data.discountPrice;
                    if(this.userType==1){
                        this.singlePrice=response.data.singleRoomPrice;
                    }
                    else if(this.userType==2){
                        this.singleRoomPrice=response.data.singleRoomPrice;
                    }
                }
                else{
                    console.log('总价格获取失败');
                }
            }).catch((err)=>{
                console.log('总价格接口异常报错',err);
                // this.$Message.info('总价格接口异常报错');
            });


            //价格策略接口请求参数
            let paramsPrice={
                'proid':this.proid,
                'tourDate':tools.getLocalStorage('selectedDay'),
                'siteid':tools.getSessionStorage('siteId'),
                'isOutgoing':tools.getLocalStorage('isOutgoing'),
                'tourid':tools.getLocalStorage('tourid'),
                'orgId':tools.getLocalStorage('orgIdw'),
            }
            // 价格策略接口绑定
            this.rebateSum=0;
            getPolicysList(paramsPrice).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('价格策略数据获取成功');
                    this.pricePolicyList=response.data[0].pricePolicyList;
                    if(this.pricePolicyList.length!=0){
                        for(let i=0;i<this.pricePolicyList.length;i++){
                            // 根据上页人数赋值
                            this.$set(this.pricePolicyList[i], 'count', this.countArr[i]);
                            this.policyIdArr.push(this.pricePolicyList[i].id);
                            if(this.userType==1){
                                this.rebateSum= this.add(this.mul(this.pricePolicyList[i].count,this.pricePolicyList[i].rebatePrice),this.rebateSum);
                            }
                        }
                        console.log('tourArr',this.tourArr);
                    }
                }
                else{
                    console.log('价格策略数据获取失败');
                }
            }).catch((err)=>{
                console.log('价格策略接口获取异常',err);
                // this.$Message.info('价格策略接口获取异常');
            });

        },
        // 无转码上传图片
        // onFileChange(){
        //     // let reader =new FileReader();  
        //     let form = new FormData(); 
        //     for(let i=0;i<event.target.files.length;i++){
        //         form.append('file',event.target.files[i],event.target.files[i].name); 
        //     }
        //     uploadTourImg(form).then((response)=>{
        //         console.log(response);
        //         if(response.meta.success==true){
        //             console.log('图片上传成功');
        //             for(let i=0;i<response.data.img.length;i++){
        //                 this.imgUrls.push(response.data.img[i]);
        //             }
        //         }
        //         else{
        //             console.log('图片上传失败');
        //         }
        //     })
        // },
        // 删除图片
        cancelImg(img){
            let i=img-1;
            this.imgUrls.splice(i,1);
        },
        //判断联系人信息是否填写
        judgePersonIsCorrect(obj) {
           if(tools.isUndefinedOrNull(obj)){
               return false;
           }
           if(tools.trim(obj.mainName) == ''){
               this.mainNameCon = '姓名不能为空';
               return false;
           }
           if(tools.trim(obj.mainTel) == '') {
               this.mainTelCon = '手机号码不能为空';
               return false;
           }
            let pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
           if(!pattern.test(obj.mainTel)){
                this.mainTelCon="请输入正确的电话号码";
                return false;
           } 
       },
        // 提交订单
        addOrderFun(){
            let _obj = {};
            _obj.mainName = this.mainName;
            _obj.mainTel = this.mainTel;
            if(this.judgePersonIsCorrect(_obj)==false){
                return ;
            }
            let single='';
            if(this.userType==1){
                single=this.singlePrice;
            }
            else if(this.userType==2){
                single=this.singleRoomPrice;
            }
            if(this.imgUrls.length==0){
                this.showTip=true;
                this.tipText="请先上传图片";
                return;
            }
            //要传参数
            let params={
                'siteid':tools.getSessionStorage('siteId'),
                'isOutgoing':tools.getLocalStorage('isOutgoing'),
                'orgId':tools.getLocalStorage('orgIdw'),
                //有关联系人
               'mainName':this.mainName,
               'mainTel':this.mainTel,
               'remark':this.note,
                // 有关旅客
                'tourImgs':this.imgUrls,
                // 其他重要信息   
               'proid':this.$route.params.id,
               'tourid':this.tourid,
               'policyid':this.policyIdArr,
               'num':this.countArr,
               'departure':tools.getLocalStorage('departure'),
               'totalprice':this.sumPrice,
               'singleroomprice':single,
                'useDiscount':this.useDiscount  
            };
            addOrderInfo(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('添加旅客信息成功');
                    // 存订单号
                    tools.setLocalStorage('orderNo',response.data.orderNo);
                    // parent.location.href='http://h5.aipinzan.cn/PayApi/WxPay.aspx?orderId='+ response.data.orderId+'&redirect_url=http://h5.aipinzan.net:9091/payApi/payCallback';
                    // this.orderNo=response.data.orderNo;
                    // this.orderSubmitTip=true;
                    // this.submitState=true;

                    if(this.userType==1){
                        this.orderNo=response.data.orderNo;
                        this.orderSubmitTip=true;
                        this.submitState=true;
                    }
                    if(this.userType==2){
                        this.$router.push('/payment/'+response.data.orderId+'/'+tools.getLocalStorage('orgId'));
                    }
                }
                else{
                    console.log('添加旅客信息失败');
                    this.submitState=false;
                    this.orderSubmitTip=true;
                    this.failTip=response.meta.message;
                }
            }).catch((err)=>{
                console.log('添加旅客信息接口获取失败',err);
                // this.$Message.info('添加旅客信息接口获取失败');
            });
        },
        // 立即预定
        addReserveFun(){
            let _obj = {};
            _obj.mainName = this.mainName;
            _obj.mainTel = this.mainTel;
            if(this.judgePersonIsCorrect(_obj)==false){
                return ;
            }
            let single='';
            if(this.userType==1){
                single=this.singlePrice;
            }
            else if(this.userType==2){
                single=this.singleRoomPrice;
            }
            if(this.imgUrls.length==0){
                this.showTip=true;
                this.tipText="请先上传图片";
                return;
            }
            //要传参数
            let params={
                'siteid':tools.getSessionStorage('siteId'),
                'isOutgoing':tools.getLocalStorage('isOutgoing'),
                'orgId':tools.getLocalStorage('orgIdw'),
                //有关联系人
                'mainName':this.mainName,
                'mainTel':this.mainTel,
                'remark':this.note,
                //有关旅客
                'tourImgs':this.imgUrls,
                // 其他重要信息   
                'proid':this.$route.params.id,
                'tourid':this.tourid,
                'policyid':this.policyIdArr,
                'num':this.countArr,
                'departure':tools.getLocalStorage('departure'),
                'totalprice':this.sumPrice,
                'singleroomprice':single,
                'useDiscount':this.useDiscount
            };
            addOrderInfo(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('添加旅客信息成功');
                    // 存订单号
                    tools.setLocalStorage('orderNo',response.data.orderNo);
                    this.orderNo=response.data.orderNo;
                    this.orderSubmitTip=true;
                    this.submitState=true;
                }
                else{
                    console.log('添加旅客信息失败');
                    this.submitState=false;
                    this.orderSubmitTip=true;
                    this.failTip=response.meta.message;
                }
            }).catch((err)=>{
                console.log('添加旅客信息接口获取失败',err);
                // this.$Message.info('添加旅客信息接口获取失败');
            });
        },

        // base64转码上传图片
        onFileChange (e) {  
            let files = e.target.files || e.dataTransfer.files;  
            let dataString = '';
            if (!files.length) return;  
            for(let i=0; i<files.length;i++){
                console.log(files[i].size,'图片大小');
                if(files[i].size>20*1024*1024){
                    this.showTip=true;
                    if(i>0){
                        this.tipText="第"+(i+1)+"个图片过大，请重新上传"; 
                    }
                    else{
                        this.tipText="图片大小建议20M内，请重新上传图片！"; 
                    }
                    continue;
                }
                this.imgPreview (files[i]);
            } 
            e.target.value='';
        },  
        imgPreview (file) {  
            let self = this;  
            let Orientation;  
            //去获取拍照时的信息，解决拍出来的照片旋转问题  
            Exif.getData(file, function(){  
                Orientation = Exif.getTag(this, 'Orientation');  
            });  
            // 看支持不支持FileReader  
            if (!file || !window.FileReader) return;  
    
            if (/^image/.test(file.type)) {  
                // 创建一个reader  
                let reader = new FileReader();  
                // 将图片2将转成 base64 格式  
                reader.readAsDataURL(file);  
                // 读取成功后的回调  
                reader.onloadend = function () {  
                    let result = this.result;  
                    let img = new Image();  
                    img.src = result; 
                    let data={
                            'imgForm':this.result
                        } 
                    self.postImg(data); 
                }   
            }  
        }, 
        // 调用上传图片的接口 
        postImg (form) {  
            newUploadTourImg(form).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('图片上传成功');
                    for(let i=0;i<response.data.img.length;i++){
                        this.imgUrls.push(response.data.img[i]);
                    }
                }
                else{
                    console.log('图片上传失败');
                }
            })
        },    
    },
    beforeRouteLeave(to, from, next) {
        // to是指要去的，from是指当前的
        if (to.path.indexOf("fill-information")>0) {
            to.meta.keepAlive = true;
        } else {
            to.meta.keepAlive = false;
        }
        next();
    },
    mounted(){
        this.photoEntryInit();
    },
    components: {
      BigImg,
      Toast,
      Alert,
      service
    },
}
</script>

<style lang="scss"> 
.order-tip{
    .weui-dialog{
        border-radius: toRem(10px);
        max-width:toRem(690px);
        width:90%;
    }
    .weui-dialog__ft,.weui-dialog__hd{
        display: none;
    }
    .weui-dialog__bd{
        padding: toRem(20px) 0 toRem(40px) 0;
        >img{
            @include wh(toRem(200px),toRem(168px));
            margin-bottom: toRem(40px);
        }
        >p{
            @include sc(toRem(26px),$main-color);
            &.fail{
               @include sc(toRem(26px),#e6182d); 
            }
        }
        >h2{
            @include sc(toRem(26px),#999); 
            line-height: toRem(26px);
            margin: toRem(20px) 0 toRem(40px) 0;
        }
        >a{
            display: inline-block;
            background-image: $main-bg;
	        border-radius: toRem(10px);
            width:toRem(220px);
            height: toRem(60px);
            line-height: toRem(60px);
            @include sc(toRem(24px),#fff);
        }
    }
}
.photo-entry{
    background: #f4f4f4;
    padding-bottom: toRem(98px);
    min-height: calc(100vh - #{toRem(80px)});
    box-sizing: border-box;
    >div{
        background: #fff;
    }
    .contact-information{
        // padding: toRem(40px) toRem(30px);
        margin-bottom: toRem(20px);
        >p{
            // @include sc(toRem(30px),#18191a);
            // line-height: toRem(30px);
            height: toRem(74px); 
            border-bottom:1px solid #e1e1e1;
            @include sc(toRem(32px),#333);
            line-height: toRem(73px);
            padding-left: toRem(22px);
            &::before{
                content: '';
                display: inline-block;
                @include wh(toRem(4px),toRem(19px));
                background:$main-color; 
                margin-right: toRem(16px);
            }
        }
        >div{
            border-bottom:1px solid #ddd;
            font-size: 0;
            padding: toRem(30px);
            >label{
                @include sc(toRem(26px),#666);  
                display: inline-block;
                width: toRem(100px);
                margin-right: toRem(40px);
            }
            >input{
                -webkit-tap-highlight-color:rgba(255,0,0,0);
                width:toRem(530px);
                @include sc(toRem(24px),#333); 
                outline: none;
                border:none;
                &::placeholder{
                    @include sc(toRem(24px),#999);  
                }
            }
            >p{
                @include sc(toRem(20px),red);
                margin-left: toRem(140px);
                margin-top: toRem(10px);
            }
            &:last-child{
                border-bottom: none;
            }
        }
    }
    .tourist-information{
        padding: toRem(22px) 0 toRem(190px) 0;
        margin-bottom: toRem(20px);
        >p{
            @include sc(toRem(32px),#18191a);
            line-height: toRem(30px);
            padding-bottom: toRem(23px);
            padding-left: toRem(22px);
            padding-right: toRem(30px);
            border-bottom:1px solid #e1e1e1;
            margin-bottom: toRem(20px);
            >a{
                float: right;
                @include sc(toRem(28px),#0080ff);
                -webkit-tap-highlight-color:rgba(255,0,0,0);
            }
            &::before{
                content: '';
                display: inline-block;
                @include wh(toRem(4px),toRem(19px));
                background:$main-color; 
                margin-right: toRem(16px);
            }
        }
        >div{
            font-size: 0;
            padding-left: toRem(22px);
            padding-right: toRem(30px);
            >p{
                @include sc(toRem(24px),#333);
                >span{
                   @include sc(toRem(22px),#7d7d7d); 
                }
                margin-bottom: toRem(15px);
            }
            >ul{
                display: inline-block;
                >li{
                    float: left;
                    margin-right: toRem(20px);
                    margin-bottom: toRem(20px);
                    @include wh(toRem(140px),toRem(140px));
                    position: relative;
                    >img{
                        @include wh(toRem(140px),toRem(140px));
                    }
                    i{
                        position: absolute;
                        @include wh(toRem(40px),toRem(40px));
                        background:transparent url('../assets/images/cancel.png') no-repeat center;
                        background-size: toRem(30px) toRem(30px);
                        display: inline-block;
                        top:toRem(-18px);
                        right:toRem(-15px);
                    }
                }
            }
            >div{
                display: inline-block;
                @include wh(toRem(140px),toRem(140px));
                vertical-align: top;
                position: relative;
                >img{
                    @include wh(toRem(140px),toRem(140px));
                    display: inline-block;
                }
                >input{
                    -webkit-tap-highlight-color:rgba(255,0,0,0);
                    position: absolute;
                    left:0;
                    bottom:0;
                    @include wh(toRem(140px),toRem(140px));
                    opacity: 0;
                }
            }
        }
    }
    .note{
        padding: toRem(40px) toRem(30px) toRem(140px) toRem(30px);
        margin-bottom: toRem(20px);
        >h2{
            @include sc(toRem(22px),#575757);
            margin-bottom: toRem(5px);
        }
        >p{
            @include sc(toRem(19px),#575757);
            margin-bottom:toRem(2px);
        }
    }
    .bottom-info{
        height: toRem(98px);
        width:100%;
        box-shadow: 0px toRem(-4px) toRem(8px) 0px rgba(0, 0, 0, 0.2);
        border-radius: toRem(22px) toRem(22px) 0px 0px;
        position: fixed;
        bottom:0;
        width:100%;
        z-index: 101;
        margin-bottom: 0;
        >div{
            display: inline-block;
            line-height: toRem(98px);
            @include sc(toRem(24px),#333);
            padding-left: toRem(20px);
            width: calc(100% - #{toRem(300px)});
            >span{
                @include sc(toRem(36px),#ffa100);
            }
            >a{
                float: right;
                @include sc(toRem(24px),$main-color);
               padding-right: toRem(10px);
                -webkit-tap-highlight-color:rgba(255,0,0,0);
            }
        }
        >a{
            width:toRem(280px);
            height: toRem(98px);
            line-height: toRem(98px);
            float:right;
            display: inline-block;
            @include sc(toRem(30px),#fff);
            background-color: $main-color;
	        border-radius: 0px toRem(22px) 0px 0px;
            text-align: center;
            -webkit-tap-highlight-color:rgba(255,0,0,0);
        }
    }
    .bottom-alert{
        position: fixed;
        z-index: 100;
        bottom:toRem(98px);
        width:100%;
        margin-bottom: 0;
        >h2{
            @include sc(toRem(30px),#18191a);
            margin-left: toRem(20px);
            border-bottom:1px solid #18191a;
            line-height: toRem(30px);
            padding: toRem(40px) 0 toRem(18px) 0;
        }
        >div{
            padding:toRem(20px) toRem(24px) toRem(40px);
            >p{
               @include sc(toRem(26px),#18191a); 
               line-height: toRem(50px);
               >span{
                   float: right;
                   @include sc(toRem(26px),#ffa100);
               }
            }
        }
    }
    .box{
        position: fixed;
        height:calc(100vh - #{toRem(110px)});
        width:100%;
        top:0;
        left:0;
        opacity: .6;
        background: #000;
        // z-index: 1;
    }
}
</style>

