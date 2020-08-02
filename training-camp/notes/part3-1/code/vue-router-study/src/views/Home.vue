<template>
  <div class="home">
    首页
    <ul>
      <li v-for="i in 5" :key="i">
        <router-link :to="'/detail/' + i">item {{ i }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
