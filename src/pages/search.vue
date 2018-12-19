<!--这是搜索页面-->
<template>
    <div class="search">
        <div class="search-active" >
            <search
                @result-click="resultClick"
                @on-change="getResult"
                v-model="keyWord"
                @on-focus="onFocus"
                @on-cancel="onCancel"
                @on-submit="onSubmit"
                ref="search">
            </search>
        </div>
        <div class="search-records">
            <div v-if="hotList.length!=0">
                <p>热门搜索</p>
                <div>
                    <a href="javascript:;" v-for="hot in hotList.length" @click="searchTab(hot,hotList)">{{hotList[hot-1]}}</a>
                </div>
            </div>
            <div v-if="historyList.length!=0">
                <p>历史搜索<i class="clear" @click="delectHistory"></i></p>
                <div>
                    <a href="javascript:;" v-for="history in historyList.length" @click="searchTab(history,historyList)">{{historyList[history-1]}}</a>
                </div>
            </div>
        </div>
        <service></service>
    </div>
</template>
<script>
import tools from '../common/tools'
import { Search} from 'vux'
import service from '../components/service'
import { searchHistory,saveSearch,delHistory,hotSearch } from '../services/index'
export default {
    data(){
        return{
            keyWord:'',
            results:[],
            historyList:[],//历史搜索列表
            hotList:[],//热搜
        }
    },
    methods: {
        setFocus () {
         this.$refs.search.setFocus()
        },
        resultClick (item) {
            window.alert('you click the result item: ' + JSON.stringify(item))
        },
        getResult (val) {
            console.log('on-change', val)
            this.results = val;
        },
        onSubmit () {
            this.$refs.search.setBlur();
            tools.setLocalStorage('keyWord',this.keyWord);
            // 保存历史记录
            let params={
                'keywords':this.keyWord,
            }
            saveSearch(params).then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('保存历史记录成功');
                }
                else{
                    console.log('保存历史记录失败');
                }
            }).catch((err)=>{
                console.log('保存历史记录异常',err);
            });
            if(this.$route.params.id==1){
                this.$router.push('/search-list');
            }
            if(this.$route.params.id==2){
                this.$router.push('/classification/-1');
            }
        },
        onFocus () {
            console.log('on focus')
        },
        onCancel () {
            console.log('on cancel')
        },
        searchInit(){
            // if(tools.getLocalStorage('keyWord')){
            //     this.keyWord=tools.getLocalStorage('keyWord');
            // }

            // 搜索历史记录
            this.historyList=[];
            searchHistory().then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('搜索历史记录成功');
                    if(response.data!=null){
                        for(let i=0;i<response.data.length;i++){
                            if(response.data[i] && response.data[i].trim().length!=0){
                                this.historyList.push(response.data[i]);
                            }
                        }
                    }
                }
                else{
                    console.log('搜索历史记录失败');
                }
            }).catch((err)=>{
                console.log('搜索历史记录异常',err);
            });

            // 热搜
            // 搜索历史记录
            this.hotList=[];
            hotSearch().then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('热门搜索成功');
                    if(response.data!=null){
                         for(let i=0;i<response.data.length;i++){
                            if(response.data[i] && response.data[i].trim().length!=0){
                                this.hotList.push(response.data[i]);
                            }
                        }
                    }
                }
                else{
                    console.log('热门搜索记录失败');
                }
            }).catch((err)=>{
                console.log('热门搜索记录异常',err);
            });
        },
        // 删除历史记录
        delectHistory(){
            delHistory().then((response)=>{
                console.log(response);
                if(response.meta.success==true){
                    console.log('删除历史记录成功');
                    this.historyList=[];
                }
                else{
                    console.log('删除历史记录失败');
                }
            }).catch((err)=>{
                console.log('删除历史记录异常',err);
            });
        },
        // 热搜，历史搜索页跳转到搜索列表页面搜索
        searchTab(index,obj){
            tools.setLocalStorage('keyWord',obj[index-1]);
            if(this.$route.params.id==1){
                tools.setLocalStorage('tourDayScope','');
                this.$router.push('/search-list');
            }
            if(this.$route.params.id==2){
                this.$router.push('/classification');
            }
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.$refs['search'].onFocus();
        })
        this.searchInit();
    },
    components: {
        Search,
        service
    },
}
</script>

<style lang="scss">
.search{
    .search-active{
        padding-top:0;
        height: toRem(100px);
        .vux-search-fixed{
            position: relative !important;
        }
        .vux-search-box{
            width:100%;
            background-image: $main-bg;
            height: toRem(100px);
            .weui-search-bar__form{
                border-radius: toRem(100px) !important;
            }
            .weui-search-bar__box{
                // border-radius: toRem(40px);
            }
            .weui-search-bar{
                background-image: $main-bg;
                
            }
            .weui-search-bar__input{
                // border-radius: toRem(40px);
                height: toRem(80px);
                line-height: toRem(80px);
                box-sizing: border-box;
                border-radius: toRem(40px);
                // -webkit-tap-highlight-color:rgba(255,0,0,0);
            }
            .weui-icon-search{
                line-height: toRem(80px);
            }
            .weui-icon-clear{
                line-height: toRem(80px);
            }
            .weui-search-bar__form:after {
                border-radius: toRem(100px) !important;
            }
            .weui-search-bar__label{
                border-radius: toRem(100px) !important;
            }
        }
        .weui-search-bar__cancel-btn{
            @include sc(toRem(26px),#fff);
            line-height: toRem(80px);
        }
    }
    .search-records{
        padding-top: toRem(20px);
        font-size: 0;
        >div{
            padding: 0 toRem(10px) 0 toRem(30px);
            margin-bottom: toRem(20px);
            >p{
                @include sc(toRem(30px),#666);
                margin-bottom: toRem(21px);
                .clear{
                    // display: inline-block;
                    width:toRem(30px);
                    height: toRem(30px);
                    background: url('../assets/images/history-cancel.png') no-repeat;
                    background-size:100%;
                    float: right;
                    margin-top: toRem(5px);
                    margin-right: toRem(15px);
                }
            }
            >div{
                >a{
                    display: inline-block;
                    line-height: toRem(46px);
                    border:toRem(1px) solid #ddd;
                    @include  sc(toRem(24px),#666);
                    padding: 0 toRem(30px);
                    height: toRem(46px);
                    border-radius: toRem(4px);
                    margin:0 toRem(20px) toRem(20px) 0;
                }
            }
        }
    }
}
</style>