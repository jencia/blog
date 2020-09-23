<template>
    <Profile />
</template>

<script>
import Profile from '@/components/Profile';

export default {
    name: 'profile',
    middleware: 'authenticated',
    components: { Profile }
}
</script>
