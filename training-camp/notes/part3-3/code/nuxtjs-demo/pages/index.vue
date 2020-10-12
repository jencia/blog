<template>
  <div>
    <h1>Hello Nuxt.js!</h1>
    <ul>
      <li v-for="item in data" :key="item">
        {{ item.content }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Home',
    async asyncData() {
      const { data } = await axios({
        method: 'GET',
        url: 'http://localhost:3000/app/data.json'
      })
      
      return { data }
    }
}
</script>