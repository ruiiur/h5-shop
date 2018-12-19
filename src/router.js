import Vue from 'vue'
import Router from 'vue-router'
import { routerMode } from './common/env'
import tools from './common/tools'

Vue.use(Router)
// 这是首页
const home = r => require.ensure([], () => r(require('@/pages/home.vue')), 'home')
// 这是分类页面
const classification = r => require.ensure([], () => r(require('@/pages/classification.vue')), 'classification')
// 这是订单页面
const order = r => require.ensure([], () => r(require('@/pages/order.vue')), 'order')
// 这是我的页面
const mine = r => require.ensure([], () => r(require('@/pages/mine.vue')), 'mine')
// 这是详情页面
const details = r => require.ensure([], () => r(require('@/pages/details.vue')), 'details')
// 这是支付页面
const pay = r => require.ensure([], () => r(require('@/pages/pay.vue')), 'pay')
// 这是团期选择页面
const groupSelection = r => require.ensure([], () => r(require('@/pages/group-selection.vue')), 'groupSelection')
// 这是选择资源页面
const selectResource = r => require.ensure([], () => r(require('@/pages/select-resource.vue')), 'selectResource')
// 这是信息填写页面
const fillInformation = r => require.ensure([], () => r(require('@/pages/fill-information.vue')), 'fillInformation')
// 这是搜索页面
const search = r => require.ensure([], () => r(require('@/pages/search.vue')), 'search')
// 搜索列表
const searchList = r => require.ensure([], () => r(require('@/pages/search-list.vue')), 'searchList')
// 关于店铺页面
const aboutStore = r => require.ensure([], () => r(require('@/pages/about-store.vue')), 'aboutStore')
// 定制游第一步页面
const customFirst = r => require.ensure([], () => r(require('@/pages/custom-first.vue')), 'customFirst')
// 定制游第二步页面
const customSecond = r => require.ensure([], () => r(require('@/pages/custom-second.vue')), 'customSecond')
// 定制游出发地搜索页面
const customOrigin = r => require.ensure([], () => r(require('@/pages/custom-origin.vue')), 'customOrigin')
// 定制游目的地页面
const customDestination = r => require.ensure([], () => r(require('@/pages/custom-destination.vue')), 'customDestination')
// 拍照录入
const photoEntry = r => require.ensure([], () => r(require('@/pages/photo-entry.vue')), 'photoEntry')
// 登陆页面
const login = r => require.ensure([], () => r(require('@/pages/login.vue')), 'login')
//评价页面
const evaluation = r => require.ensure([], () => r(require('@/pages/evaluation.vue')), 'evaluation')
// 搜索商铺页面
const searchStore = r => require.ensure([], () => r(require('@/pages/search-store.vue')), 'searchStore')
// 商铺搜索结果
const storeList = r => require.ensure([], () => r(require('@/pages/store-list.vue')), 'storeList')
// 绑定手机
const bindPhone = r => require.ensure([], () => r(require('@/pages/bind-phone.vue')), 'bindPhone')
// 最新报价
const quote = r => require.ensure([], () => r(require('@/pages/quote.vue')), 'quote')
// 订单详情页面
const orderDetails = r => require.ensure([], () => r(require('@/pages/order-details.vue')), 'orderDetails')
// 线下支付
const payment = r => require.ensure([], () => r(require('@/pages/payment.vue')), 'payment')
// erp展示详情页
const erpDetails = r => require.ensure([], () => r(require('@/pages/erp-details.vue')), 'erpDetails')
// 无专卖店首页
const blank = r => require.ensure([], () => r(require('@/pages/blank.vue')), 'blank')
// 过渡跳转页面
const jump = r => require.ensure([], () => r(require('@/pages/jump.vue')), 'jump')
// 优惠券页面
const coupon = r => require.ensure([], () => r(require('@/pages/coupon.vue')), 'coupon')
// 优惠券支付页面
const couponPay = r => require.ensure([], () => r(require('@/pages/coupon-pay.vue')), 'couponPay')
// 无优惠券页面
const blankCoupon = r => require.ensure([], () => r(require('@/pages/blank-coupon.vue')), 'blankCoupon')
// 搜索销售人员
const searchSale = r => require.ensure([], () => r(require('@/pages/search-sale.vue')), 'searchSale')
// 授权调转页
const auth = r => require.ensure([], () => r(require('@/pages/auth.vue')), 'auth')
// 填写说明页面
const fillExplain = r => require.ensure([], () => r(require('@/pages/fill-explain.vue')), 'fillExplain')
// 出发城市
const departureCity = r => require.ensure([], () => r(require('@/pages/departure-city.vue')), 'departureCity')

