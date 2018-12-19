import fetch from '../common/fetch'
// 首页接口
// 根据ip获取siteid
export const getSite = (params) => fetch({
	'url': '/h5shop/index/getCookie',
	'method': 'get',
	'params': params,
	'accredit': false
});

// 根据orgId查询所有站点信息
export const getAllSite = (params) => fetch({
	'url': '/h5shop/index/getAllSite/'+params,
	'method': 'get',
	'accredit': true
});

// 线路——目的地接口
export const getDestination = (params) => fetch({
	'url': '/h5shop/index/getRouteTypeAndDestination/'+params,
	'method': 'get',
	'accredit': true
});

// 产品类型接口
export const getProductType = () => fetch({
	'url': '/h5shop/index/getProductType',
	'method': 'get',
	'accredit': false
});

// 目的地-产品
export const getProductByDest = (params) => fetch({
	'url': '/h5shop/index/getProductByDest',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 改目的地产品
export const newProductAndDest = (params) => fetch({
	'url': '/h5shop/list/newProductAndDest',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 猜你喜欢产品
export const getRecommendPro = (params) => fetch({
	'url': '/h5shop/index/getRecommendPro',
	'method': 'post',
	'data': params,
	'accredit': true
});
// 数据库查询产品列表--改猜你喜欢
export const newProductlist = (params) => fetch({
    'url': '/h5shop/list/newProductlist',
    'method': 'post',
    'data': params,
    'accredit': true
});

// 搜索产品
export const getProductList = (params) => fetch({
	'url': '/h5shop/list/productlist',
	'method': 'post',
	'data': params,
	'accredit': true
});


//产品详情接口
export const getDetails = (params) => fetch({
	'url': '/h5shop/details',
	'method': 'post',
	'data': params,
	'accredit': true
});

//团期接口
export const getTours = (params) => fetch({
	'url': '/h5shop/tours',
	'method': 'post',
	'data': params,
	'accredit': true
});

//价格策略接口
export const getPolicysList = (params) => fetch({
	'url': '/h5shop/policys',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 产品出发地接口
export const getProductDepartures = (params) => fetch({
	'url': '/h5shop/departures',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 选择团期页下一步验证
export const validateDetail = (params) => fetch({
	'url': '/h5shop/validateDetail',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 选择资源验证
export const validateTotalPrice = (params) => fetch({
	'url': '/h5shop/validateTotalPrice',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 获取价格等信息
export const getPrice = (params) => fetch({
	'url': '/h5shop/getPrice/'+params,
	'method': 'post',
	'accredit': true
});

// 查询服务类型
export const getServcieType = () => fetch({
	'url': '/h5shop/custom/getServcieType',
	'method': 'get',
	'accredit': true
});

//定制游出发地接口
export const getCustomDeparture = (params) => fetch({
	'url': '/h5shop/custom/getDeparture',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 提交定制游
export const insertCustom = (params) => fetch({
	'url': '/h5shop/custom/insertCustom',
	'method': 'post',
	'data': params,
	'accredit': true
});
//目的地接口
// export const getRouteTypeAndDestination = (params) => fetch({
// 	'url': '/h5shop/validate/getRouteTypeAndDestination/'+params,
// 	'method': 'get',
// 	'accredit': true
// });

// 预定页信息展示接口
export const getMessage = (params) => fetch({
	'url': '/h5shop/messages',
	'method': 'post',
	'data': params,
	'accredit': true
});

// Erp用户信息
export const getErpUser = () => fetch({
	'url': '/h5shop/user/getErpUser',
	'method': 'get',
	'accredit': true
});

// 接送设置
export const getVenue = (params) => fetch({
	'url': '/h5shop/getVenue',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 提交订单
export const addOrderInfo = (params) => fetch({
	'url': '/h5shop/addOrderInfo',
	'method': 'post',
	'data': params,
	'accredit': true
});

//首页logo
export const getLogo = (params) => fetch({
	'url': '/h5shop/index/getLogo/'+params,
	'method': 'get',
	'accredit': true
});

// 获取店铺信息接口
export const getOrgInfo = (params) => fetch({
	'url': '/h5shop/user/getOrgInfo/'+params,
	'method': 'get',
	'accredit': true
});

// 订单查询接口
export const getOrderInfo = (params) => fetch({
	'url': '/h5shop/getOrderInfo',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 查询订单
export const getOrderInfoByName = (params) => fetch({
	'url': '/h5shop/getOrderInfoByName',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 获取直客用户信息
export const userInfo = (params) => fetch({
	'url': '/h5shop/wechat/userInfo',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 直客授权接口
export const authorize = (params) => fetch({
	'url': '/h5shop/wechat/authorize',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 获取ERP用户信息接口
export const erpUserInfo = (params) => fetch({
	'url': '/h5shop/wechat/erpUserInfo',
	'method': 'get',
	'params': params,
	'accredit': true
});

// ERP用户授权接口
export const erpAuthorize = (params) => fetch({
	'url': '/h5shop/wechat/erpAuthorize',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 绑定ERP用户信息
export const bindERPUser = (params) => fetch({
	'url': '/h5/api/User/BindUserOpenID_H5Shop',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 上传图片
export const uploadTourImg = (params) => fetch({
	'url': '/h5shop/uploadTourImg',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 取消订单
export const cancelOrder = (params) => fetch({
	'url': '/h5shop/cancel/'+params,
	'method': 'get',
	'accredit': true
});

// 获取产品别名
export const getAliaseName = (params) => fetch({
	'url': '/h5shop/getAliaseName',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 评价
export const addComments = (params) => fetch({
	'url': '/h5shop/addComments',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 搜索历史记录
export const searchHistory = () => fetch({
	'url': '/h5shop/searchhistory',
	'method': 'get',
	'accredit': true
});

// 保存历史记录
export const saveSearch = (params) => fetch({
	'url': '/h5shop/searchhistory/savesearch',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 删除历史记录
export const delHistory = () => fetch({
	'url': '/h5shop/searchhistory/delhistory',
	'method': 'post',
	'accredit': true
});

// 热门搜索
export const hotSearch = () => fetch({
	'url': '/h5shop/searchhistory/heat',
	'method': 'get',
	'accredit': true
});

// 搜索商铺列表
export const searchStore = (params) => fetch({
	'url': '/h5/api/TravelAgency/GetTravelAgencys',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 搜索供应商
export const searchSuppliers = () => fetch({
	'url': '/h5shop/searchSuppliers',
	'method': 'get',
	'accredit': true
});

// 保存供应商
export const saveSupplier = (params) => fetch({
	'url': '/h5shop/searchSuppliers/saveSupplier',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 删除供应商
export const delSuppliers = (params) => fetch({
	'url': '/h5shop/searchSuppliers/delSuppliers',
	'method': 'post',
	'data': params,
	'accredit': true
});

// 商铺列表授权
export const storeListAuth = () => fetch({
	'url': '/h5shop/wechat/storeListAuth',
	'method': 'get',
	'accredit': true
});

// 定制游标签
export const getAllTag = () => fetch({
	'url': '/h5shop/custom/getAllTag',
	'method': 'get',
	'accredit': true
});


// 手机号绑定
export const WechatBindmobile = (params) => fetch({
	'url': '/h5/api/H5UserIdentification/WechatBindmobile',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 验证手机号
export const UserLoginByMobile = (params) => fetch({
	'url': '/h5/api/H5UserIdentification/UserLoginByMobile',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 绑定手机号发送验证码
export const sendMessage = (params) => fetch({
	'url': '/h5shop/sendMessage',
	'method': 'post',
	'data': params,
	'accredit': true
});

//校验验证码
export const checkCode = (params1,params2) => fetch({
	'url': '/h5shop/checkCode/'+params1+'/'+params2,
	'method': 'post',
	'accredit': true
});

// 重置用户Id
export const resetUserId = (params) => fetch({
	'url': '/h5shop/user/resetUserId',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 获取微信js-sdk配置参数
export const getSdkConfig = (params) => fetch({
	'url': '/h5shop/wechat/getSdkConfig',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 详情页产品访问统计接口
export const visits = (params) => fetch({
    'url': '/h5shop/visits',
    'method': 'post',
    'data': params,
    'accredit': true
});

// 用户转发分享后统计接口
export const amount = (params) => fetch({
    'url': '/h5shop/amount',
    'method': 'post',
    'data': params,
    'accredit': true
});

// 分享后详情页的验证
export const detailAuthorize = (params) => fetch({
	'url': '/h5shop/wechat/detailAuthorize',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 最新报价接口
export const latestQuote = (params) => fetch({
	'url': '/h5shop/latestquo/'+params,
	'method': 'get',
	'accredit': true
});

// 支付页面订单详情
export const getOrderInfoForPay = (params) => fetch({
    'url': '/h5shop/getOrderInfoForPay',
    'method': 'get',
    'params': params,
    'accredit': true
});

// 支付页面支付方式
export const getBankAccount = (params) => fetch({
    'url': '/h5shop/getBankAccount',
    'method': 'get',
    'params': params,
    'accredit': true
});

//支付页面上传图片
export const uploadPayImg = (params) => fetch({
    'url': '/h5shop/uploadPayImg',
    'method': 'post',
    'data': params,
    'accredit': true
});

// 提交支付申请
export const postPayment = (params) => fetch({
    'url': '/h5shop/postPayment',
    'method': 'post',
    'data': params,
    'accredit': true
});

// 订单详情
export const getOrderInfoDetail = (params) => fetch({
    'url': '/h5shop/getOrderInfoDetail/'+params,
    'method': 'post',
    'accredit': true
});

// erp展示详情页
export const erpShowdetails = (params) => fetch({
    'url': '/h5shop/erpShowdetails',
    'method': 'post',
    'data': params,
    'accredit': true
});


// base64上传图片
export const newUploadTourImg = (params) => fetch({
    'url': '/h5shop/newUploadTourImg',
    'method': 'post',
    'data': params,
    'accredit': true
});

// 页面调转接口
export const jump = (params) => fetch({
    'url': '/h5shop/wechat/jump',
    'method': 'get',
    'params': params,
    'accredit': true
});

// 优惠券购买提交接口
export const postCouponsPay = (params) => fetch({
    'url': '/h5shop/postCouponsPay',
    'data':params,
	'method': 'post',
	'accredit': true
});

// 优惠页授权
export const couponAuthorize = (params) => fetch({
	'url': '/h5shop/wechat/couponAuthorize',
	'method': 'get',
	'params': params,
	'accredit': true
});
// 跳转页授权
export const jumpAuthorize = (params) => fetch({
	'url': '/h5shop/wechat/jumpAuthorize',
	'method': 'get',
	'params': params,
	'accredit': true
});


// 获取优惠券产品接口
export const finProOtherProduct = () => fetch({
    'url': '/h5shop/finProOtherProduct',
	'method': 'get',
	'accredit': true
});

// h5优惠券获取二维码
export const getCoupon = (params) => fetch({
    'url': '/h5shop/wechat/getCoupon',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 搜索销售人员接口
export const GetAllUserByCondition = (params) => fetch({
    'url': '/h5/api/User/GetAllUserByCondition',
    'method': 'get',
    'params': params,
    'accredit': true
});

// 授权跳转页面
export const auth = (params) => fetch({
    'url': '/h5shop/wechat/auth',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 获取orgId,存到Storage
export const TravelAgencyGetTravelAgencysByshopDomain = (params) => fetch({
    'url': '/h5/api/TravelAgency/GetTravelAgencysByshopDomain',
    'method': 'get',
    'params': params,
    'accredit': true
});

// 根据出行天数查询目的地
export const getDestinationByTourDays = (params) => fetch({
    'url': '/h5shop/index/getDestinationByTourDays',
	'method': 'get',
	'params': params,
	'accredit': true
});

// 客服电话接口
export const GetCustomerServiceInfo = (params) => fetch({
    'url': '/h5/api/Comm/GetCustomerServiceInfo',
    'method': 'get',
    'params': params,
    'accredit': true
});
