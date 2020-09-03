<template>
    <div>
        <nav class="navbar navbar-light">
            <div class="container">
                <nuxt-link class="navbar-brand" to="/">conduit</nuxt-link>
                <ul class="nav navbar-nav pull-xs-right">
                    <template class="nav-item" v-for="item in menus">
                        <li :key="item.path" class="nav-item">
                            <!-- Add "active" class when you're on that page" -->
                            <nuxt-link
                                class="nav-link"
                                :class="$route.path === item.path ? 'active' : ''"
                                :to="item.path"
                            >
                                <i :class="item.icon" v-if="item.icon"></i>
                                {{ item.name }}
                            </nuxt-link>
                        </li>
                    </template>
                </ul>
            </div>
        </nav>
        <nuxt />
        <footer>
            <div class="container">
                <a href="/" class="logo-font">conduit</a>
                <span class="attribution">
                    An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
                </span>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'DefaultLayout',
    data () {
        return {
            menus: [
                {
                    name: '首页',
                    path: '/'
                },
                {
                    name: '写文章',
                    path: '/editor',
                    icon: 'ion-compose'
                },
                {
                    name: '设置',
                    path: '/settings',
                    icon: 'ion-gear-a'
                },
                {
                    name: '登录',
                    path: '/login'
                },
                {
                    name: '注册',
                    path: '/register'
                }
            ]
        }
    }
}
</script>
