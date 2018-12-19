 <!--底部tab-->
<template>
<div class="toolbar">
  <div class="toolbar-inner home-tab">
    <!--  -->
    <router-link :to="footerObject == 'home'?'#':'/home?orgId='+orgId"  class="link" :class="{'active':footerObject==''?'active':''}"><i></i><p>首页</p></router-link>
    <router-link @click.native="clearRouter()" :to="footerObject == 'classification'?'#':'/classification/-1'"  class="link" :class="{'active':footerObject=='classification'?'active':''}"><i></i><p>分类</p></router-link>
    <router-link :to="footerObject == 'order'?'#':'/order'"  class="link" :class="{'active':footerObject=='order'?'active':''}"><i></i><p>订单</p></router-link>
    <router-link :to="footerObject == 'mine'?'#':'/mine'"  class="link" :class="{'active':footerObject=='mine'?'active':''}"><i></i><p>我的</p></router-link>
  </div>
</div>
</template>

<script>
import tools from '../common/tools'
export default {
  data() {
    return {
      orgId:'',
    };
  },
  props: ["footerObject"],
  methods:{
    clearRouter(){
      tools.setLocalStorage('destinationIndex',0);
      tools.setLocalStorage('destinations','');
      tools.setLocalStorage('keyWord','');
    },
    footInit(){
      this.orgId= tools.getLocalStorage('orgId');
    }
  },
  mounted(){
    this.footInit();
  }
};
</script>

<style lang="scss">
.toolbar {
  background: #fff;
  height: toRem(98px);
  background-color: #ffffff;
	box-shadow: 0px -4px 6px 0px rgba(148, 148, 148, 0.2);
  position: fixed;
  bottom:0;
  width: 100%;
  z-index: 100;
  .toolbar-inner {
    font-size: 0;
    > a {
      width: 25%;
      display: inline-block;
      text-align: center;
      -webkit-tap-highlight-color:rgba(255,0,0,0);
      > p {
        font-size: toRem(24px);
        color: #666;
        line-height: toRem(24px);
        // margin-left: 0 !important;
      }
      &.active {
        > p {
          color: $main-color;
        }
      }
      i {
        width: toRem(44px);
        height: toRem(44px);
        display: inline-block;
        margin-top: toRem(10px);
        margin-bottom: toRem(10px);
      }
      &:nth-child(1) {
        i {
          background: url("../assets/images/none1.png") no-repeat;
          background-size: 100%;
        }
        &.active {
          i {
            background: url("../assets/images/active1.png") no-repeat;
            background-size: 100%;
          }
        }
      }
      &:nth-child(2) {
        i {
          background: url("../assets/images/none2.png") no-repeat;
          background-size: 100%;
        }
        &.active {
          i {
            background: url("../assets/images/active2.png") no-repeat;
            background-size: 100%;
          }
        }
      }
      &:nth-child(3) {
        i {
          background: url("../assets/images/none3.png") no-repeat;
          background-size: 100%;
        }
        &.active {
          i {
            background: url("../assets/images/active3.png") no-repeat;
            background-size: 100%;
          }
        }
      }
      &:nth-child(4) {
        i {
          background: url("../assets/images/none4.png") no-repeat;
          background-size: 100%;
        }
        &.active {
          i {
            background: url("../assets/images/active4.png") no-repeat;
            background-size: 100%;
          }
        }
      }
    }
  }
}

</style>

