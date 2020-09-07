<template>
    <Auth />
</template>

<script>
import Auth from '@/components/Auth'

export default {
    name: 'Register',
    middleware: 'notAuthenticated',
    components: { Auth }
}
</script>
