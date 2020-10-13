<template> 
    <ul>
        <li v-for="(item, i) in posts" :key="i">{{ item.content }}</li>
    </ul>
</template>
<script>
import axios from 'axios'
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
        // console.log(this.getPosts)
        return this.getPosts()
    }
}
</script>
