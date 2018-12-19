<!--这是最新报价页面-->
<template>
    <div class="quote">
       <ul class="quote-list">
           <li v-for="(quote,index) in quoteList"><a :href="quote.url"><label>{{index+1}}、{{quote.filename}}</label><span>{{quote.createddate}}</span></a></li>
       </ul>
       <div v-if="quoteTip" class="without-quote">
           <img src="../assets/images/quote-none.png" alt="">
            <p>暂无最新报价</p>
       </div>
       <service></service>
    </div>
</template>
<script>
import { latestQuote } from '../services/index'
import tools from '../common/tools'
import service from '../components/service'
export default {
    data(){
        return{
           quoteList:[],//报价列表
           quoteTip:false,
        }
    },
    methods: {
       quoteInit(){
           let params=tools.getLocalStorage('orgId');
           latestQuote(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('最新报价获取成功');
                    this.quoteList=response.data;
                    if(response.data.length==0){
                        this.quoteTip=true;
                    }
                    else{
                        this.quoteTip=false; 
                    }
                }
                else{
                    console.log('最新报价获取失败');
                }
            }).catch((err)=>{
                console.log('最新报价获取异常',err);
            });
       }
    },
    mounted(){
       this.quoteInit();
    },
    components: {
      service
    },
}
</script>

<style lang="scss">
.quote{
    .quote-list{
        >li{
          height: toRem(90px);  
          line-height: toRem(90px);
          padding: 0 toRem(22px);
          border-bottom: 1px solid #e1e1e1;
          font-size: 0;
          >a{
              line-height: toRem(89px);
              @include sc(toRem(28px),#333);
              >label{
                width:toRem(500px);
                max-width: toRem(500px);
                display: inline-block;  
                overflow: hidden;
                white-space: nowrap;
                text-overflow:ellipsis;
              }
              >span{
                  float: right;
              }
          }  
        }
    }
    .without-quote{
        text-align: center;
        >img{
            @include wh(toRem(200px),toRem(205px));
            padding-top: toRem(100px);
            margin-bottom: toRem(40px);
        }
        >p{
            @include sc(toRem(30px),#666);
        }
    }
}
</style>

