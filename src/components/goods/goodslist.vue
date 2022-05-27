<template>
  <div class="goodslist_container">
    <div class="goodslist">
      <router-link  tag="div" :to="'/goodsdetail/'+item.id" class="item" v-for="item in goodslist" :key="item.id">
        <img v-lazy="item.img_url" alt>
        <div class="text">
          <div class="title ellipsis">{{ item.title }}</div>
          <div class="price">
            <span class="shopPrice">¥ {{ item.sell_price }}</span>
            <span class="marketPrice">¥ {{ item.market_price }}</span>
          </div>
          <div class="hot">
            <span>热卖中</span>
            <span>剩余{{item.stock_quantity}}件</span>
          </div>
        </div>
      </router-link>
    </div>
    <!-- 引入回到顶部组件 -->
    <back-top :scroll="300"></back-top>
    <loading :show="isLoading"></loading>
  </div>
</template>

<script>
import { getGoodsListData } from '@/api/index.js'
import backTop from "@/components/backTop";
import loading from "@/components/loading";
export default {
  data () {
    return {
      goodslist: [],
      page: 1,
      isLoading: false
    }
  },
  methods: {
    async getGoodsList () {
      this.isLoading = true;
      var { message } = await getGoodsListData(this.page)
      this.isLoading = false;
      this.goodslist = message
    }
  },
  created () {
    //   this.$parent.showNavBar()
    this.getGoodsList()
  },
  components:{
      backTop,loading
  }
}
</script>

<style lang="scss" scoped>
.goodslist_container {
  background-color: #e9e9e9;
  padding: 4px;
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
