<template>
  <div class="home">
    <p>$store.state.msg: {{ $store.state.msg }}</p>
    <p>$store.getters.reverseMsg: {{ $store.getters.reverseMsg }}</p>
    <p>$store.state.count: {{ $store.state.count }}</p>
    <button @click="$store.commit('inc', 1)">commit</button>
    <button @click="$store.dispatch('asyncAdd')">dispatch</button>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
