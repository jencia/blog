<template>
    <Profile />
</template>

<script>
import Profile from '@/components/Profile';

export default {
    name: 'FavoritesArticle',
    middleware: 'authenticated',
    components: { Profile }
}
</script>
