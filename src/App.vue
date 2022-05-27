<template>
    <div class="app_container">
        <!-- navbar -->
        <van-sticky>
            <van-nav-bar
                v-show="toggleNavBar"
                :title="pageTitle"
                :left-arrow="isShowLeftArrow"
                @click-left="goBack"
            />
        </van-sticky>

        <!-- 中间(内容不能写死，这里放路由匹配的动态内容) -->
        <!-- <keep-alive :include="['newslist-component','home-component']">
      <router-view></router-view>
    </keep-alive> -->
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>

        <router-view v-if="!$route.meta.keepAlive"></router-view>

        <!-- 底部 -->
        <van-tabbar v-if="toggleTabBar" v-model="active">
            <van-tabbar-item to="/home" icon="wap-home-o">首页</van-tabbar-item>
            <van-tabbar-item
                to="/shopcar"
                icon="cart-o"
                :badge="$store.getters.carTotal"
                >我的购物
            </van-tabbar-item>
            <van-tabbar-item to="/user" icon="user-o">我的乐淘-master</van-tabbar-item>
        </van-tabbar>


    </div>
</template>

<script>
// 导入获取vuex中的state的辅助函数
import { mapState } from "vuex";
export default {
    data() {
        return {
            active: 0,
            title: "",
            onLine: navigator.onLine,
        };
    },
    computed: {
        ...mapState([
            "isPending",
            "toggleTabBar",
            "toggleNavBar",
            "pageTitle",
            "isShowLeftArrow"
        ])
    },
    methods: {
        goBack() {
            let routeName = this.$route.name;
            if (routeName === "shopcar") {
                this.backOrderConfirm();
                return;
            }
            this.$router.go(-1);
        },
        backOrderConfirm() {
            // 订单页面返回逻辑
            this.$Dialog
                .confirm({
                    title: "确认要放弃付款吗?",
                    confirmButtonText: "是的"
                })
                .then(() => {
                    this.$router.go(-1);
                })
                .catch(() => {
                    // on cancel
                });
        },
        setLoading(isPending) {
            //判断true还是false,给loading和关闭loading即可
            isPending
                ? this.$toast.loading({
                      message: "loading...",
                      forbidClick: true,
                      duration: 0 // 持续展示 toast
                  })
                : this.$toast.clear();
        },
        updateOnlineStatus(e) {
            const { type } = e;
            // type：online在线，offline-离线
            this.onLine = type === "online";
        },
        setActiveIndex(to){
            to.meta.active !== undefined  && ( this.active = to.meta.active )
        }
    },
    watch: {
        // 可以监听data和computed
        isPending: function(isPending) {
            // 判断true还是false,给loading和关闭loading即可
            this.setLoading(isPending);
        },
        $route: {
            handler:function(to, from) {
                // 刷新时，to是当前路由，from则为undefined
                this.setActiveIndex(to);
            },
            immediate:true  // 立即执行一次，不加刷新则不会触发
        },
        onLine: function(newValue, oldVal) {
            if (!newValue) {
                this.$toast("似乎断网了,请检查网络");
            }
        }
    },
    mounted() {
        window.addEventListener("online", this.updateOnlineStatus);
        window.addEventListener("offline", this.updateOnlineStatus);
    }
};
</script>

<style lang="scss" scoped>

.app_container {
    min-width: 320px;
    max-width: 750px;
    margin: auto;
    height: 100vh;
    background-color: #e9e9e9;
}

.right-in-enter-active {
    animation-name: right-in;
    animation-duration: 0.3s;
}
.right-out-leave-active {
    animation-name: right-out;
    animation-duration: 0.3s;
}
@keyframes right-in {
    0% {
        transform: translate3d(100%, 0, 0);
    }
    100% {
        transform: translate3d(0, 0, 0);
    }
}
@keyframes right-out {
    0% {
        transform: translate3d(0, 0, 0);
    }
    100% {
        transform: translate3d(100%, 0, 0);
    }
}
</style>
