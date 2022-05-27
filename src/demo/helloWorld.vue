<template>
  <div class="hello">
  	 <h1>这是helloworld组件</h1>
    <h1>{{ msg }}</h1>
   </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data(){
    return {
      msg: ''
    }
  }
}
</script>
