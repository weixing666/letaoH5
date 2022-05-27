# vueletaoshop随堂笔记

项目仓库地址： https://gitee.com/ww24kobe/letaofront
Api接口文档：https://easydoc.net/

## 全局控制navbar的显示或隐藏

**分析：** 
- 首页隐藏navbar
- 购物车、个人中心、商品列表等都要显示navbar、

**实现思路：**
- 因为是否要显示头部的navbar，是跟着路由走的。只需要把显示或隐藏的标识定义路由的元信息中（meta）
```js
{
    path: "/shopcar",
    component: () => import('@/components/shopcar.vue'),
    meta:{
      isShowNavBar: true,
    }
  },
```
- 用watch去监听route的mate元信息，在动态的控制页面头部显示或隐藏（达到数据驱动视图）
```
 watch:{
    // 监听当前路由变化
    $route(newRoute,oldRoute){
      console.log(newRoute,oldRoute)
      // 根据meta中的isShowNavBar让navbar显示或隐藏
      let {isShowNavBar} = newRoute.meta
      this.toggleNavbar(isShowNavBar)
    }
  }
```

## 全局控制navbar的标题显示

和上面显示或隐藏navbar的思路一样


## 配置axios请求实例

```js
// src/api/index.js
import axios from 'axios';
import store from "@/store/index.js";

const instance = axios.create({
  baseURL: 'http://api.w0824.com/api',
  timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
   // 把loading设置true
   store.commit('setLoading',true)
   console.log(store.state.loading); // true
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 把loading设置false，关闭loading
  store.commit('setLoading',false)
  console.log(store.state.loading); // false
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 把loading设置true
  store.commit('setLoading',false)
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default instance;

```



## 配置全局的loading提示效果
- 1.在Vuex定义一个开关变量，如 loading,来记录loading开启和关闭。 
- 2.在请求拦截器将loading设置为true,在响应拦截器将loading设置为false
- 3.在app.vue根组件的computed中监听loading的值变化，用watch去监听computed中的loading,是true给加载效果提示，false则关闭loading提示。



## 组件中data引入相对路径图片的问题

解决办法：

- 使用require

  ```js
     { to: "/goodslist", img: menu10, text: "数码电器" },
     { to: "/newslist", img: require("@/assets/menu19.png"), text: "乐淘头条" },
  ```

- 使用es6 import 

  ```js
  import menu10 from "@/assets/menu10.png";
  ```

  

## 全局的断网处理

如何实现（思路）

- navigator.online 获取断网的结果，true - online, false -offline

- 在app.vue中mounted生命周期函数监听断网和离线的情况

  ```js
  methods:{
      updateOnlineStatu(e){
        // 修改data中online的值
        this.online = ( e.type === 'online' ? true : false )
      }
  },  
  mounted(){
      // 监听网络变化情况
      window.addEventListener('online',this.updateOnlineStatu)
      window.addEventListener('offline',this.updateOnlineStatu)
    }
  ```

- 在data中定义一个变量online，来记录断网的值\

  ```js
  data(){
      return {
        online: navigator.online,
      }
    },
  ```

  

- 用watch进行监听online的值，再给用户相应的提示

  ```js
  watch:{
      online(bool){
        if(bool === false){
          // 没网，给用户提示
          this.$toast({
            message:"请检查网络"
          })
        }
     }
  }
  ```

  

## 缓存组件-keep-alive

如何实现组件的缓存。

思路：

- 可以把组件是否缓存的标识记录在对应路由route元信息meta中，

  ```js
   meta:{
        isShowNavBar: false,
        title:"首页",
        keepAlive: true
   }
  ```

- 在app.vue组件中的router-view组件中使用v-if对keepAlive进行判断是否需要缓存

  ```html
   <!-- 这里放缓存组件 -->
   <keep-alive>
   	<router-view v-if="$route.meta.keepAlive"></router-view>
   </keep-alive>
  
  <!-- 这里是放不缓存的组件 -->
  <router-view v-if="!$route.meta.keepAlive"></router-view>
  ```

  

## 抽离商品列表组件

- 父子通信



## 获取动态路由参数

