<!--这是信息填写页面-->
<template>
    <div class="fill-information">
        <div class="tourist-information">
            <p>游客信息<span class="fill" @click="toFill"><img v-if="false" src="../assets/images/xiangqing.png" alt=""></span><a :href="'#/photo-entry/'+proid">[拍照录入]</a>
            </p>
        </div>
        <div class="tourist-information-list">
            <div v-for="(tour,index) in tourArr">
                <div class="ticket-tip">
                    <label for="">票种</label>
                    <span>{{tour.name}}</span>
                    <a href="javascript:;" @click="clearTour(tourArr,index)">清空</a>
                </div>
                <div>
                    <label for="">姓名</label>
                    <input type="text" v-model="tour.personalName"  placeholder="与证件保持一致" @blur="nameListFun(tour,index)">
                    <p v-if="tour.isNameShow">{{tour.tipNameText}}</p>
                </div>
                <div>
                    <label for="">手机号</label>
                    <input type="tel" v-model.trim="tour.personalTel"  placeholder="接收确认信息" @blur="telListFun(tour,index)">
                    <p v-if="tour.isTelShow">{{tour.tipTelText}}</p>
                </div>
                <div class="tourist-card-con">
                    <!-- <popup-picker :data="cardList" v-model="card" @on-show="onShow" @on-hide="onHide" @on-change="onChange" ></popup-picker> -->
                    <!-- <i :class="openCity==true?'active':''"></i> -->
                    <div class="card-select">
                        <select v-model="tour.sfId" @input="seFun(tour,_in)">
                            <option v-for="(cd,_in) in cardList" :value ="cd.value">{{cd.label}}</option>
                        </select>
                        <i></i>
                    </div>
                    <input class="tourist-card" v-model.trim="tour.personalCard" type="text" placeholder="与证件保持一致" @blur="cardListFun(tour,index)">
                    <p v-if="tour.isCardShow">{{tour.tipCardText}}</p>
                </div>
                <div>
                    <label for="">年龄</label>
                    <input type="tel" v-model="tour.personalAge"  placeholder="接收确认信息" @blur="telListFun(tour,index)">
                    <p v-if="tour.isAgeShow">{{tour.tipAgeText}}</p>
                </div>
                <div class="tourist-sex">
                    <label for="">性别</label>
                    <p class="sex"><a href="javascript:;" :class="tour.sex=='男'?'active':''" @click="tour.sex='男'">男</a><a href="javascript:;"  @click="tour.sex='女'" :class="tour.sex=='女'?'active':''">女</a></p>
                </div>
                <div class="tourist-venue" @click="venueFun()">
                    <label for="">接送设置</label>
                    <!-- <group>
                        <selector v-model="value1"  :options="list"></selector>
                    </group> -->
                    <select class="tourist-set" v-model="tour.venueIndex" @change="selectVenues(tour,index)" v-if="proTourVenues.length!=0">
                        <option v-for="(card,_index) in proTourVenues" :value="card.id" :key="_index" >{{ card.venue}}
                        </Option>
                    </select>
                    <i></i>
                </div>
                <div class="tourist-room">
                    <label for="">单房差</label>
                    <p class="sex"><a href="javascript:;" :class="tour.isSingleRoom==2?'active':''" @click="reduceSingle(tour,index,tourArr)">否</a><a href="javascript:;" :class="tour.isSingleRoom==1?'active':''"  @click="chooseSingle(tour,index,tourArr)">是</a></p>
                </div>
                <div class="tourist-contact">
                    <label for="">是否联系人</label>
                    <p class="sex"><a href="javascript:;" :class="tour.isContact==2?'active':''" @click="tour.isContact=2">否</a><a href="javascript:;" :class="tour.isContact==1?'active':''" @click="chooseContact(tour,index,tourArr)">是</a></p>
                </div>
            </div>
        </div>
        <div class="contact-information">
            <p>联系人信息</p>
            <div class="contact-name">
                <label for="">姓名</label>
                <!-- @blur="identityNameFun(mainName)" -->
                <input type="text" v-model="mainName" placeholder="与证件保持一致">
                <p v-if="mainNameCon!=''">{{mainNameCon}}</p>
            </div>
            <div class="contact-tel">
                <label for="">手机号</label>
                <!-- @blur="identityTelFun(mainTel)" -->
                <input  type="tel" placeholder="接收确认信息" v-model="mainTel">
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
                <!-- <p v-for="policy in pricePolicyList" v-if="policy.count>0&&userType==1">{{policy.policyName}}<span>{{policy.count}}*{{policy.salesPrice}}={{mul(policy.count,policy.salesPrice)}}</span></p>
                <p v-for="policy in pricePolicyList" v-if="policy.count>0&&userType==2">{{policy.policyName}}<span>{{policy.count}}*{{policy.directPrice}}={{mul(policy.count,policy.directPrice)}}</span></p> -->
                <!-- <p v-if="singlePrice!=''&&userType==1">单房差<span>{{singlePrice}}</span></p> -->
                <p>单房差<span>￥{{singleRoomPrice}}</span></p>
                <p v-if="userType==1">返佣<span>￥{{rebateSum}}</span></p>
                <div class="venue-price" v-if="venueList.length!=0">接送费用
                    <div>
                        <p v-for="(ven,index) in venueList" v-if="ven.venue!='请选择'">{{ven.venue}}：{{ven.index}}*￥{{ven.dropoffprice+ven.shuttleprice}}</p>
                    </div>
                </div>
                <p v-if="discountPrice!=0">优惠<span>￥{{discountPrice}}</span></p>
            </div>
        </div>
        <div class="box" v-if="priceShow==true" @click="priceShow=false" @touchmove.prevent>
        </div>
        <toast v-model="showTip" type="text">{{tipText}}</toast>
        <div class="order-tip">
            <alert v-model="orderSubmitTip"  hide-on-blur> 
               <img src="../assets/images/custom-submit.png" alt="" v-if="submitState==true">
               <img src="../assets/images/submit-fail.png" alt="" v-if="submitState==false">
               <p v-if="submitState==true">订单提交成功！</p>
               <p v-if="submitState==false" class="fail">{{failTip}}！</p>
               <h2 v-if="submitState==true">订单号：{{orderNo}}</h2>
               <h2 v-if="submitState==false">请核对信息后重新提交</h2>
               <a v-if="submitState==true" href="#/order">查看订单</a>
            </alert>
        </div>
        <service></service>
    </div>
