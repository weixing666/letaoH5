<template>
    <div class="user-container">
        <van-cell class="header">
            <img src="../../assets/images/logo.png" alt />
            <div class="upload" v-if="showUpload">
                更换头像
                <input type="file" @change="changeAvatar"  accept="image/*" />
            </div>
            <div style="margin:0 10px;font-size:18px;">用户名: {{ username  }}</div>
        </van-cell>
        <van-cell title="修改密码" is-link />
        <van-cell title="我的订单" is-link to="/order" />
        <van-cell title="地址管理" to="/addressmanage" is-link />

        <van-cell class="feedback" title="提交反馈" is-link />
        <van-cell title="关于乐淘" value="v1.0.2" />

        <!-- 退出按钮 -->
        <van-button block @click="logout">退出登录</van-button>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            username: "",
            showUpload: false
        };
    },
    methods: {
        async changeAvatar(e){
            let file = e.target.files[0];
            if(file){
                let formData = new FormData();
                formData.append('file',file)
                // 调用接口，上传文件
                let {data:{code,src,message}} = await axios.post('http://127.0.0.1:3000/upload',formData)
                this.$toast(message)
            }
        },
        logout() {
            this.$Dialog
                .confirm({
                    message: "确认退出登录?"
                })
                .then(() => {
                    localStorage.clear();
                    this.$store.commit("clearToken");
                    this.$router.replace("/login");
                })
                .catch(() => {});
        }
    },
    created() {
        let { username } = JSON.parse( localStorage.getItem("userInfo") || '{}');
        this.username = username;
    }
};
</script>

<style lang="scss" scoped>
.user-container {
    .header {
        .van-cell__value {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;

            img {
                width: 20%;
                // margin-right: 100px;
            }

            .upload {
                // background-color: pink;
                position: relative;
                width: 60px;
                height: 16px;
                line-height: 16px;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 2px 4px;
                margin-left: 10px;
                margin-right: 30px;
                align-self: flex-end;

                input {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    opacity: 0;
                }
            }
        }
        &::after {
            border-width: 0px;
        }
    }

    .feedback {
        margin-top: 10px;
    }

    .logout {
        margin: 20px 0;
        position: fixed;
        bottom: 0px;
        left: 0px;
    }
}
</style>
