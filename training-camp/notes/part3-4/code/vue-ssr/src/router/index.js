import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export function createRouter () {
    const router = new VueRouter({
        mode: 'history',
        routes: [
            {
                path: '/',
                name: 'home',
                component: () => import('@/pages/Home')
            },
            {
                path: '/about',
                name: 'about',
                component: () => import('@/pages/About')
            },
            {
                path: '/posts',
                name: 'posts',
                component: () => import('@/pages/Posts')
            },
            {
                path: '*',
                name: 'notFound',
                component: () => import('@/pages/404')
            },
        ]
    })
    
    return router
}