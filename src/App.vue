<template>
 
  <div id="app">
    <Header></Header>
    <!-- <router-view/> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <loading :show="showLoading" ></loading>
  </div>
</template>

<script>
import { getSdkConfig } from './services/index'
import { mapGetters  } from 'vuex'
import Vue from 'vue'
import { Loading } from 'vux'
import Header from './components/header'
export default {
  name: 'App',
  data(){
    return{
    }
  },
  methods:{
    // appInit(){
    // }
  },
  mounted(){
    // this.appInit();
  },
  computed: {
     ...mapGetters([
        'showLoading',
      ]),
  },
  components:{
    Loading,
    Header
  },
}
</script>

<style lang="scss">
#app{
  padding-top: toRem(80px);
  box-sizing: border-box !important;
}
</style>
