<template>
  <div id="layout">
    <header>
      <img src="@/assets/logo.png" alt="">
    </header>
    <router-view />
    <footer>
      底部
    </footer>
  </div>
</template>
<script>
export default {
  name: 'Layout'
}
</script>
