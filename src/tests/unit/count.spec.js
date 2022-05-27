import { shallowMount } from '@vue/test-utils'

import count from '@/demo/count.vue'

// 这里是一些 Jest 的测试，你也可以使用你喜欢的任何断言库

describe("测试count.vue",function(){

    it("click 1 equal 1",async ()=>{
        var wrapper = shallowMount(count);
        await wrapper.setData({ count: 100})
        await wrapper.find('.button').trigger('click')
        // await wrapper.find('.button').trigger('click')
        console.log( wrapper.vm.count )
        expect( wrapper.find('#result').text() ).toBe('101')
    })


    it("isShow = false not found me", async ()=>{
        var wrapper = shallowMount(count);
        await wrapper.setData({ isShow: false });
        expect( wrapper.find('.me').exists() ).toBe(false)
    })


})
