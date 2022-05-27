<template>
    <div class="searchresult-container">
        <van-search
            v-model="value"
            show-action
            shape="round"
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @cancel="onCancel"
        >
            <template #label>
                <div>
                    <i class="icon-font icon-yanjing" style="display:none;"></i>
                </div>
            </template>
        </van-search>
        <van-dropdown-menu v-if="result.length">
            <van-dropdown-item
                @change="change"
                v-model="sort"
                :options="option2"
            />
        </van-dropdown-menu>

        <!-- 商品列表 -->
        <div class="goodslist">
            <router-link
                tag="div"
                :to="'/goodsdetail/' + item.id"
                class="item"
                v-for="item in result"
                :key="item.id"
            >
                <img v-lazy="item.img_url" alt />
                <div class="text">
                    <div class="title ellipsis">{{ item.title }}</div>
                    <div class="price">
                        <span class="shopPrice">¥ {{ item.sell_price }}</span>
                        <span class="marketPrice"
                            >¥ {{ item.market_price }}</span
                        >
                    </div>
                    <div class="hot">
                        <span>热卖中</span>
                        <span>剩余{{ item.stock_quantity }}件</span>
                    </div>
                </div>
            </router-link>
        </div>

        <!-- 搜索提示 -->
        <van-empty v-if="!result.length" image="search" description="暂无搜索结果" />
    </div>
</template>

<script>
import { fetchSearchData } from "@/api/index.js";
export default {
    data() {
        return {
            value: this.$route.params.value, // 搜索关键字
            sort: "buy",
            page: 1,
            pagesize: 10,
            option2: [
                // 默认 buy 降序
                { text: "销量排序", value: "buy" },
                { text: "好评排序", value: "likes" },
                { text: "价格排序", value: "sell_price" }
            ],
            result: []
        };
    },
    methods: {
        change(sort) {
            this.sort = sort;
            this.searchData();
        },
        onSearch(value) {
            this.value = value;
            this.searchData();
        },
        onCancel() {
            // 返回上两页
            this.$router.go(-2);
        },
        async searchData() {
            let data = await fetchSearchData(
                this.value,
                this.sort,
                this.page,
                this.pagesize
            );
            this.result = data;
        }
    },
    created() {
        this.searchData();
    }
};
</script>

<style lang="scss" scoped>
.searchresult-container {
    .goodslist {
        display: flex;
        flex-wrap: wrap;
        .item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 46%;
            margin: 4px;
            padding: 2px;
            border-radius: 6px;
            background: #fff;
            overflow: hidden;

            img {
                width: 100%;
            }

            .text {
                padding: 6px;
                .title {
                    padding: 2px;
                    font-size: 12px;
                    color: #333;
                }

                .price {
                    margin: 4px 0;

                    .shopPrice {
                        font-size: 16px;
                        color: #ff0000;
                        margin-right: 20px;
                    }

                    .marketPrice {
                        font-size: 12px;
                        color: #333;
                        text-decoration: line-through;
                    }
                }

                .hot {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    color: #645a5a;
                }
            }
        }
    }
}
</style>
