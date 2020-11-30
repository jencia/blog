<template>
    <div>
        <el-card shadow="never">
            <el-menu :default-active="active" @select="onSelect">
                <el-menu-item v-for="item in menu" :key="item.path" :index="item.path">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.title}}</span>
                </el-menu-item>
            </el-menu>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            active: this.$route.path === '/' ? '/news' : this.$route.path,
            menu: [
                { title: '最新动态', path: '/news', icon: 'el-icon-star-off' },
                { title: '代码分享', path: '/gists', icon: 'el-icon-edit-outline' },
                { title: '开源项目', path: '/projects', icon: 'el-icon-service' },
                { title: '社交圈', path: '/social', icon: 'el-icon-mobile-phone' },
            ]
        }
    },
    methods: {
        onSelect(index) {
            this.active !== index && this.$router.push(index)
        },
    }
}
</script>