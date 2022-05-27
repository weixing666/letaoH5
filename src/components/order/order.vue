<template>
    <div class="order-container">
        <van-tabs v-model="active">
            <van-tab
                v-for="order in tabsList"
                :key="order.status"
                :title="order.title"
            >
                <van-card
                    v-for="item in getOrderStatusGoods(order.status)"
                    :key="item.id"
                    :price="item.total_price"
                    :desc="'共' + item.number + '件商品'"
                    :title="item.goods[0].title"
                    :thumb="item.goods[0].thumb_path"
                    @click="goPay(item)"
                >
                    <template #tags>
                        <van-tag plain type="danger"
                            >付款方式：{{ item.pay_way }}</van-tag
                        >
                    </template>
                    <template #footer>
                        <div>
                            下单时间：{{
                                item.add_time
                                    | unixToFormat("YYYY-MM-DD HH:mm:ss")
                            }}
                        </div>
                        <van-button
                            size="mini"
                            :type="statusBtnStyle(item.status)"
                            >{{ statusText(item.status) }}</van-button
                        >
                        <van-button size="mini" type="danger" @click="callPhone"
                            >联系客服</van-button
                        >
                    </template>
                </van-card>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import { userOrder, getCarData, getOrder } from "@/api/index.js";
import { userInfo } from "@/util/tool.js";
export default {
    data() {
        return {
            active: 0,
            allOrder: [],
            tabsList: [
                { title: "全部", status: "all" },
                { title: "未付款", status: "0" },
                { title: "已付款", status: "1" },
                { title: "完成", status: "2" }
            ],
            orderGoods: [], // 订单所有的商品
        };
    },
    methods: {
        callPhone() {
            this.$Dialog
                .confirm({
                    message: "请拨打：13413132233",
                    confirmButtonText: "拨打"
                })
                .then(() => {
                    window.location.href = "tel://" + 13413132233;
                })
                .catch(() => {});
        },
        // 获取当前登录用户的订单
        async getOrder() {
            var { id } = userInfo();
            var orderData = await userOrder(id);
            // 还要获取订单中的商品
            var pros = []; // 存储所有的promise
            let ids = []; // 订单中所有商品ID
            orderData.forEach(item => {
                item.goods_ids.split(",").forEach(id => ids.push(parseInt(id)));
            });

            // 商品ID去重
            ids = Array.from(new Set(ids));

            ids.forEach( id =>  pros.push( getCarData(id) ) );

            // 获取到了所有的订单商品
            this.orderGoods = await Promise.all(pros);

            // 关联订单和订单商品
            // 在当前订单中额外添加一个属性如goods,记录当前订单的商品
            orderData.map((item, index) => {
                // 获取订单相应的商品
                item.goods = this.findOrderGoods(item.goods_ids)
            });

            this.allOrder = orderData;
        },
        findOrderGoods(goods_id){
            let goodsArr = [];
            this.orderGoods.forEach(goods => {
                if( goods.message.length && goods.message[0].id == goods_id ){
                    goodsArr.push(goods.message[0]);
                }
            })
            return goodsArr;
        },
        // 根据订单状态status返回不同订单
        getOrderStatusGoods(status) {
            var searchGoods = [];
            // 全部状态商品
            if (status == "all"){
                searchGoods = this.allOrder.filter( item => item.goods.length > 0 );
            }else{
                // 筛选出指定状态的订单
                this.allOrder.forEach(item => {
                    item.status == status && item.goods.length && searchGoods.push(item);
                });
            }
            return searchGoods;
        },
        // 返回订单状态对应的文本
        statusText(status) {
            var statusTextMap = new Map();
            statusTextMap.set("0", "立即付款");
            statusTextMap.set("1", "已付款");
            statusTextMap.set("2", "已完成");
            return statusTextMap.get(status.toString());
        },
        // 返回订单状态对应的按钮样式
        statusBtnStyle(status) {
            var statusTextMap = new Map();
            statusTextMap.set("0", "danger");
            statusTextMap.set("1", "primary");
            statusTextMap.set("2", "default");
            return statusTextMap.get(status.toString());
        },
        goPay(orderData) {
            if (orderData.status != "0") {
                return;
            }
            this.$toast('支付参见其他分支')
        }

    },
    created() {
        // 加载用户订单
        this.getOrder();
    }
};
</script>

<style lang="scss" scoped>
.van-tabs__content {
    margin-bottom: 10px;

    .van-card__thumb {
        /deep/ img {
            width: 100%;
            height: 110%;
        }
    }
}
</style>
