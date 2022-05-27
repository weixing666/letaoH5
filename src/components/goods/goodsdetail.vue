<template>
  <div class="goodsdetail-container">
    <!-- 轮播图 -->
    <div class="card">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#ccc">
        <van-swipe-item v-for="item in lunboData" :key="item.src">
          <img :src="item.src" alt />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 商品名称和价格 -->
    <div class="card">
        <div class="price">
            <span class="sellPrice">¥{{goodsInfo.sell_price}}</span>
            <span class="shopPrice"><s>¥{{goodsInfo.market_price}}</s></span>
        </div>
      <div class="goodsName multi-ellipsis--l2">{{ goodsInfo.title }}</div>
    </div>

    <!-- 商品的介绍 -->
    <div class="card">
      <van-divider  content-position="left">介绍</van-divider>
      <div class="content" v-html="goodsInfo.content"></div>
    </div>

    <!-- 商品购买 -->
    <van-goods-action>
      <van-goods-action-icon
        icon="cart-o"
        :badge="$store.getters.carTotal"
        @click="goShopCar"
        text="购物车"
      />
      <van-goods-action-button
        type="warning"
        @click="goSku(true)"
        text="加入购物车"
      />
      <van-goods-action-button
        type="warning"
        text="立即结算"
        @click="goSku(false)"
      />
    </van-goods-action>

    <!-- sku -->
    <van-sku
      v-model="show"
      :sku="sku"
      :goods="goods"
      :goods-id="goodsId"
      :show-add-cart-btn="showAddCartBtn"
      :hide-stock="sku.hide_stock"
      :reset-stepper-on-hide="true"
      @buy-clicked="onBuyClicked"
      @add-cart="onAddCartClicked"
    >
      <template #sku-messages>
        <div class="card">
          <van-divider :hairline="false">其他信息</van-divider>
          <div class="info">
            <span>商品货号：{{ goodsInfo.goods_no }}</span>
            <span>库存情况：{{ goodsInfo.stock_quantity }}件</span>
            <span>上架时间：{{ goodsInfo.add_time | dateFormat }}</span>
        </div>
        </div>
      </template>
    </van-sku>
  </div>
</template>

<script>
import { getPhotoThumbData, getGoodsInfoData } from "@/api/index.js";

export default {
  props: ["id"],
  data() {
    return {
      value: 1,
      lunboData: [],
      goodsInfo: {},
      goodsId: 78,
      showAddCartBtn: true,
      show: false,
      sku: {
        // 数据结构见下方文档
        tree: [],
        price: "879.00", // 默认价格（单位元）
        stock_num: 0, // 商品总库存
        hide_stock: false, // 是否隐藏剩余库存
      },
      goods: {
        // 数据结构见下方文档
        picture: ""
      }
    };
  },
  methods: {
    goSku(isShowAddCartBtn){
        this.show = true;
        this.showAddCartBtn = isShowAddCartBtn;

    },
    async getGoodsThumb() {
      var { message } = await getPhotoThumbData(this.id);
      this.lunboData = message;
      this.goods.picture = message[0].src
    },
    async getGoodsInfo() {
      var { message } = await getGoodsInfoData(this.id);
      this.goodsInfo = message;

      this.sku.price = this.goodsInfo.sell_price
      this.sku.stock_num = this.goodsInfo.stock_quantity;
      this.goodsInfo.content = this.goodsInfo.content.replace(
        /width=\"750(px)?\"/g,
        ""
      );
    },
    goShopCar() {
      this.$router.push("/shopcar");
    },
    // 加入商品{id,number,price,select:true}购物车
    onAddCartClicked(obj) {
        // console.log(obj)
      let goods = {
        id: this.goodsInfo.id,
        number: obj.selectedNum,
        price: this.goodsInfo.sell_price,
        selected: true,
      };
      this.$store.commit("addCar", goods);
      this.$toast("加入购物车成功");
      this.show = false;
    },
    onBuyClicked(obj) {
      let goods = {
        id: this.goodsInfo.id,
        number: obj.selectedNum,
        price: this.goodsInfo.sell_price,
        selected: true,
      };
      this.$store.commit("addCar", goods);
      this.$router.push("/shopcar");
    }
  },
  created() {
    this.getGoodsThumb();
    this.getGoodsInfo();
  }

};
</script>

<style lang="scss" scoped>
$white: #fff;
.goodsdetail-container {
  background-color: #eee9e9;
  font-size: 14px;
  color: #666;
  .card {
    padding: 8px;
    border-radius: 6px;
    background: $white;
    margin: 8px;
    .van-swipe {
      height: 240px;
      background-color: $white;

      .van-swipe-item {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 245px;
          height: 100%;
        }
      }
    }

    .goodsName {
      color: #333;
      font-weight: 500;
      font-size: 16px;
    }

    .price {
        .sellPrice {
            color: #fa865d;;
            font-size: 20px;
            margin-right: 20px;
        }
        .shopPrice {
            color: #666;
        }
    }


    .info {
      display: flex;
      flex-direction: column;
      margin: 10px 0px;
    }

    .content {
      /deep/ img {
        width: 100%;
        font-size: #ccc;
      }
    }
  }
}
</style>
