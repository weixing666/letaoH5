// 封装一个模块，用于定义各种请求的方法

import instance from './config.js'

// 获取轮播图
export  function getLunBoData () {
  return  instance.get('/getlunbo')
}

// 获取首页推荐商品
export  function getRecommendData (limit = 10) {
  return  instance.get(`/recommend?limit=${limit}`)
}

// 获取新闻资讯列表数据
export  function getNewsListData (page = 1, pagesize = 5) {
  return  instance.get(`/getnewslist?page=${page}&pagesize=${pagesize}`)
}
// 获取新闻详情数据
export  function getNewsDetailData (id) {
  return  instance.get(`/getnew/${id}`)
}

// 获取文章评论的数据 getcomments/13?pageindex=3
export  function getNewsCommentData (id, page) {
  return  instance.get(`/getcomments/${id}?pageindex=${page}`)
}

// 发布文章评论 postcomment/:id
export  function postCommentData (id,content='') {
  return  instance.post(`/postcomment/${id}`,{content})
}

// 获取商品列表数 getgoods?pageindex=2
export  function getGoodsListData (page) {
  return  instance.get(`/getgoods?pageindex=${page}`)
}

// 获取图片所有的分类
export  function getPhotoCateData (page) {
  return  instance.get('/getcategory')
}

// 获取指定图片分组下的分类数据
export  function getPhotoCateListData (id) {
  return  instance.get(`/getcatelist/${id}`)
}

// 获取指定图片的缩略图
export  function getPhotoThumbData (id) {
  return  instance.get(`/getthumbimages/${id}`)
}

// 获取商品的基本信息
export  function getGoodsInfoData (id) {
  return  instance.get(`/getgoodsinfo/${id}`)
}

// 获取购物车商品的信息
export function getCarData (ids) {
  return  instance.get(`/getshopcarlist/${ids}`)
}


// 用户登录
export  function  userLogin (data) {
    return  instance.post(`/login`,data)
}

// 用户注册
export  function userRegister(data) {
    return  instance.post(`/register`, data)
}

// 用户登录
export async function  isLogin () {
    var token = localStorage.getItem('token')
    await instance.post(`/checktoken?token=${token}`)
}

// 获取用户的地址
export  function  userAddressData (userid) {
    return  instance.get(`/getaddress/${userid}`)
}

// 添加用户收货地址
export  function  addUserAddressData (userid,addressInfo) {
    return  instance.post(`/addaddress/${userid}`,addressInfo)
}

// 删除用户收货地址
export  function  deleteUserAddressData (addessid) {
    return  instance.post(`/deladdress/${addessid}`)
}

// 更新用户收货地址
export  function  updUserAddressData (addressId,addressInfo) {
    return  instance.post(`/updateaddress/${addressId}`,addressInfo)
}

// 提交订单接口
export  function  commitOrder (orderData) {
    return  instance.post(`/commitorder`,orderData)
}

// 获取用户的订单数据
export  function  userOrder (user_id) {
    return  instance.post(`/userorder/${user_id}`)
}

// 查询订单信息
export function getOrder(order_id) {
    return instance.post(`/getorder/${order_id}`)
}

// 搜索接口
export function fetchSearchData(value,sort,page,pagesize) {
    return instance.get(`/search?value=${value}&sort=${sort}&page=${page}&pagesize=${pagesize}`)
}

// 发送短信
export function genTelCode(tel) {
    return instance.post('/sendsms',{tel})
}

// 检查token
export function checkToken(token){
    return instance.post(`/checktoken?token=${token}`)
}
