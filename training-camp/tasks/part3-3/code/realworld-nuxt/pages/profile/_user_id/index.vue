<template>
    <Profile />
</template>

<script>
import Profile from '@/components/Profile';

export default {
    name: 'MyArticle',
    middleware: 'authenticated',
    components: { Profile }
}
</script>
