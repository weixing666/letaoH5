<template>
    <div>
        <div id="result">{{ count }}</div>
        <div class="me" v-if="isShow">你看不见我</div>
        <button class="button" @click="count++">增加</button>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                count: 0,
                isShow: true

            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
