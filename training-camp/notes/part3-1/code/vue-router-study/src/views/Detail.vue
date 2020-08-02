<template>
  <div>
    <p>item {{ id }}</p>
    <button @click="$router.back()">返回</button>
  </div>
</template>
<script>
export default {
  name: 'Detail',
  props: ['id']
}
</script>
