<template> 
    <ul>
        <li v-for="(item, i) in posts" :key="i">{{ item.content }}</li>
    </ul>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
    name: 'Posts',
    metaInfo: {
        title: '列表'
    },
    computed: {
        ...mapState(['posts'])
    },
    methods: {
        ...mapActions(['getPosts'])
    },
    
    serverPrefetch () {
        return this.getPosts()
    },
    mounted () {
        if (this.posts.length === 0) {
            this.getPosts()
        }
    }
}
</script>