const router = new Router({
  mode: routerMode,
  routes: [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        meta: {
            title: '首页',
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: home,
    },
    {
        path: '/classification/:type',
        meta: {
            title: '分类',
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: classification,
    },
    {
        path: '/order',
        meta: {
            title: '订单',
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: order,
    },
    {
        path: '/mine',
        meta: {
            title: '我的',
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: mine,
    },
    {
        path: '/about-store',
        meta: {
            title: '关于店铺',
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: aboutStore,
    },
    {
        path: '/details/:id/:siteId/:orgid/:state',
        meta: {
            title: '详情'
        },
        component: details,
    },
    {
        path: '/group-selection/:id',
        meta: {
            title: '团期选择',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的  
        },
        component: groupSelection,
    },
    {
        path: '/select-resource/:id',
        meta: {
            title: '选择资源',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: selectResource,
    },
    {
        path: '/fill-information/:id',
        meta: {
            title: '填写信息',
            // keepAlive: true // 需要被缓存
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: fillInformation,
    },
    {
        path: '/photo-entry/:id',
        meta: {
            title: '拍照录入',
            // keepAlive: true // 需要被缓存
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: photoEntry,
    },
    {
        path: '/pay',
        meta: {
            title: '支付',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: pay,
    },
    {
        path: '/search/:id',
        meta: {
            title: '搜索',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: search,
    },
    {
        path: '/search-list',
        meta: {
            title: '搜索',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: searchList,
    },
    {
        path: '/custom-first',
        meta: {
            title: '定制游',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: customFirst,
    },
    {
        path: '/custom-second',
        meta: {
            title: '定制游',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: customSecond,
    },
    {
        path: '/custom-origin',
        meta: {
            title: '选择出发地',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: customOrigin,
    },
    {
        path: '/custom-destination',
        meta: {
            title: '选择目的地',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: customDestination,
    },
    {
        path: '/login',
        meta: {
            title: '绑定H5商城',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: login,
    },
    {
        path: '/evaluation/:ordid/:proid',
        meta: {
            title: '评价',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: evaluation,
    },
    {
        path: '/search-store',
        meta: {
            title: '搜索商铺',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: searchStore,
    },
    {
        path: '/store-list',
        meta: {
            title: '搜索结果',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: storeList,
    },
    {
        path: '/bind-phone/:id',
        meta: {
            title: '绑定手机',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: bindPhone,
    },
    {
        path: '/quote',
        meta: {
            title: '最新报价',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: quote,
    },
    {
        path: '/order-details/:id',
        meta: {
            title: '订单详情',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: orderDetails,
    },
    {
        path: '/payment/:orderId/:orgId',
        meta: {
            title: '收银台',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: payment,
    },
    {
        path: '/erp-details/:id',
        meta: {
            title: '详情',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: erpDetails,
    },
    {
        path: '/blank',
        meta: {
            title: '提示',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: blank,
    },
    {
        path: '/jump',
        meta: {
            title: '过渡',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: jump,
    },
    {
        path: '/coupon',
        meta: {
            title: '领券中心',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: coupon,
    },
    {
        path: '/coupon-pay',
        meta: {
            title: '支付中心',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: couponPay,
    },
    {
        path: '/blank-coupon',
        meta: {
            title: '空白',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: blankCoupon,
    },
    {
        path: '/search-sale',
        meta: {
            title: '搜索',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: searchSale,
    },
    {
        path: '/auth',
        meta: {
            title: '授权跳转页',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: auth,
    },
    {
        path: '/fill-explain',
        meta: {
            title: '填写说明',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: fillExplain,
    },
    {
        path: '/departure-city',
        meta: {
            title: '出发城市',
            // requireAuth: true,  // 添加该字段，表示进入这个路由是需要验证的
        },
        component: departureCity,
    },
  ]
})

export default router;

