<template>
    <div class="app">
        <h1 class="red">{{ message }}</h1>
        <input v-model="text">
        <Page1></Page1>
    </div>
</template>

<script>
import Page1 from './Page1'
import './App.scss'

console.log(Page1.docs)
export default {
  name: 'App',
  components: { Page1 },
  data () {
    return {
      text: '',
      message: 'Hello Vue.js!'
    }
  }
}
</script>

<style lang="scss" scoped>
.red {
    color: red
}
.page1 {
    width: 500px;
    &::v-deep .container {
        background: orange;
    }
}

</style>