</template>
<script>
import tools from '../common/tools'
import service from '../components/service'
import { getPrice,getPolicysList,getVenue,addOrderInfo } from '../services/index'
import { XInput,Group,PopupPicker,Selector,Toast,Alert,TransferDomDirective as TransferDom } from 'vux'
import { log } from 'util';
export default {
    data(){
        return{
            priceShow:false,//费用明细的显隐
            // venueIndex:1,
            sum:'',//从接口里获取的总价
            sumPrice:'',//总价
            pricePolicyList:[],//价格策略
            // singlePrice:'',//ERP用户单房差
            singleRoomPrice:'',//C端单房差
            userType:'',//用户类型
            rebateSum:'',//返佣总价
            tourArr:[],//组合数组
            proid:'',//产品id
            countArr:[],//人数数组
            proTourVenues:[],//接送设置
            cardList: [
                {
                    value: '身份证',
                    label: '身份证'
                },
                {
                    value: '护照',
                    label: '护照'
                },
                {
                    value: '回乡证',
                    label: '回乡证'
                },
                {
                    value: '军官证',
                    label: '军官证'
                },
                {
                    value: '其他',
                    label: '其他'
                },
            ],//身份证等证件列表
            mainName:'',//联系人姓名
            mainNameCon:'',//联系人姓名提示
            mainTel:'',//联系人电话
            mainTelCon:'',//联系人电话提示
            isAck:'',//产品是直售还是二次确认
            nameList:[],//旅客姓名列表
            codeList:[],//旅客身份证列表
            telList:[],//旅客联系方式列表
            ageList:[],//旅客年龄列表
            sfIdArray:[],//上传身份证的id数组
            policyIdList:[],//旅客价格策略列表
            venueidList:[],//游客接送地点id
            singleRoomList:[],//旅客单房差列表
            sexList:[],//旅客性别列表
            tourid:'',//选择的团期id
            note:'',//备注
            showTip:false,//提示框显隐
            tipText:'',//提示框内容
            policyIdArr:[],

            orderSubmitTip:false,//订单提交提示框显隐
            submitState:true,//订单提交的状态
            orderNo:'',//订单号
            failTip:'',//提交错误提示
            venueTotalPrice:0,//接送设置总价
            venueList:[],//接送设置组合
            median:[],//保存接送设置的中间值 
            flag:false,//为true提交订单
            submitFlag:1,//是否可以提交
            submitFailTip:'',//提交失败提示
            singleInit:'',//
            saleName:'',
            saleID:'',
            deptID:'',
            deptName:'',
            isOutgoing:'',
            discountPrice:'',//总优惠金额
            useDiscount:'',//
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
        // 去填写说明页
        toFill(){
            this.$router.push('/fill-explain');
        },
        // popup框显示
        onShow () {
            console.log('on show');
            this.openCity=!this.openCity;
        },
        //popup框隐藏
        onHide (type) {
            console.log('on hide', type);
             this.openCity=!this.openCity;
        },
        //popup框值改变
        onChange (val) {
            console.log('val change', val)
        },
         // 费用明细
        checkPrice(){
            this.priceShow=!this.priceShow;
        },
        // 选择单房差
        chooseSingle(tour,index,tourArr){
            tour.isSingleRoom=1;
            this.singleRoomPrice=0;
            for(let i=0;i<tourArr.length;i++){
                if(tourArr[i].isSingleRoom==1){
                    this.singleRoomPrice+=tourArr[i].single;
                }
            }
            this.sumTotalPrice();
        },
        // 减少选择的单房差
        reduceSingle(tour,index,tourArr){
            tour.isSingleRoom=2;
            this.singleRoomPrice=0;
            for(let i=0;i<tourArr.length;i++){
                if(tourArr[i].isSingleRoom==1){
                    this.singleRoomPrice+=tourArr[i].single;
                }
            }
            // if(this.singleRoomPrice==0){
            //     let sumPeople=0;
            //     for(let i=0;i<this.pricePolicyList.length;i++){
            //         if(this.pricePolicyList[i].touristType==1){
            //             sumPeople+=this.pricePolicyList[i].count;
            //         }
            //     }
            //     if(sumPeople%2==0){
            //             this.singleRoomPrice=0;
            //     }
            //     else {
            //            this.singleRoomPrice=this.singleInit;
            //     }
            // }
            this.sumTotalPrice();
        },
        // 联系人姓名同步游客第一个人
        // syncTourName(){
        //     this.tourArr[0].personalName=this.mainName;
        // },
        // 联系人电话同步游客第一个人
        // syncTourTel(){
        //     this.tourArr[0].personalTel=this.mainTel;
        // },
        //联系人姓名失去焦点的时候验证
        // identityNameFun(str){
        //     console.log(str);
        //     if(str==''){
        //         this.mainNameCon="姓名不能为空";
        //     }
        //     else{
        //         this.mainNameCon='';
        //     }
        // },
        //联系人电话失去焦点的时候验证
        // identityTelFun(str){
        //     let pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
        //     if(!pattern.test(str)&&str!=''){
        //             this.mainTelCon="请输入正确的电话号码";
        //     }
        //     else if(str==''){
        //         this.mainTelCon="联系人手机号码不能为空";
        //     }
        //     else{
        //             this.mainTelCon="";
        //     }
        // },
         //选择接送设置
        selectVenues(tour,index) {
            console.log('当前旅客',tour);
            this.venueList=[];
            // 选择接送设置时的一些效果
            for(let i = 0;i<this.tourArr.length;i++){
                for(let j=0;j<this.proTourVenues.length;j++){
                    if(this.tourArr[index].venueIndex==this.proTourVenues[j].id){
                        console.log('接送',this.proTourVenues[j]);
                        if(this.tourArr[i].venueIndex ==1  && i != index){
                            this.tourArr[i].venueIndex = tour.venueIndex;
                            this.tourArr[i].venue = this.proTourVenues[j];
                        }
                        this.tourArr[index].venue=this.proTourVenues[j];
                    }
                }
                this.median.unshift(tour);
                // debugger;
            }
        
            // 组合每个接送设置类型的个数
            for(let v=0;v<this.proTourVenues.length;v++){
                this.proTourVenues[v].venue;
                 let num =  0;
                for(let k=0 ;k<this.tourArr.length;k++){
                    if(this.proTourVenues[v].venue==this.tourArr[k].venue.venue && this.tourArr[k].seat){
                        num++;
                    }
                    if(k==this.tourArr.length-1){
                        this.venueList.push({
                            'venue':this.proTourVenues[v].venue,
                            'index':num,
                            'dropoffprice':this.proTourVenues[v].dropoffprice,
                            'shuttleprice':this.proTourVenues[v].shuttleprice,
                        })    
                    }
                }
            }
            // 计算总价
            this.sumTotalPrice();
        },
        venueFun(){
            if(this.proTourVenues.length==0){
                this.showTip=true;
                this.tipText="暂无接送设置~";
            }
        },
        //证件类型选择变化清除提示    
        seFun(tour,index){
             tour.tipCardText=''; 
        },
        //旅客姓名列表判断
        nameListFun(tour,index){
           console.log('旅客姓名',tour.personalName);
            if(!tour.personalName){
                tour.tipNameText="游客姓名不能为空";
                this.$set(tour,'isNameShow',true);
            }else{
                tour.tipNameText='';
                this.$set(tour,'isNameShow',false);
            }
            if(tour.isContact==1){
                this.mainName=tour.personalName;
            }
         },
       //旅客联系电话判断
        telListFun(tour,index){
            let pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
            if(!pattern.test(tour.personalTel)&&tour.personalTel!=''){
                    tour.tipTelText="请输入正确的手机号码";
                    this.$set(tour,'isTelShow',true);
            }
            else{
                this.$set(tour,'isTelShow',false);
            }
            if(tour.isContact==1){
                this.mainTel=tour.personalTel;
            }
       },
       //旅客身份证列表判断
        cardListFun(tour,index){
           let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/; 
           if(!reg.test(tour.personalCard)&&(tour.personalCard!=''||tour.personalCard!=undefined)&&tour.sfId=="身份证"){
               tour.tipCardText="游客身份证信息不合法";
               this.$set(tour,'isCardShow',true);
               tour.personalAge='';
               return;
               console.log(!tour.personalCard);
           }
           else if(tour.personalCard==''&&tour.sfId=="身份证"){
               tour.tipCardText="游客身份证信息不能为空";
               this.$set(tour,'isCardShow',true);
           }else{
               this.$set(tour,'isCardShow',false);
                tour.tipCardText="";
           }

            // 获取年龄
            if(tour.sfId == "身份证" && tour.personalCard!='' && tour.personalCard.length==18){
                 // 获取性别
                if (parseInt(tour.personalCard.substr(16, 1)) % 2 == 1) {
                    tour.sex="男";
                } else {
                    tour.sex="女";
                }
                var myDate = new Date();
                var month = myDate.getMonth() + 1;
                var day = myDate.getDate();
                var age = myDate.getFullYear() - tour.personalCard.substring(6, 10) - 1;
                if (tour.personalCard.substring(10, 12) < month || tour.personalCard.substring(10, 12) == month && tour.personalCard.substring(12, 14) <= day) {
                    age++;
                }
                if(age<0){
                    tour.tipCardText="旅客身份证信息不合法";
                    this.$set(tour, "isCardShow", true);
                    tour.personalAge='';
                }
                if(age==0){
                    tour.personalAge==1;
                }
                if(age>0){
                    tour.personalAge=age;
                }
            } 
        //    console.log(tour.tipCardText);
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
                this.mainTelCon="请输入正确的手机号码";
                return false;
           } 
       },
       //判断旅客信息的值填写的是否正确
        judgeGuestIsCorrect(array) {
            console.log(array);
            let objArr = []; 
            // 如果空的数量=数组的数量   弹出提示填写手机号，
            // 如果空的数量小于数组的数量，则进行手机号码验证。
            // 验证根据，isHave="1" 则进行验证，=0不验证
            let phoneNum = 0;
            array.forEach((item,index) => {
                console.log(item,index);
                let objIndex ={};
                if(item.personalTel=='' || tools.isUndefinedOrNull(item.personalTel)){
                    objIndex['isHave'] = '0';
                    objIndex['index'] = index;
                    objArr.push(objIndex);
                    phoneNum = phoneNum+1;
                } else{
                    objIndex['isHave'] = '1';
                    objIndex['index'] = index;
                    objArr.push(objIndex);
                }
                // console.log(objArr,'11111111111-------------',phoneNum);
            });

            // 对游客信息进行校验
            for(var i = 0;i<array.length;i++){
                if(array[i].isCardShow==true){
                    this.flag = false;
                    break;
                }
                else{
                    this.flag = true;
                }
               //姓名
               if(tools.isUndefinedOrNull(array[i].personalName) || tools.trim(array[i].personalName) == ''){
                    array[i].isNameShow = true;
                    array[i].tipNameText = '游客姓名不能为空';
                    this.flag = false;
                    break;
                } else{
                    this.flag = true;
                }
                //证件类型
                let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/; 
                if(array[i].sfId == "身份证"){
                     if(tools.isUndefinedOrNull(array[i].personalCard) || tools.trim(array[i].personalCard) == ''){
                        array[i].isCardShow = true;
                        array[i].tipCardText = '身份证不能为空';
                        this.flag = false;
                        break;
                    } else{
                        this.flag = true;
                    }
                }
                if(array[i].personalCard !="" && !tools.isUndefinedOrNull(array[i].personalCard)){
                    if ((parseInt(array[i].personalCard.substr(16, 1)) % 2 == 1&&array[i].sex=="女") || (parseInt(array[i].personalCard.substr(16, 1)) % 2 == 0&&array[i].sex=="男")) {
                        this.tipText="身份证与性别不符";
                        this.showTip=true;
                        this.flag = false;
                        break;
                      } else{
                        this.flag = true;
                    }
                } 
                if(!reg.test(array[i].personalCard)&&array[i].sfId=="身份证"){
                    array[i].isCardShow = true;
                    array[i].tipCardText="游客身份证信息不合法";
                    // array[i].personalAge='';
                    this.flag = false;
                    break;
                } else{
                    this.flag = true;
                }

                // 身份证重复验证
                if (i !== array.length - 1) {
                    for (var j = i ; j < array.length; j++) {
                        if (i!=j && array[i].personalCard == array[j].personalCard) {
                        array[i].isCardShow = true;
                        array[i].tipCardText = "证件号不能重复";
                        this.flag = false;
                        break;
                        }
                        else{
                        this.flag = true;
                        }
                    }
                    if(this.flag == false){
                        break;
                    }
                }
                //手机号码
                if(phoneNum<array.length){
                    if(objArr[i].isHave=='1'){
                        console.log('判断手机号码');
                        let pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
                        if(!pattern.test(array[i].personalTel)){
                            array[i].isTelShow = true;
                            array[i].tipTelText="请输入正确的手机号码";
                            this.flag = false;
                            break;
                        } else{
                            this.flag = true;
                        }
                    }
                } else{
                    array[i].isTelShow = true;
                    array[i].tipTelText = '请您填写任意游客的手机号';
                    console.log('全部为空');
                    this.flag = false;
                    break;
                }
            }
        },
        // 清空指定联系人信息
        clearTour(tourArr,index){
            this.tourArr[index].personalName='';
            this.tourArr[index].personalTel='';
            this.tourArr[index].personalAge='';
            this.tourArr[index].personalCard='';
            this.tourArr[index].isSingleRoom=2;
            this.tourArr[index].isContact=2;
            this.tourArr[index].sfId="身份证";
            this.tourArr[index].sex="男";
            this.tourArr[index].venueIndex=1;
            this.tourArr[index].isNameShow=false;
            this.tourArr[index].isCardShow=false;
            this.tourArr[index].isTelShow=false;
            this.tourArr[index].isAgeShow=false;
            this.tourArr[index].tipNameText='';
            this.tourArr[index].tipCardText='';
            this.tourArr[index].tipTelText='';
            this.tourArr[index].tipAgeText='';
        },
        // 填写信息初始化
        fillInfoInit(){
            this.saleName=tools.getSessionStorage('saleName')?tools.getSessionStorage('saleName'):'';
            this.saleID=tools.getSessionStorage('saleID')?tools.getSessionStorage('saleID'):'';
            this.deptID=tools.getSessionStorage('deptID')?tools.getSessionStorage('deptID'):'';
            this.deptName=tools.getSessionStorage('deptName')?tools.getSessionStorage('deptName'):'';
            // 获取用户类型
            this.userType=tools.getLocalStorage('userType');
            this.isOutgoing=tools.getLocalStorage('isOutgoing');
            this.useDiscount=tools.getLocalStorage('useDiscount');
            this.isAck=tools.getLocalStorage('isAck');
            this.proid=this.$route.params.id;
            this.countArr=JSON.parse(tools.getLocalStorage('countArr'));
            this.tourid=tools.getLocalStorage('tourid');
            let params=tools.getLocalStorage('key');
            console.log(params);
            getPrice(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('总价格获取成功');
                    this.sum=response.data.price;
                    // this.singleRoomPrice=response.data.singleRoomPrice;
                    // this.singleInit=response.data.singleRoomPrice;
                    this.discountPrice=response.data.discountPrice;
                    this.singleRoomPrice=0;
                    this.singleInit=0;
                    //价格策略接口请求参数
                    let paramsPrice={
                        'proid':this.proid,
                        'tourDate':tools.getLocalStorage('selectedDay'),
                        'siteid':tools.getSessionStorage('siteId'),
                        'isOutgoing':tools.getLocalStorage('isOutgoing'),
                        'orgId':tools.getLocalStorage('orgIdw'),
                        'tourid':tools.getLocalStorage('tourid')
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
                                    for(let j = 0;j<this.pricePolicyList[i].count;j++){
                                        // 组合游客信息数组
                                        this.tourArr.push({
                                            name:this.pricePolicyList[i].policyName,
                                            id:this.pricePolicyList[i].id,
                                            single:this.pricePolicyList[i].singleRoomPrice,
                                            seat:this.pricePolicyList[i].seat,
                                            //增加一个身份证的标识
                                            sfId:"身份证",
                                            sex:'男',
                                            venueIndex:1,
                                            // indexTour:i+j,
                                            isNameShow:false,
                                            tipNameText:'',
                                            isCardShow:false,
                                            tipCardText:'',
                                            isTelShow:false,
                                            isAgeShow:false,
                                            tipTelText:'',
                                            tipAgeText:'',
                                            personalName:'',
                                            personalTel:'',
                                            personalAge:'',
                                            isSingleRoom:2,
                                            isContact:2,
                                            venue:{'venue':'请选择','dropoffprice':0,'shuttleprice':0,'id':1},//配送对象
                                        });
                                        if(j==0){
                                            this.tourArr[0].isContact=1;
                                        }
                                    }
                                    
                                }
                                this.sumTotalPrice();
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
                }
                else{
                    console.log('总价格获取失败');
                }
            }).catch((err)=>{
                console.log('总价格接口异常报错',err);
                // this.$Message.info('总价格接口异常报错');
            });

            // 接送设置
             let paramsVenue={
                'proid':this.proid,
                'depid':tools.getLocalStorage('departureId'),
                'tourid':tools.getLocalStorage('tourid'),
                'siteid':tools.getSessionStorage('siteId')
            }
            getVenue(paramsVenue).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('接送设置获取成功');
                    this.proTourVenues=response.data;
                    this.proTourVenues.unshift({'venue':'请选择','dropoffprice':0,'shuttleprice':0,'id':1});
                }
                else{
                    console.log('接送设置获取失败');
                }
            }).catch((err)=>{
                console.log('接送设置接口异常报错',err);
                // this.$Message.info('接送设置接口异常报错');
            });
        },
        // 计算总价
        sumTotalPrice(){
            this.sumPrice=0;
            this.venueTotalPrice=0;
            console.log(this.sum);
            console.log(this.tourArr);
            // console.log(this.tourArr.length);
            for(let i=0;i<this.tourArr.length;i++){
                // alert('1');
                if(this.tourArr[i].seat==true){
                    this.venueTotalPrice=this.add(this.add(this.tourArr[i].venue.shuttleprice,this.tourArr[i].venue.dropoffprice),this.venueTotalPrice);
                }
            }
            this.sumPrice=this.add(this.add(this.add(this.sub(this.sum,this.singleInit),this.singleRoomPrice),this.venueTotalPrice),this.sumPrice);
            // this.sumPrice+=parseInt(this.sum) - parseInt(this.singleInit) + parseInt(this.singleRoomPrice) + this.venueTotalPrice;
            console.log(this.sumPrice);
        },
        //选择联系人
        chooseContact(tour,index,tourArr){
            tour.isContact=1;
            for(let i=0;i<tourArr.length;i++){
                if(i!=index){
                tourArr[i].isContact=2;
                }
            }
            this.mainName=tour.personalName;
            this.mainTel=tour.personalTel;
        },
        // 提交订单
        addOrderFun(){
            if(this.proTourVenues.length==1){
                this.tipText='该出发地没有相关接送，请重新选择出发地！';
                this.showTip=true;
                return;
            }
            this.judgeGuestIsCorrect(this.tourArr);
            if(this.flag==false){
                return ;
            }
            let _obj = {};
            _obj.mainName = this.mainName;
            _obj.mainTel = this.mainTel;
            if(this.judgePersonIsCorrect(_obj)==false){
                return ;
            }
            // if(this.judgeGuestIsCorrect(this.tourArr)==false){
            //     return ;
            // }
           
            if(this.flag && this.submitFlag==1){
                this.sfIdArray=[];
                this.nameList=[];
                this.codeList=[];
                this.telList=[];
                this.policyIdList=[];
                this.sexList=[];
                this.ageList=[];
                this.venueidList=[];
                this.singleRoomList=[];
                // let single='';
                // if(this.userType==1){
                //     single=this.singlePrice;
                // }
                // else if(this.userType==2){
                //     single=this.singleRoomPrice;
                // }
                // 遍历旅客信息列表
                for(let i=0;i<this.tourArr.length;i++){
                    // if(this.tourArr[i].count!=0){
                    //上传身份证的id数组
                    this.sfIdArray.push(this.tourArr[i].sfId);  
                    //旅客姓名数组
                    this.nameList.push(this.tourArr[i].personalName);
                    //旅客身份证列表
                    this.codeList.push(this.tourArr[i].personalCard);
                    //旅客联系方式列表
                    this.telList.push(this.tourArr[i].personalTel);
                    //旅客性别列表
                    this.policyIdList.push(this.tourArr[i].id);
                    //旅客价格策略列表
                    this.sexList.push(this.tourArr[i].sex);
                    // 旅客年龄列表
                    this.ageList.push(this.tourArr[i].personalAge);
                    //旅客出发地
                    this.venueidList.push(this.tourArr[i].venueIndex);
                    // 旅客单房差
                    this.singleRoomList.push(this.tourArr[i].isSingleRoom)
                    // } 
                    
                    if(this.tourArr[i].venueIndex==1) {
                        this.tipText="第"+(i+1)+"个旅客的接送设置未选择";
                        this.showTip=true;
                        return;
                    } 
                }
                this.submitFlag=0;//使无法重复提交
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
                    'nameList':this.nameList,
                    'codeList':this.codeList,
                    'telList':this.telList,
                    'cardtypeList':this.sfIdArray,
                    'sexList':this.sexList,
                    'policyList':this.policyIdList,
                    'venueidList':this.venueidList,
                    // 其他重要信息   
                    'proid':this.$route.params.id,
                    'tourid':this.tourid,
                    'policyid':this.policyIdArr,
                    'num':this.countArr,
                    'departure':tools.getLocalStorage('departure'),
                    'totalprice':this.sumPrice,
                    'singleroomprice':this.singleRoomPrice,
                    'isSingleRoom':this.singleRoomList,
                    'ageList':this.ageList,
                    'deptName':this.deptName,
                    'userName':this.saleName,
                    'iD':this.saleID,
                    'deptID':this.deptID,
                    'useDiscount':this.useDiscount
                };
                addOrderInfo(params).then((response)=>{
                    console.log(response);
                    if(response.meta.success==true){
                        console.log('添加旅客信息成功');
                        // 存订单号
                        tools.setLocalStorage('orderNo',response.data.orderNo);
                        // parent.location.href='http://h5.aipinzan.cn/PayApi/WxPay.aspx?orderId='+ response.data.orderId+'&redirect_url=http://h5.aipinzan.net:9091/payApi/payCallback';
                        
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
                        // this.submitFailTip=response.meta.message;
                        this.orderSubmitTip=true;
                        this.failTip=response.meta.message;
                        this.submitFlag=1;
                    }
                }).catch((err)=>{
                    console.log('添加旅客信息接口获取失败',err);
                    // this.$Message.info('添加旅客信息接口获取失败');
                }); 
            }    
        },
        // 立即预定
        addReserveFun(){
            if(this.proTourVenues.length==1){
                this.tipText='该出发地没有相关接送，请重新选择出发地！';
                this.showTip=true;
                return;
            }
            this.judgeGuestIsCorrect(this.tourArr);
            if(this.flag==false){
                return ;
            }
            let _obj = {};
            _obj.mainName = this.mainName;
            _obj.mainTel = this.mainTel;
            if(this.judgePersonIsCorrect(_obj)==false){
                return ;
            }
            // if(this.judgeGuestIsCorrect(this.tourArr)==false){
            //     return ;
            // }
           
            if(this.flag && this.submitFlag==1){
                this.sfIdArray=[];
                this.nameList=[];
                this.codeList=[];
                this.telList=[];
                this.policyIdList=[];
                this.sexList=[];
                this.ageList=[];
                this.venueidList=[];
                this.singleRoomList=[];
                // let single='';
                // if(this.userType==1){
                //     single=this.singlePrice;
                // }
                // else if(this.userType==2){
                //     single=this.singleRoomPrice;
                // }
                // 遍历旅客信息列表
                for(let i=0;i<this.tourArr.length;i++){
                    // if(this.tourArr[i].count!=0){
                    //上传身份证的id数组
                    this.sfIdArray.push(this.tourArr[i].sfId);  
                    //旅客姓名数组
                    this.nameList.push(this.tourArr[i].personalName);
                    //旅客身份证列表
                    this.codeList.push(this.tourArr[i].personalCard);
                    //旅客联系方式列表
                    this.telList.push(this.tourArr[i].personalTel);
                    //旅客性别列表
                    this.policyIdList.push(this.tourArr[i].id);
                    //旅客价格策略列表
                    this.sexList.push(this.tourArr[i].sex);
                    // 旅客年龄列表
                    this.ageList.push(this.tourArr[i].personalAge);
                    //旅客出发地
                    this.venueidList.push(this.tourArr[i].venueIndex);
                    // 旅客单房差
                    this.singleRoomList.push(this.tourArr[i].isSingleRoom);
                    if(this.tourArr[i].venueIndex==1) {
                        this.tipText="第"+(i+1)+"个旅客的接送设置未选择";
                        this.showTip=true;
                        return;
                    } 
                    // }     
                }
                this.submitFlag=0;//使无法重复提交
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
                    'nameList':this.nameList,
                    'codeList':this.codeList,
                    'telList':this.telList,
                    'cardtypeList':this.sfIdArray,
                    'sexList':this.sexList,
                    'policyList':this.policyIdList,
                    'venueidList':this.venueidList,
                    // 其他重要信息   
                    'proid':this.$route.params.id,
                    'tourid':this.tourid,
                    'policyid':this.policyIdArr,
                    'num':this.countArr,
                    'departure':tools.getLocalStorage('departure'),
                    'totalprice':this.sumPrice,
                    'singleroomprice':this.singleRoomPrice,
                    'isSingleRoom':this.singleRoomList,
                    'ageList':this.ageList,
                    'deptName':this.deptName,
                    'userName':this.saleName,
                    'iD':this.saleID,
                    'deptID':this.deptID,
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
                        // this.submitFailTip=response.meta.message;
                        this.orderSubmitTip=true;
                        this.failTip=response.meta.message;
                        this.submitFlag=1;
                    }
                }).catch((err)=>{
                    console.log('添加旅客信息接口获取失败',err);
                    // this.$Message.info('添加旅客信息接口获取失败');
                });
            }
        }
    },
    watch:{
        mainName:function(newValue,oldValue){
            console.log(newValue,'newValue');
            console.log(oldValue,'old');
            if (newValue == "") {
                this.mainNameCon = "联系人姓名不能为空";
            } else {
                this.mainNameCon = "";
            }
        },
        mainTel:function(newValue,oldValue){
             let pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
            if(!pattern.test(newValue)&&newValue!=''){
                this.mainTelCon="请输入正确的手机号码";
            }
            else if(newValue==''){
                this.mainTelCon="联系人手机号码不能为空";
            }
            else{
                this.mainTelCon="";
            }
        }
    },
    mounted(){
        this.fillInfoInit();
    },
     //修改页面的meta值，false时再次进入页面会重新请求数据。
    beforeRouteLeave(to, from, next) {
        from.meta.keepAlive = false;
        next();
    },
    components: {
      XInput,
      PopupPicker,
      Group,
      Selector,
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
        padding: toRem(20px) toRem(20px) toRem(40px);
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
.fill-information{
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
                width: toRem(135px);
                margin-right: toRem(40px);
            }
            >input{
                -webkit-tap-highlight-color:rgba(255,0,0,0);
                width:toRem(500px);
                @include sc(toRem(24px),#333); 
                outline: none;
                border:none;
                &::placeholder{
                    @include sc(toRem(24px),#999);  
                }
            }
            >p{
                @include sc(toRem(20px),red);
                margin-left: toRem(175px);
                margin-top: toRem(10px);
            }
            &:last-child{
                border-bottom: none;
            }
        }
    }
    .tourist-information{
        // padding: toRem(40px) toRem(30px) toRem(10px) toRem(30px);
        // padding-right: toRem(30px);
        >p{
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
            >a{
                float: right;
                @include sc(toRem(28px),#0080ff);
                -webkit-tap-highlight-color:rgba(255,0,0,0);
                margin-right: toRem(30px);
            }
            .fill{
                display: inline-block;
                width: toRem(80px);
                text-align: center;
                vertical-align: middle;
                >img{
                    @include wh(toRem(32px),toRem(32px));
                }
            }
        } 
    }
    .tourist-information-list{
        background: #f4f4f4;
        >div{
            background: #fff;
            margin-bottom: toRem(20px);
            padding-bottom: toRem(40px);
            >div{
                font-size: 0;
                margin:0 toRem(30px);
                border-bottom: 1px solid #D9D9D9;
                padding: toRem(30px) 0;
                >label{
                    @include sc(toRem(26px),#666);
                    display: inline-block;
                    width:toRem(135px);
                    margin-right: toRem(35px); 
                }
                >input{
                    -webkit-tap-highlight-color:rgba(255,0,0,0);
                    width:toRem(500px);
                    @include sc(toRem(24px),#333); 
                    outline: none;
                    border:none;
                    &::placeholder{
                        @include sc(toRem(24px),#999);  
                    }
                }
                >p:not(.sex){
                    @include sc(toRem(20px),red);
                    margin-left: toRem(170px);
                    margin-top: toRem(10px);
                }
                >span{
                    @include sc(toRem(24px),$main-color);
                }
            }
            .ticket-tip{
                position: relative;
                >a{
                    position: absolute;
                    right:0;
                    font-size: toRem(24px);
                    color:$main-color;
                }
            }
        }
        .tourist-sex,.tourist-room,.tourist-contact{
            font-size:0;
            padding: toRem(25px) 0;
            >p{
               display: inline-block;
               >a{
                    display: inline-block;
                    -webkit-tap-highlight-color:rgba(255,0,0,0);
                    @include wh(toRem(60px),toRem(40px));
                    background:#ddd;
	                border-radius: toRem(4px);
                    font-size:toRem(20px);
                    line-height: toRem(40px);
                    color:#999;
                    text-align: center;
                    margin-right: toRem(40px);
                    &.active{
                        background-image: $main-bg;
                        color:#fff;
                    }
               }
           }
        }
        .tourist-card-con{
            // padding: toRem(5px) 0;
            .card-select{
                display: inline-block;
                width: toRem(135px);
                margin-right: toRem(35px);
                position: relative;
                >select{
                    display: inline;
                    padding: 0;
                    font-size: 0;
                    outline: none;
                    -webkit-appearance: none;
                    border:none;
                    @include sc(toRem(26px),#666);
                    text-align: left;
                }
                >i{
                    position: absolute;
                    right:0;
                    top:toRem(15px);
                    display: inline-block;
                    background: url('../assets/images/site-down.png') no-repeat;
                    width:toRem(20px);
                    height: toRem(10px);
                    background-size: 100%;
                }
            }
        }
        .tourist-venue{
            position: relative;
            .tourist-set{
                width:toRem(500px);
                outline: none;
                -webkit-appearance: none;
                border: none;
                @include sc(toRem(24px),#333);
                -webkit-tap-highlight-color:rgba(255,0,0,0);
            }
            >i{
                position: absolute;
                right:0;
                top:toRem(45px);
                display: inline-block;
                background: url('../assets/images/type-down.png') no-repeat;
                width:toRem(20px);
                height: toRem(10px);
                background-size: 100%;
            }
        }
        
        .tourist-contact{
            border-bottom: none;
            padding-bottom: 0;
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
            height: toRem(100px);
            line-height: toRem(100px);
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
            .venue-price{
                 @include sc(toRem(26px),#18191a); 
                 >div{
                    //  display: inline-block;
                    float: right;
                    text-align: right;
                    margin-bottom: toRem(20px);
                    >p{
                    @include sc(toRem(26px),#ffa100); 
                    }
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