- this.$router.params.goods_id
- 路由中通过`props:true`进行解构，组件通过props进行接收

## 页面返回

```js
this.$router.go(-1) 或 this.$router.back()
```



## 商品列表数据渲染



## 商品列表下拉刷新

分析：

- 清空原来的数据
- 在发起一起新请求，page=1



![1616145425253](assets/1616145425253.png)

```
// goodslist.vue
<template>
  <div>
    <!-- <h1>商品列表页面</h1> -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
      <van-list  v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <goodslist :data="goodsListData"></goodslist>
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
// 导入当前页面的api接口
import { getGoods } from "@/api/goodslist.js";
// 导入商品列表组件
import goodslist from "@/components/goodslist-com.vue";
export default {
  data() {
    return {
      // van-list组件
      loading: false, // 是否处于加载状态，加载过程中不触发load事件,默认 false， false默认会onload加载一次
      finished: false, // 是否已加载完成，加载完成后不再触发load事件

      // van-pull-refresh组件
      refreshing: false, //  是否处于加载中状态

      page: 1,
      pagesize: 10,
      goodsListData: []
    };
  },
  methods: {
    // onload是真正加载数据的
    onLoad() {
      // 插件会默认执行一遍onLoad
      console.log('加载onLoad')
      // 加载商品列表
      this.loadGoodsList();
    },
    onRefresh() {
      console.log('下拉刷新onRefresh')
      // 清空列表数据
      this.goodsListData = [];

      // 说明处于下拉刷新加载中...
      this.refreshing = true;
      this.loading = true;
      this.finished = false;

      // 加载数据
      this.onLoad()
    },
    async loadGoodsList() {
      let { message } = await getGoods(this.page, this.pagesize);
      // 说明数据加载完成
      this.loading = false
      this.finished = true;
      this.refreshing = false
      this.goodsListData = message;
    }
  },
  created() {
    // 加载商品列表
    // this.loadGoodsList();
  },
  components: {
    goodslist
  }
};
</script>

<style lang="scss" scoped>
</style>

```

## 点击加载更多商品
思路分析：
- 1.绑定单击事件
- 2.点击获取下一页， 即页面page++
- 3.把获取到的更多数据连接到原数组中去。 concat连接数组

为了防止用户频繁的点击，发起请求之前按钮应该是loading中且禁用状态，数据加载完毕之后，恢复按钮原来状态



思考：如果数据返回为空数组，说明数据加载完毕了。下次在点击则不发请求。

如何实现：可以定义一个开关变量，来记录是否已经加载完毕。说明数据加载完毕了则把变量设置true,下次点击按钮的时候判断如果此
变量是true,则不在发请求。

## 组件切换动画

两个难点：
- 如何知道是前进还是返回? 可以在路由元信息meta中定义一个变量如deepIndex。
```js
{
    path: "/home",
    component: () => import('@/components/home.vue'),

    meta:{
      isShowNavBar: false,
      title:"首页",
      keepAlive: false,
      deepIndex: 1
    }
  },
  {
    path: "/goodslist",
    component: () => import('@/components/goodslist.vue'),

    meta:{
      isShowNavBar: true,
      title:"商品列表",
      keepAlive: false,
      deepIndex: 2
    }
  }
```
- 动画是从右进来还是从右出去？ 监听路由的deepIndex，进行判断，设置不同的进场和出场过渡类名即可
```HTML
// app.vue

<template>
   <!-- 缓存组件 -->
    <transition :name="transitionName" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
    </transition>


    <!-- 这里是放不缓存的组件 -->
    <transition :name="transitionName" mode="out-in">
        <keep-alive>
           <router-view v-if="!$route.meta.keepAlive"></router-view>
        </keep-alive>
    </transition>
</template>

  watch:{
    // 监听路由变化
    $route(newRoute,oldRoute){
      // 根据路由meta元信息中的deepIndex的大小。来决定使用哪个类
      if(newRoute.meta.deepIndex > oldRoute.meta.deepIndex){
        console.log('slideRightIn')
          // 前进  slideRightIn-enter-active ,动态给transition的name设置不同类名即可	
          this.transitionName = 'slideRightIn'
      }else{
        console.log('slideRightOut')
        // 后退  slideRightOut-leave-active
        this.transitionName = 'slideRightOut'
      }
    },
    
  },


  // 进场
  .slideRightIn-enter-active {
    animation: slideRightIn 0.2s linear
  }

  // 出场 .slide-leave-active
  .slideRightOut-leave-active {
    animation: slideRightOut 0.2s linear
  }

  @keyframes slideRightIn {
    from {
      opacity: 0;
      transform: translate3d(100%,0,0)
    }

    to {
      opacity: 1;
      transform: translate3d(0,0,0)
    }
  }

   @keyframes slideRightOut {
    from {
      opacity: 1;
      transform: translate3d(0,0,0)
    }

    to {
      opacity: 0;
      transform: translate3d(100%,0,0)
    }
  }


```


