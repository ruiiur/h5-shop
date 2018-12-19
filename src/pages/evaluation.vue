<!--这是评价页面-->
<template>
    <div class="evaluation">
       <div class="evaluation-intro">
            <h2>{{aliasename}}</h2>
            <textarea v-model="comments" name="" id="" placeholder="此次旅行满足您的期待吗？说说您的旅行感受吧"></textarea>
            <div class="upload-img">
                <ul v-for="img in imgUrls.length">
                    <li><img :src="imgUrls[img-1]" alt="" @click="clickImg($event)"><i @click="cancelImg(img)"></i></li>
                </ul>
                <div>
                    <img src="../assets/images/upload.png" alt="" >
                    <input accept="image/*" type="file" multiple  @change="onFileChange">
                </div>
            </div>
       </div>
       <div class="evaluation-star">
           <div>
               <span>旅行评价</span>
               <ul class="grade-list">
                   <li v-for="evalu in evalList.length" @click="evaluIndex=evalu" :class="evaluIndex==evalu?'active':''">{{evalList[evalu-1]}}</li>
               </ul>
           </div>
           <div>
               <span>导游讲解</span>
               <div class="grade-box">
                    <img v-for="(star,index) in starsTour.starsList" v-bind:src="star.src" @click="rating(index,starsTour)" alt="星星图片" />
                </div>
           </div>
           <div>
               <span>交通线路</span>
               <div class="grade-box">
                    <img v-for="(star,index) in starsTraffic.starsList" v-bind:src="star.src" @click="rating(index,starsTraffic)" alt="星星图片" />
                </div>
           </div>
           <div>
               <span>住宿餐饮</span>
               <div class="grade-box">
                    <img v-for="(star,index) in starsAcc.starsList" v-bind:src="star.src" @click="rating(index,starsAcc)" alt="星星图片" />
                </div>
           </div>
       </div>
       <p class="submit">
           <a href="javascript:;" @click="submitComment">提交</a>
       </p>
       <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
        <toast v-model="showTip" type="text">{{tipText}}</toast>
        <service></service>
    </div>
