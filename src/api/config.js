// 这里我们封装封装一个axios的实例
import axios from 'axios'

import {
    Toast
} from "vant";
import router from "@/router/router.js"

import store from "@/store/carStore.js";

// 或者从配置文件中读取也行。
let baseURL = process.env.NODE_ENV === 'production' ? 'http://api.w0824.com/api' : '';
const instance = axios.create({
    baseURL
})

// 添加请求拦截器
instance.interceptors.request.use(async function (config) {
    // console.log('请求拦截器');
        // 设置自定义请求头(authorized-要求是https)携带token到后台，方便后台进行验证
        var token = store.state.token;
        token && (config.headers.token = token)
        // If-Modified-Since 是标准的HTTP请求头标签，在发送HTTP请求时，
        // 把浏览器端缓存页面的最后修改时间一起发到服务器去，服务器会把这个时间与服务器上实际文件的最后修改时间进行比较
        config.headers['If-Modified-Since'] = 0; //设置请求头，告诉服务端不要缓存，获取最新数据
        // 设置对应的loading
        !store.state.isPending && store.commit('changeIsPending', true)
        return config
    },
    function (error) {
        return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // console.log('响应拦截器');
    // 对响应数据做点什么
    // 关闭loading
    store.commit('changeIsPending', false)
    var status = response.data.status;
    switch (status) {
        case 40001:
            Toast('用户信息过期，请重新登录');
            // 清除token
            store.commit('clearToken')
            router.replace({
                path: '/login',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            });
            break;
        case 500:
            Toast('服务器异常');
    }
    return response.data
}, function (error) {
    // 对响应错误做点什么
    store.commit('changeIsPending', false)
    return Promise.reject(error.response)
})

export default instance
