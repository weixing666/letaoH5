<template>
    <div class="register-container">
        <van-form @submit="onSubmit">
            <van-field
                v-model="username"
                name="用户名"
                label="用户名"
                placeholder="用户名"
                :rules="[{ required: true, message: '必填' }]"
            />
            <van-field
                v-model="password"
                type="password"
                name="密码"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '必填' }]"
            />
            <van-field
                v-model="repassword"
                type="password"
                name="密码"
                label="确认密码"
                placeholder="确认密码"
                :rules="[{ required: true, message: '必填' }]"
            />
            <van-field
                v-model="tel"
                type="tel"
                label="手机号"
                placeholder="手机号"
                :rules="[{ required: true, message: '必填' }]"
            />
            <van-field
                v-model="sms"
                center
                clearable
                label="短信验证码"
                placeholder="短信验证码"
                :rules="[{ required: true, message: '必填' }]"
            >
                <template #button>
                    <van-button @click.prevent="sendSms" size="small" type="info"
                        >发送验证码</van-button
                    >
                </template>
            </van-field>
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit"
                    >立即注册</van-button
                >
            </div>
        </van-form>

        <div class="text">
            <router-link to="/login">已有账号,去登录</router-link>
        </div>
    </div>
</template>

<script>
import { userRegister,genTelCode } from "@/api/index.js";
export default {
    data() {
        return {
            username: "",
            password: "",
            repassword: "",
            tel: "",
            sms: ''
        };
    },
    methods: {
        async onSubmit(values) {
            if (this.password != this.repassword) {
                this.$toast("两次密码不一致");
                return;
            }
            //  this.$Notify({ type: 'primary', message: '功能暂未开放' });
            let data = { username: this.username, password: this.password };
            let { status, message } = await userRegister(data);
            this.$toast(message);
            if (status == 0) {
                this.$router.push("/login");
            }
        },
        async sendSms(e){
            let telReg = /^1\d{10}$/;
            if( !telReg.test(this.tel) ){
                this.$toast('请填写合法手机号');
                return;
            }
            let { info,result,errmsg } = await genTelCode(this.tel);
            if(errmsg){
                this.$toast(errmsg);
                return;
            }
            if(result.statusCode === '000000'){
                this.$toast('发送成功，请注意查收')
            }else{
                this.$toast(result.statusMsg);
            }
        }
    }

};
</script>

<style lang="scss" scoped>
.register-container {
    padding-top: 20px;

    .text {
        text-align: center;

        a {
            color: rgb(185, 181, 181);
        }
    }
}
</style>