## 定位网页指定部分：
```
<div @click="goComment">回到评论</div>

goComment(){
    // 获取元素距离视口的高度
    let { top } = this.$refs.comment.getBoundingClientRect();
    document.documentElement.scrollTop = document.body.scrollTop = top;
}
```
或者通过：[/getBoundingClientRect]

实现平滑滚动：修改`public/index.html`
```
 <style>
      html {
        scroll-behavior: smooth;
      }
    </style>
```
(https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)

## 深度选择器
```
    //::v-deep或 /deep/ 、 >>> 深度选择器:可以直接修改富文本和子组件内部的样式
    .content{
       ::v-deep img {
        width: 100%;
      }
    }
```

## 创建回到顶部的组件

思路：组件具备的条件
- 组件默认的内容，使用插槽可以更改默认内容
- 用户可以自定义组件距离视口底部的距离
- 网页往下滚动多少距离才显示组件

## 让用户决定组件的样式
- 如果是固定样式，可以写成class
- 如果是要覆盖原组件的样式，可以通过style覆盖。



## 替换富文本中图片宽度，防止撑开页面
```
// 把content中的width属性替换成空字符，为了防止撑开网页宽度
      this.goodsInfo.content = message.content.replace(/width=[\w'"]+\s?/g,'');
```

## 电商两个重要商品概念
- spu: 通俗说就是一个产品。 如果iphone6
- sku: spu + 商品规格（属性）= 商品

源码： https://gitee.com/ww24kobe/vueletaoshop

## 网页中显示小图标
- img - src=base64
- background-image
- 字体图标，阿里矢量图
- svg
- canvas

## token权限验证

1. 用户输入用户名和密码成功后，服务端返回token,我们将其存储在本地存储
2. 后续的每次请求，都需要把token通过axios的请求拦截器的请求头设置携带给服务端进行验证
3. 服务端需要获取请求头中的token,进行校验，如校验失败返回40001,
4. 在axios响应拦截器中统一对错误状态码进行处理


## 页面级别的验证

- 有些页面需要有权限才可以访问，如：订单页面，个人中心，购物车....
- 如首页是不需要验证的。

解决办法：可以在路由的元信息中添加一个是否需要验证的字段如：requireAuth
```
meta:{
    title:"登录",
    requireAuth:false
}
```

- 随后在前守卫导航中对上面的requireAuth进行授权验证

## vue带来的问题
页面加载完毕，vuex只会初始化一次，即只会获取本地存储中的数据一次。你退出之后，登录在回到购物车页面，vuex获取到的token还是最初的token。
> vuex中的刷新页面就会丢失了。

解决办法：
 在路由前守卫导航中，每次都重新获取本地存储中的token。在写入到vuex中。

```js

// 导航前守卫
router.beforeEach(async (to, from, next) => {

  // 判断路由的权限(说明是其他非登录页面)
  if (to.path !== '/login' && to.meta.requireAuth) {
    console.log('授权')
    
    // 每次进入获取最新token(主要防止vuex读取旧的token，因为vuex仅会初始化一次)
    let token = localStorage.getItem('token') || '';
    store.commit('setToken',token)
    
    if (store.state.token) {
      // 有 token 还需要校验合法性
      let { status,message } = await store.dispatch('checkToken');
      if (status === 40001) {

        Toast('token有，但失效')
        store.commit('clearToken');
        
        // 解决重复重定向问题
        router.push({
          name:'login'
        }).catch(() => {});
      } else {
		// console.log('权限ok')
        next()
      }

    } else {
    
	  router.push({
		name:'login'
	  }).catch(() => {});
    }

  } else {
    // 非登录页面-放行
    next()
  }


})
```
## 重复调用next带来的问题（重定向）

