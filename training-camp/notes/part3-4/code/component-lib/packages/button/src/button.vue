<template>
  <button>{{ text }}</button>
</template>

<script>
export default {
  name: 'jc-button',
  props: {
    type: String
  },
  computed: {
    text () {
      const wrapper = v => this.type === 'reset' ? `【${v}】` : v

      return wrapper(this.$slots.default?.[0]?.text)
    }
  }
}
</script>
