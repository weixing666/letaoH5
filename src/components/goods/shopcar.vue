<template>
  <div class="shopcar-container">
    <!-- 收货地址 -->
    <div v-if="hasGoods">
      <van-address-list  @select="addressClick" :list="defaultAddress" />

      <div class="car">
        <div class="item" v-for="(item,index) in carData" :key="item.id">
          <div>
            <van-switch
              @change="switchChange(item.id,$store.getters.getGoodsSelected[item.id])"
              v-model="$store.getters.getGoodsSelected[item.id]"
            />
          </div>

          <div class="thumbImage">
            <img :src="item.thumb_path">
          </div>

          <div class="info">
            <div class="title">{{ item.title }}</div>
            <div class="footer">
              <div class="price">&yen;{{ item.sell_price }}</div>
              <van-stepper
                class="number"
                @change="changeNumber(item.id,$store.getters.getGoodsNumber[item.id])"
                v-model="$store.getters.getGoodsNumber[item.id]"
              />
              <van-button type="danger" @click="del(item.id,index)">删除</van-button>
            </div>
          </div>
        </div>

      </div>

      <!-- 提交订单操作 -->
      <van-submit-bar
        :price="total_price"
        button-text="订单支付"
        @submit="onSubmit"
      >
        <template #default>共 {{$store.getters.getGoodsSelectedNumber}} 件商品</template>
        <template #tip>默认只支持微信支付</template>
      </van-submit-bar>
    </div>

    <div class="empty" v-else>

        <div style="margin-top:20px">
            <img width="110px" style="margin:10px 0" src="../../assets/images/car2.png" alt="">
        </div>
        <span v-if="!hasGoods && hasToken" class="emptyInfo" >购物车竟然是空的</span>
        <span style="white-space: nowrap; line-height: 16px; overflow: hidden; text-overflow: ellipsis;">再忙，也要记得买点什么犒赏自己~</span>

        <van-button v-if="hasToken && !hasGoods" @click="$router.push('/home')">去逛逛</van-button>

        <div v-if="!hasToken" class="loginText">
            <van-button  @click="$router.push('/home')">立即登录</van-button>
        </div>
    </div>
  </div>
</template>

<script>
import { getCarData,commitOrder,userAddressData,getOrder} from '@/api/index.js'
import { userInfo,genOrderId } from '@/util/tool.js'
export default {
  data () {
    return {
      carData: [],
      defaultAddress: [],
      order_id:'',
    }
  },
  computed: {
    hasToken: function(){
        return localStorage.getItem('token') ? true : false;
    },
    hasGoods: function () {
      return this.carData.length > 0
    },
    number: function(){
        return this.$store.getters.getGoodsSelectedNumber
    },
    total_price: function(){
        return this.$store.getters.getGoodsSelectedPrice * 100;
    },
    goods_ids: function(){
        return this.$store.getters.getSelectedGoodsIds
    }
  },
  methods: {
    // 获取用户默认收货地址
    async getDefaultAddress(){
        var { id } = userInfo();
        if(!id){
            return;
        }
        let result = await userAddressData(id)
        if(result.length == 0){
            this.$Dialog.alert({
                title: '提示',
                message: '请先完善收货地址',
                confirmButtonText: "好的"
            }).then(() => {
                let redirect = this.$route.fullPath;
                this.$router.push('/addressmanage?redirect=' + redirect);
            });
            return;
        }
        // 仅一个收货地址,将其设置为默认地址
        if(result.length == 1){
            result[0].isDefault = true;
            this.defaultAddress = result;
            return;
        }
        // 若有多个地址，则筛选获取默认的一个选中地址
        this.defaultAddress = result.map(v=>{
            v.isDefault && (v.isDefault = true)
            return v;
        }).filter(v => v.isDefault)
    },
    addressClick(a,b){
        this.$router.push({name:"addressmanage"})
    },
    // 提交订单
    async onSubmit () {
        var user = userInfo();
        // 检测是否登录
        if(user === false){
            this.$router.push('/login')
            return;
        }
        var order_id = genOrderId(); // 用户生产订单号
        this.order_id = order_id;
        //1.准备订单数据，并校验数据合法
        var orderData = {
            user_id: user.id,
            order_id: order_id,
            address_id: this.defaultAddress[0].id,
            total_price: this.$store.getters.getGoodsSelectedPrice,
            number: this.number,
            goods_ids: this.goods_ids
        };
        //2.调用后台接口,提交订单
        var _this  = this;
        this.$toast.loading({
             message: '生成订单中',
             forbidClick: true,
             duration: 3000
        })

        var orderResult = await commitOrder(orderData);
        if(orderResult.status == 0){
            this.$toast(orderResult.message)
            // 清空购物车
            localStorage.removeItem('carData');
            this.$router.replace('/order')
        }else {
            this.$toast('订单生成失败');
        }
    },
    async getCarGoods () {
      var ids = this.$store.getters.getGoodsIds // '88,91'
      if (!ids) { return }
      var { message } = await getCarData(ids)
      this.carData = message
    },
    // 删除购物车商品
    del (goods_id, index) {
      // 调用vuex中mutations中的方法来删除
      this.$store.commit('delCarGoods', goods_id)
      // 同时也要在当前的私有数据this.carData也要删除
      this.carData.splice(index, 1)
    },
    // 修改商品的选中状态
    switchChange (goods_id, selected) {
      // 调用vuex中的方法修改数据
      this.$store.commit('changeGoodsSelected', { goods_id, selected })
    },
    // 修改商品的购买数量
    changeNumber (goods_id, number) {
      // 调用vuex中的方法修改数据
      this.$store.commit('changeGoodsNumber', { goods_id, number })
    }
  },
  async created () {
    // 获取购物车商品
    await this.getCarGoods();
    if(this.carData.length === 0){
        return;
    }
    // 优先获取缓存地址，没有则获取用户默认地址
    let selectAddress = localStorage.getItem('selectAddress');
    if(selectAddress){
        this.defaultAddress = [JSON.parse(selectAddress)];
    }else{
        this.getDefaultAddress()
    }
  }

}
</script>

<style lang="scss" scoped >
.shopcar-container {
  background-color: #f2f2f2;
  height: 100vh;

  .van-divider {
    text-align: center;
    color: #6f7370;
    font-size: 16px;
    border-color: #545e6c;
    margin: 2px;
  }

  .van-address-list {
    padding-bottom: 10px;
    .van-icon-edit {
        display:none;
    }
  }
  .van-address-list__bottom {
    visibility: hidden;
  }

  .car {
    margin: 10px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      margin: 10px 0px;
      border-radius: 8px;

      padding: 10px;
    }
    .thumbImage {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      margin: 0 4px;
      img {
        width: 100%;
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price {
          color: #ff0000;
        }

        .number {
          // margin: 0 15px;
        }
      }
    }
    .van-cell {
      border-radius: 8px;
    }
  }

  .empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .emptyInfo {
          font-size: 18px;
          color: #666;
          -webkit-font-smoothing: antialiased;
          margin: 10px 0;
      }

      span {
          font-size: 13px;
          color: #999;
      }
      button {
          height: 40px;
          color: #5f646e;
          background-color: #f2f2f2;
          border: 1px solid #ccc;
          margin: 30px 0;
      }

      .loginText {
          font-size: 14px;
          color: #999;
          a {
              color: inherit;
          }
      }
  }

  .van-submit-bar {
      bottom: 50px;
  }
}
</style>
