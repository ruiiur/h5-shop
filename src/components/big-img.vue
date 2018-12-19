<!-- 查看大图 -->
<template>
    <!-- 过渡动画 -->
    <transition name="fade">
        <div class="img-view" @click="bigImg">
            <!-- 遮罩层 -->
            <div class="img-layer"></div>
            <div class="img">
                <img :src="imgSrc">
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    props: ['imgSrc'],
    methods: {
        bigImg() {
            // 发送事件
            this.$emit('clickit')
        }
    }
}
</script>
<style scoped>
/*动画*/
/* .fade-enter-active,
.fade-leave-active {
    transition: all .2s linear;
    transform: translate3D(0, 0, 0);
}

.fade-enter,
.fade-leave-active {
    transform: translate3D(100%, 0, 0);
} */


/* bigimg */

.img-view {
}
/*遮罩层样式*/
.img-view .img-layer {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100vw; 
    height: 100vh; 
    background: rgba(0, 0, 0, 0.8);
}

/*不限制图片大小，实现居中*/
.img-view .img img {
    max-width: 100%;
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    top:0;
    bottom: 0;
    margin: auto;
    z-index: 1000;
}
</style>
