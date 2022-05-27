<template>
    <div>
        <van-tree-select
            :items="items"
            :active-id.sync="activeId"
            :main-active-index.sync="activeIndex"
        />
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [{ text: '分组 1' }, { text: '分组 2' }],
            activeId: 1,
            activeIndex: 0
        };
    }
};
</script>

<style lang="scss" scoped></style>
