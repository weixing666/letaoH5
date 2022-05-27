<template>
    <div class="home_container">
        <!-- 头部 -->
        <div class="header">
            <img src="@/assets/images/logo.png" alt />
            <van-search
                :placeholder="searchValue"
                @focus="searchFocus"
            ></van-search>
        </div>
        <h1 v-if="false">
            <button @click="addCaiwuRoute">add财务路由</button>
            <button @click="$router.push('/caiwu')">go财务财务</button>
        </h1>

        <!-- 轮播图 -->
        <van-swipe class="my-swipe" :autoplay="3000" :indicator-color="color">
            <van-swipe-item v-for="item in lunboData" :key="item.img">
                <img :src="item.img" />
            </van-swipe-item>
        </van-swipe>

        <!-- 8宫格 -->
        <van-grid :column-num="4" :border="false">
            <van-grid-item @click="goodsList" icon="photo-o" text="文字">
                <img src="../../assets/images/menu10.png" alt />
                <div class="text">数码电器</div>
            </van-grid-item>
            <van-grid-item to="/newslist" icon="photo-o" text="文字">
                <img src="../../assets/images/menu19.png" alt />
                <div class="text">乐淘头条</div>
            </van-grid-item>
            <van-grid-item to="/photo" icon="photo-o" text="文字">
                <img src="../../assets/images/menu18.png" alt />
                <div class="text">美图欣赏</div>
            </van-grid-item>
            <van-grid-item icon="photo-o" to="/category" text="文字">
                <img src="../../assets/images/menu15.png" alt />
                <div class="text">分类</div>
            </van-grid-item>
            <van-grid-item icon="photo-o" text="文字">
                <img src="../../assets/images/menu12.png" alt />
                <div class="text">9.9元拼单</div>
            </van-grid-item>
            <van-grid-item icon="photo-o" text="文字">
                <img src="../../assets/images/menu15.png" alt />
                <div class="text">话费充值</div>
            </van-grid-item>
            <van-grid-item icon="photo-o" text="文字">
                <img src="../../assets/images/menu16.png" alt />
                <div class="text">物流查询</div>
            </van-grid-item>
            <van-grid-item icon="photo-o" text="文字">
                <img src="../../assets/images/menu17.png" alt />
                <div class="text">查看更多</div>
            </van-grid-item>
        </van-grid>

        <!-- 商品列表 -->
        <div class="divider">
            <van-divider>为你推荐</van-divider>
        </div>

      <div class="goodslist" ref="goodslist">
            <router-link
                :to="'/goodsdetail/' + item.id"
                tag="div"
                class="item"
                v-for="item in recommenData"
                :key="item.id"
            >
                <img v-lazy="item.img_url" alt />
                <div class="text">
                    <div class="title overflow_ellipsis">{{ item.title }}</div>
                    <div class="footer">
                        <span class="price"
                            >&yen;&nbsp;{{ item.sell_price }}</span
                        >
                        <span class="buy">{{ item.buy }}购买</span>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
import { Swipe, SwipeItem, Grid, GridItem, Divider } from "vant";
import { getLunBoData, getRecommendData } from "@/api/index.js";

export default {
    name: "home-component",
    data() {
        return {
            searchValue:"试试手气",
            lunboData: [],
            recommenData: [],
            color: "#ccc",
        };
    },
    components: {
        "van-swipe": Swipe,
        "van-swipe-item": SwipeItem,
        "van-grid": Grid,
        "van-grid-item": GridItem,
        "van-divider": Divider
    },
    methods: {
        addCaiwuRoute(){
            let asyncRoutes = [
                {
                    path:"/caiwu",
                    component: ()=> import('@/views/caiwu.vue'),
                    name:"caiwu",
                    meta: {
                        pageTitle: "财务管理",
                        isShowNavBar: true,
                        isShowTabBar: true,
                        requireAuth: true
                    }
                }
            ];
            this.$router.addRoutes(asyncRoutes)
        },
        searchFocus(e) {
            this.$router.push('/search');
        },
        // 获取轮播图数据
        async getLunbo() {
            var res = await getLunBoData();
            this.lunboData = res.message;
        },
        async getRecommend() {
            var { message } = await getRecommendData(12);
            this.recommenData = message;
        },
        goodsList() {
            this.$router.push("/goodslist");
        },
        onSearch(val) {
            this.$toast(val);
        },
        onCancel() {
            this.$toast('取消');
        },
    },
    created() {
        this.getLunbo();
        this.getRecommend();
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/common.scss";
.home_container {
    background: rgb(240, 237, 237);
    padding-bottom: 50px;
    // 头部搜索框
    .header {
        padding-left: 4px;
        position: sticky;
        z-index: 999;
        top: 0;
        left: 0;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
            height: 40px;
        }
        .van-search {
            flex: 1;
        }
    }
    .my-swipe {
        height: 200px;
        .van-swipe-item {
            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .van-grid {
        background: #fff;
        .van-grid-item {
            img {
                width: 50%;
            }
            .text {
                color: #524949;
                font-size: 14px;
            }
        }
    }

    .divider {
        .van-divider {
            text-align: center;
            padding: 0 8px;
            color: #6a6363;
            font-size: 16px;
            border-color: #c3c5c8;
            margin: 8px 0;
        }
    }

    .goodslist {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 2px;
        .item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 46%;
            margin: 4px;
            border-radius: 6px;
            background: #fff;
            overflow: hidden;
            img {
                width: 100%;
            }

            .text {
                padding: 2px;
                display: flex;
                flex-direction: column;

                .title {
                    color: #333;
                    font-size: 12px;
                }

                .footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 4px;

                    .price {
                        font-size: 14px;
                        color: #f50;
                        padding: 10px 0;
                    }

                    .buy {
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
        }
    }
}
</style>
