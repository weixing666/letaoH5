<template>
    <div class="search-container">
            <van-search
                v-model="value"
                show-action
                shape="round"
                placeholder="请输入搜索关键词"
                @search="onSearch"
                @cancel="onCancel"
            />
            <div class="list">
                <div class="item">
                    <div class="header">
                        <span>搜索历史</span>
                        <i class="iconfont icon-trash"></i>
                    </div>
                    <div class="content">
                        <span @click="goSearch(value)" v-for="value in historyData" :key="value">{{ value }}</span>

                    </div>
                </div>
                <van-divider />
                <div class="item">
                    <div class="header">
                        <span>热门搜索</span>
                        <i @click="isEyeOpen = !isEyeOpen" :class="'iconfont ' + eyeStatus "></i>
                    </div>
                    <div class="content">
                        <template v-if="isEyeOpen">
                            <span @click="goSearch(item)" v-for="item in hotSearchData" :key="item">{{ item }}</span>
                        </template>
                        <div class="emptyTip" v-if="!isEyeOpen">已隐藏热门搜索</div>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: "",
            isEyeOpen: true, // icon-guanbi-yanjing
            historyData:['嘉实多','壳牌','美孚','iphone13'],
            hotSearchData:['iphone6','iphone12','笔记本电脑','游戏本','乐淘大优惠']
        };
    },
    computed:{
        eyeStatus(){
            return this.isEyeOpen ? 'icon-yanjing' : 'icon-guanbi-yanjing'
        }
    },
    methods: {
        onSearch(val) {
            this.$router.push(`/searchresult/${this.value}`)
        },
        onCancel() {
            this.$router.back();
        },
        goSearch(value){
            this.$router.push(`/searchresult/${value}`)
        }

    }
};
</script>

<style lang="scss" scoped>
    .search-container {
        // min-height: 50vh;
        padding-bottom: 50px;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        background-color: #fff;
        .list {
            padding: 4px;

            .item {
                margin-top: 4px;
                .header {
                    padding: 0 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    span:first-child{
                        font-weight: bold;
                        color: #3b3333;
                    }

                }
                .content {
                    position: relative;
                    display: flex;
                    flex-wrap: wrap;

                    span {
                        padding: 4px 10px;
                        background-color: #f3f5f6;
                        margin-right: 10px;
                        margin-top: 10px;
                        border-radius: 8px;
                        color: #5e5757;
                        font-size: 14px;
                    }

                    .emptyTip {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate3d(-50%,50%,0);
                    }
                }
            }
        }

    }
</style>