</template>
<script>
import BigImg from '../components/big-img'
import service from '../components/service'
import tools from '../common/tools'
import { uploadTourImg,getAliaseName,addComments } from '../services/index'
import { Toast } from 'vux'
let starOffImg=require("../assets/images/star-off.png");
let starOnImg=require("../assets/images/star-on.png");
export default {
    data(){
        return{
            showImg:false,//大图是否显示
            imgUrls:[],//上传的图片列表
            evalList:['差评','中评','好评'],
            starsTour: {
                starsList:[
                     {
                        src: starOffImg,
                        active: false
                    }, {
                        src: starOffImg,
                        active: false
                    }, {
                        src: starOffImg,
                        active: false
                    },
                    {
                        src: starOffImg,
                        active: false
                    }, {
                        src: starOffImg,
                        active: false
                    }
                ],
                starsNum:0
            },
             starsTraffic: {
                starsList:[
                     {
                        src: starOffImg,
                        active: false
                    }, {
                        src: starOffImg,
                        active: false
                    }, {
                        src: starOffImg,
                        active: false
                    },
                    {
                        src: starOffImg,
                        active: false
                    }, {
                        src: starOffImg,
                        active: false
                    }
                ],
                starsNum:0
            },
            starsAcc: {
                starsList:[
                     {
                        src: starOffImg,
                        active: false
                    }, {
                        src: starOffImg,
                        active: false
                    }, {
                        src: starOffImg,
                        active: false
                    },
                    {
                        src: starOffImg,
                        active: false
                    }, {
                        src: starOffImg,
                        active: false
                    }
                ],
                starsNum:0
            },
            evaluIndex:3,
            aliasename:'',//产品名称
            comments:'',//评论内容
            showTip:false,//弹框是否显示
            tipText:'',//弹框内容
            flag:1,//禁止多次评论的,1代表可以评论
        }
    },
    methods: {
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
        // 上传图片
        onFileChange(){
            let reader =new FileReader();  
            let form = new FormData(); 
            for(let i=0;i<event.target.files.length;i++){
                form.append('file',event.target.files[i],event.target.files[i].name);  
            }
            uploadTourImg(form).then((response)=>{
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
        //评分
        rating(index,obj) {
            obj.starsNum = index + 1; //这代表选的第idx颗星-也代表应该显示的星星数量
            for(let i=0;i<obj.starsList.length;i++){
                obj.starsList[i].src = starOffImg;
                obj.starsList[i].active = false;
            }
            for(let i=0;i<obj.starsNum;i++){
                obj.starsList[i].src = starOnImg;
                obj.starsList[i].active = true;
            }
            console.log(obj.starsNum);
        },
        evaluationInit(){
            console.log(this.$route.params.ordid);
            let params={
                'proid':this.$route.params.proid,
                'orderid':this.$route.params.ordid,
            };
            getAliaseName(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('获取产品别名成功');
                   this.aliasename=response.data.aliasename;
                }
                else{
                    console.log('获取产品别名失败');
                }
            }).catch((err)=>{
                console.log('获取产品别名异常',err);
            });
        },
        // 提交评论
        submitComment(){
            let imgStr='';
            for(let i=0;i<this.imgUrls.length;i++){
                imgStr+=this.imgUrls[i]+',';
            }
            if(this.flag==1){
                this.flag=0;
                 let params={
                    'proid':this.$route.params.proid,
                    'orderid':this.$route.params.ordid,
                    'comments':this.comments,
                    'tourevaluation':this.evaluIndex,
                    'imgurls':imgStr,
                    'tourguide':this.starsTour.starsNum,
                    'traffic':this.starsTraffic.starsNum,
                    'accommodation':this.starsAcc.starsNum,
                };
                addComments(params).then((response)=>{
                    console.log(response);
                    if(response.meta.success==true){
                        console.log('评论成功');
                        this.showTip=true;
                        this.tipText='评论成功';
                        setTimeout(()=>{
                            this.$router.push('/order');
                        },1000)
                    }
                    else{
                        console.log('评论失败');
                        this.showTip=true;
                        this.tipText=response.meta.message;
                    }
                }).catch((err)=>{
                    console.log('评论异常',err);
                });
            }
            else{
                this.showTip=true;
                this.tipText='请勿重复提交';
            } 
        },
        // 删除图片
        cancelImg(img){
            let i=img-1;
            this.imgUrls.splice(i,1);
        }
    },
    mounted(){
        this.evaluationInit();
    },
    components: {
      BigImg,
      Toast,
      service
    },
}
</script>

<style lang="scss">
.evaluation{
    background: #f1f1f1;
    min-height: calc(100vh - #{toRem(80px)});
    .evaluation-intro{
        padding: 0 toRem(30px);
        background: #fff;
        >h2{
           @include sc(toRem(26px),#18191a); 
           padding: toRem(20px) 0;
           border-bottom:1px solid #ddd;
        }
        >textarea{
            width:100%;
            height: toRem(200px);
            padding-top: toRem(20px);
            outline: none;
            border:none;
            @include sc(toRem(24px),#18191a); 
            &::placeholder{
                @include sc(toRem(24px),#999); 
            }
        }
    }
    .upload-img{
        font-size: 0;
        >ul{
            display: inline-block;
            >li{
                float: left;
                margin-right: toRem(20px);
                margin-bottom: toRem(20px);
                position: relative;
                @include wh(toRem(100px),toRem(100px));
                >img{
                    @include wh(toRem(100px),toRem(100px));
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
            @include wh(toRem(100px),toRem(100px));
            vertical-align: top;
            position: relative;
            margin-bottom: toRem(20px);
            >img{
                @include wh(toRem(100px),toRem(100px));
                display: inline-block;
            }
            >input{
                -webkit-tap-highlight-color:rgba(255,0,0,0);
                position: absolute;
                left:0;
                bottom:0;
                @include wh(toRem(100px),toRem(100px));
                opacity: 0;
            }
        }
    }
    .evaluation-star{
        background: #fff;
        padding: toRem(40px) 0 toRem(40px) toRem(30px);
        margin-top: toRem(20px);
        font-size: 0;
        >div{
            margin-bottom: toRem(40px);
            >span{
                @include sc(toRem(30px),#333);
                margin-right: toRem(39px);
            }
            >ul,>div{
                display: inline-block;
            }
            &:last-child{
                margin-bottom: 0;
            }
        }
    }
    .grade-box{
        display: inline-block;
        vertical-align: top;
        img{
           @include wh(toRem(40px),toRem(40px)); 
           margin-right: toRem(20px);
        }
    }
    .grade-list{
        >li{
            display: inline-block;
            border:toRem(2px) solid $main-color;
            font-size: toRem(24px);
            color:$main-color;
            height: toRem(40px);
            line-height: toRem(41px);
            width:toRem(80px);
            border-radius: toRem(10px);
            text-align: center;
            margin-right: toRem(20px);
            box-sizing: border-box;
            &.active{
                background-image:$main-bg;
                color:#fff;
                border:none;
                border:toRem(2px) solid transparent;
            }
        }
    }
    .submit{
        height: toRem(60px);
        text-align: center;
        margin-top: toRem(40px);
        >a{
            display: inline-block;
            width:toRem(680px);
            height: toRem(60px);
            background-image: $main-bg;
	        border-radius: toRem(10px);
            line-height: toRem(60px);
            @include sc(toRem(26px),#fff);
            line-height: toRem(60px);
        }
    }
}
</style>