报错如下：
```
vue-router.esm.js?8c4f:2065 Uncaught (in promise) Error: Redirected when going from "/home" to "/users" via a navigation guard.
```

解决办法如下：
```
router.push({
          name:'login'
}).catch(() => {});
```

> 前守卫导航中，next函数仅能调用一次。 
[前守卫导航](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB)


## 如何快速编写静态页面
- 确定版心，哪些宽度是通栏
- 观察页面整体的布局结构，抽离出共性，。定义成公共css或scss/less。
- 把一些公共的区块归为一类，定义相同的class类。
- 把一些基本常用的类封装起来
  - 页面重置化（css reset）
  - 清除浮动、水平垂直居中、多行省略号
  - 模态框
    - 全屏遮盖（position:fixed; 四边偏移量设置为0 或宽高都是100%,left-top=>0）
    - 区域遮盖 （position:absolute; 四边偏移量设置为0）
  - 常见的动画（淡入淡出-移动滑出-旋转动画（loading））
  - 个人常用的字体(阿里矢量图)



## 加入商品到购物车

- 购物车的商品存储形式，一个购物车商品格式如下：

  ```
  [
  {goods_id（商品id）,selected(默认选中状态),number（数量）,sell_price（价格）}
  ...
  ]
  ```

- 购物车数据存放在哪里

  - 调用后台接口，存储在购物车表中
  - 可以存储在本地存储中

  这里我们以存放在本地存储为例

由于购物车数据关系比较紧密，为了数据的整体控制，可以把本地存储中的购物车数据存同步到vuex。便于全局控制。



##  github一些搜索代码片段的技巧

```
destroyed filename:*.vue
```



## 获取对应商品的选中状态和购买数量

记住：如果数据之间的有关联性，先观察其特点,再去设置对应数据结构，便于取数据

```
{商品id:商品数量}
{87:2,90:4}


{商品id:是否选中}
{87:true,90:false}
```

所以通过getter构造成上面数据格式即可，然后在组件中通过商品的id作为key,取出相应的value



## 让相应的tabbar高亮显示

思路：

1. 设置底部tabbar路由的meta，分别设置设置对应的active的值

```
// 首页home
meta:{
    active:0
}

// 购物车
meta:{
    active:1
}

// 个人中心
meta:{
    active:2
}
```

2. app组件中通过watch监听`$route`  的，meta的active,把值设置给data的active即可，页面驱动视图

  ​	

## linux服务器上传下载文件

- 方式1： 宝塔

- scp上传和下载（linux和linux之间）

- lrzsz 

  ```
  安装
  yum install -y lrzsz
  上传：rz
  下载: sz
  xshell中使用
  ```

- ssh一键部署





##  进程和端口相关的shell命令

- 查看进程

  ```
  ps -A |grep sshd/mysqld/node
  ```

  

- 查看3000是否启动了

  ```
  netstat -natup |grep 3000
  ```

- 查看3000的进程号（PID=process ID）,便于杀死

  ```
  lsof -i :3000
  ```

- 删除指定的进程

  ```
  kill -9 PID
  ```

```
[
{
    number: 10,
    status: 1,
    goods_ids:19
    goodsInfo:[
        {
            goods_id:19,
        	title: iphone10,
        	thumb: 111.png
        }
    ]
}
{
    number: 10,
    status: 1,
    goods_ids:19,20,
    goodsInfo:[
        {
            goods_id:19,
        	title: iphone10,
        	thumb: 111.png
        },
         {
            goods_id:20,
        	title: iphone10,
        	thumb: 111.png
        }
    ]
}
]
```

## BUG记录

- token 前守卫





