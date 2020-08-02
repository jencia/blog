import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Layout from '../components/Layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home
      },
      {
        path: '/detail/:id',
        name: 'Detail',
        props: true,
        component: () => import(/* webpackChunkName: "detail" */ '../views/Detail.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "about" */ '../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
