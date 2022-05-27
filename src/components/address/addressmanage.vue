<template>
    <div class="address-container">
        <van-address-list
            default-tag-text="默认"
            v-model="chosenAddressId"
            @select="selectAddress"
            :list="list"
            @add="onAdd"
            @edit="onEdit"
        />
        <van-empty v-if="list.length == 0" description="描述文字">
            <van-button round type="danger" class="bottom-button">添加收货地址</van-button>
        </van-empty>
    </div>
</template>

<script>
import { AddressList } from "vant";
import { userAddressData } from "@/api/index.js";
export default {
    data() {
        return {
            chosenAddressId: "1",
            list: []
        };
    },
    methods: {
        async loadAddress() {
            var userInfo = JSON.parse(localStorage.getItem("userInfo"));
            var userAddress = await userAddressData(userInfo.id);
            var _this = this;
            let defaultIndex; // 默认地址索引
            userAddress.map((v, index) => {
                v.address = v.addressDetail;
                if (v.isDefault == 1) {
                    defaultIndex = index;
                    v.isDefault = true;
                    _this.chosenAddressId = v.id;
                } else {
                    delete v.isDefault;
                }
            });
            // 获取默认地址放到第一个
            let defaultAddress = userAddress[defaultIndex];
            userAddress.splice(defaultIndex,1);
            userAddress.unshift(defaultAddress);
            this.list = userAddress;
        },
        onAdd() {
            // 添加地址
            this.$router.push("/addressadd");
        },
        onEdit(item, index) {
            var addressstr = JSON.stringify(item);
            this.$router.push(`/addressedit/${addressstr}`);
        },
        selectAddress(item) {
            let fromRoute = JSON.parse(
                localStorage.getItem("fromRoute") || "{}"
            );
            if (fromRoute.name === "shopcar" || fromRoute.path === "/shopcar") {
                localStorage.setItem("selectAddress", JSON.stringify(item));
                this.$router.go(-1);
            }
        }
    },
    created() {
        this.loadAddress();
    },
    components: {
        "van-address-list": AddressList
    }
};
</script>

<style lang="scss" scoped>
</style>
