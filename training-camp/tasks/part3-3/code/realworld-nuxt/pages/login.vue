<template>
    <Auth />
</template>

<script>
import Auth from '@/components/Auth'

export default {
    name: 'Login',
    middleware: 'notAuthenticated',
    components: { Auth }
}
</script>
