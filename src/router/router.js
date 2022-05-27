import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store/carStore.js"

import home from '@/components/tabbar/home'
import user from '@/components/tabbar/user.vue'
import newslist from '@/components/news/newslist.vue'
import newsdetail from '@/components/news/newsdetail.vue'
import goodslist from '@/components/goods/goodslist.vue'
import shopcar from '@/components/goods/shopcar.vue'
import goodsdetail from '@/components/goods/goodsdetail.vue'
import photo from '@/components/photo/photo.vue'
import login from '@/components/users/login.vue'
import register from '@/components/users/register.vue'
import addressadd from '@/components/address/addressadd.vue'
import addressedit from '@/components/address/addressedit.vue'
import order from '@/components/order/order.vue'
import count from '@/demo/count.vue'
import search from '@/components/search.vue'
import searchresult from '@/components/search-result.vue'
import category from '@/components/goods/category.vue'

Vue.use(VueRouter)
import { Toast } from 'vant';
// 实例化路由对象，写路由匹配规则
let router = new VueRouter({
    // mode: 'history', // 默认hash
    routes: [{
            path: '',
            redirect: '/home'
        },
        {
            path: '/home',
            name: "home",
            component: home,
            meta: {
                pageTitle: "首页",
                isShowTabBar: true,
                isShowNavBar: false,
                keepAlive: true,
                active:0,
                requireAuth: false,

            }
        },
        {
            path: '/category',
            name: "category",
            component: category,
            meta: {
                pageTitle: "分类",
                isShowTabBar: true,
                isShowNavBar: true,
            }
        },
        {
            path: '/count',
            component: count
        },
        {
            path: '/user',
            component: user,
            name: "user",
            props: true,
            meta: {
                pageTitle: "个人中心",
                isShowTabBar: true,
                isShowLeftArrow: false,
                requireAuth: true,
                active: 2,
            }
        },
        {
            path: '/search',
            component: search,
            name: "search",
            meta: {
                isShowNavBar:false,
                isShowTabBar: false,
                isShowLeftArrow: false
            }
        },
        {
            path: '/searchresult/:value',
            component: searchresult,
            name: "searchresult",
            meta: {
                isShowNavBar: false,
                isShowTabBar: false,
                isShowLeftArrow: false
            }
        },
        {
            path: '/newslist',
            component: newslist,
            meta: {
                pageTitle: "新闻列表",
                isShowTabBar: false,
                keepAlive: true,
                index: 1
            }
        },
        {
            path: '/newsdetail/:id',
            component: newsdetail,
            name: "newsdetail",
            props: true,
            meta: {
                pageTitle: "新闻详情",
                isShowTabBar: false,
                isShowNavBar: false,
                index: 2
            }
        },
        {
            path: '/goodslist',
            component: goodslist,
            name: "goodslist",
            meta: {
                pageTitle: "商品列表",
                isShowTabBar: true,
                keepAlive: true,
                index: 3,
            }
        },
        {
            path: '/goodsdetail/:id',
            component: goodsdetail,
            name: "goodsdetail",
            props: true,
            meta: {
                pageTitle: "商品详情",
                isShowTabBar: false,
                index: 4
            }
        },
        {
            path: '/photo',
            component: photo,
            meta: {
                pageTitle: "图片",
                isShowTabBar: true,
                isShowNavBar: true,
                keepAlive: true,
            }
        },
        {
            path: '/shopcar',
            component: shopcar,
            name: "shopcar",
            meta: {
                pageTitle: "我的购物车",
                isShowTabBar: true,
                isShowNavBar: true,
                isShowLeftArrow: false,
                requireAuth: false,
                active: 1,
            }
        },
        {
            path: '/login',
            component: login,
            name: "login",
            meta: {
                pageTitle: "登录",
                isShowLeftArrow: false,
            }
        },
        {
            path: '/register',
            component: register,
            meta: {
                pageTitle: "注册",
                isShowLeftArrow: false,
            }
        },
        {
            path: '/addressmanage',
            // 按需导入路由组件
            component: ()=> import('@/components/address/addressmanage.vue'),
            name: "addressmanage",
            meta: {
                pageTitle: "地址管理",
                isShowTabBar: false,
                requireAuth: true
            }
        },
        {
            path: '/addressadd',
            component: addressadd,
            meta: {
                pageTitle: "添加地址",
            }
        },
        {
            path: '/addressedit/:addressInfo',
            component: addressedit,
            meta: {
                pageTitle: "编辑地址",
            }
        },
        {
            path: '/order',
            component: order,
            meta: {
                pageTitle: "订单",
                isShowTabBar: false,
                isShowNavBar: true,
                requireAuth: true
            }
        },
    ],
    // 滚动行为，记录上一个页面滚动的距离
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})

const whiteList = ['/login'] // no redirect whitelist

// 全局路由前置守卫导航
router.beforeEach(async (to, from, next) => {
    let {name,path} = from;
    let fromRoute = {name,path}
    localStorage.setItem('fromRoute', JSON.stringify(fromRoute));

    // 重置
    store.commit('changeToggleTabBar', true)
    store.commit('changeToggleNavBar', true)
    store.commit('changeBackLeftArrow', true)

    if (to.meta.isShowTabBar !== undefined) {
        store.commit('changeToggleTabBar', to.meta.isShowTabBar);
    }

    if (to.meta.isShowNavBar !== undefined) {
        store.commit('changeToggleNavBar', to.meta.isShowNavBar)
    }

    if (to.meta.pageTitle !== undefined) {
        store.commit('changePageTitle', to.meta.pageTitle)
    }

    if (to.meta.isShowLeftArrow !== undefined) {
        store.commit('changeBackLeftArrow', to.meta.isShowLeftArrow)
    }
    // 显示返回按钮
    var toFromRouteArr = ['shopcar-goodsdetail', 'shopcar-addressmanage'];
    var toFromRoute = `${to.name}-${from.name}`.toLowerCase();
    if (toFromRouteArr.includes(toFromRoute)) {
        store.commit('changeBackLeftArrow', true)
    }

    // 1. 获取token
    let token = store.state.token;
    if (token) {
        // 有token： 1-1. 是否是登录页=》直接首页，否则判断权限
        if (to.path === '/login') {
            next({
                path: '/'
            })
        }else {
            next();
        }
    }else {
        let requireAuth = to.meta.requireAuth
        // 无token: 是否在白名单内，在则放行 to.meta.requireAuth
        if (!requireAuth) {
            next()
        } else {
            if (to.path === '/login') {
                next()
            }else {
                // 抑制掉重复
               router.push('/login').catch(() => {});
            }
        }
    }

})

router.afterEach((to, from) => {
    // to and from are both route objects.
})

export default router
// 暴露路由对象即可
