import { shallowMount } from '@vue/test-utils'

import HelloWorld from '@/demo/helloWorld.vue'

// 这里是一些 Jest 的测试，你也可以使用你喜欢的任何断言库

describe('HelloWorld.vue', () => {
  // test(name, fn)  it是test的别名
  it('renders data', () => {
    	// 得到挂载渲染后的组件HelloWorld的对象
      const wrapper = shallowMount(HelloWorld, {
          data() {
            return {
              msg: '这是一首简单的歌'
            }
          }
        })
      // toMatch: 模糊匹配，包含内容即可
      // toBe: 完全匹配
      expect(wrapper.text()).toMatch('11111')
  })

})
