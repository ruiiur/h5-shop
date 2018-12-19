<!--这是最新报价页面-->
<template>
     <div class="fill-explain">
        <ul>
            <li @click="fillIndex=1" :class="fillIndex==1?'active':''">填写说明</li>
            <li @click="fillIndex=2" :class="fillIndex==2?'active':''">老版护照</li>
            <li @click="fillIndex=3" :class="fillIndex==3?'active':''">新版护照</li>
        </ul>
        <div v-if="fillIndex==1" class="fill-text">
            <p>填写说明：</p>
            <p>1.乘客姓名需与所选证件上的名字一致。</p>
            <p>2.中文姓名：</p>
            <p>·若持护照登机，必须确认护照上有中文姓名。</p>
            <p>·生僻字可用拼音代替，例如：“王鬳”可输入为“王yan”。</p>
            <p>3.英文姓名：</p>
            <p>·若持护照登机，必须按照护照顺序区分姓与名。中国籍乘客的英文名即为中文名对
            应拼音。外籍乘客，如乘客姓名为Loise Smith St. Paul ，则在“Last Name”栏
            中输入StPaul(注：Last Name中无空格和特殊符号)；在“First Name”栏中输入
            Loise Smith(注：有中间名按firstname middlename的格式填写)。不区分大小写。
            ·名字长度≤26个字符，若过长请使用缩写。
            </p>
        </div>
        <div v-if="fillIndex==2" class="fill-old">
            <img src="../assets/images/laobanhuzhao.png" alt="">
            <p>* 请严格按照所选证件上的信息填写</p>
        </div>
        <div v-if="fillIndex==3" class="fill-new">
            <img src="../assets/images/xinbanhuzhao.png" alt="">
            <p>* 请严格按照所选证件上的信息填写</p>
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
          fillIndex:1,//默认值
        }
    },
    methods: {
      
    },
    mounted(){
    },
    components: {
      service
    },
}
</script>

<style lang="scss">
.fill-explain{
    >ul{
        height: toRem(80px);
        line-height: toRem(77px);
        background: #f2f2f2;
        >li{
            @include sc(toRem(28px),#333);
            border:1px solid transparent;
            float: left;
            padding: 0 toRem(10px);
            margin-right: toRem(25px);
            &.active{
                @include sc(toRem(28px),#5280eb);
                border-bottom:1px solid #5280eb;
            }  
        }
    }
    .fill-text{
        @include sc(toRem(28px),#333);
        padding: toRem(27px) toRem(20px) 0;
        >p{
            line-height: toRem(47px);
        }
    }
    .fill-new,.fill-old{
        padding: toRem(27px) toRem(20px) 0;
        >img{
            width: 100%;
        }
        >p{
            @include sc(toRem(24px),red);
        }
    }
}
</style>

