# Vue Router

## 安装

```sh
$ yarn add vue-router
```

## 基本使用

```js
// 0. 导入 Vue 、VueRouter 、路由组件
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '../App'
import Foo from '../views/Foo'
import Bar from '../views/Bar'

// 1. 注册路由插件
Vue.use(VueRouter)

// 2. 配置路由规则
const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
]

// 3. 创建 router 对象
const router = new VueRouter({
    routes
})

new Vue({
    // 4. 注册 router 对象
    router,
    render: h => h(App)
}).$mount('#app')
```

```html
<!-- App.vue -->
<template>
    <div id="app">
        <div id="nav">
            <!-- 6. 创建链接 -->
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
        </div>
        <!-- 5. 创建路由组建的占位 -->
        <router-view />
    </div>
</template>
```

通过注入路由器，我们可以在任何组件内通过 this.$router 访问路由器，也可以通过 this.$route 访问当前路由：

```js
export default {
    computed: {
        username() {
            return this.$route.params.username
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        }
    }
}
```

## 动态路由

在配置路由规则的时候采用动态路径的方式

```js
const routes = [
    // ...
    {
        path: '/detail/:id',
        component: Detail
    }
]
```

`/detail/:id` 表示 `/detail/` 后面加载任意内容，`:id` 前面加一个冒号表示这是动态路径，冒号后面跟上的单词将作为参数名称，匹配到的内容将作为这个参数名称的值。例如实际路径是 `/detail/30` ，这时候就能得到一个参数 id 为 30 。组件那边可以通过 `$route` 访问到这个参数：

```js
this.$route.params.id // 30
```

获取参数的方式还有另外一种方式，需要在路由规则那边设置 `props` 选项：

```diff
const routes = [
    // ...
    {
        path: '/detail/:id',
+       props: true,
        component: Detail
    }
]
```

这样参数就会以属性的方式传给路由组件：

```js
export default {
    props: ['id'],
    data () {
        console.log(this.id)    // 30
        return {}
    }
}
```

## 嵌套路由

所谓嵌套路由就是路由里面还有路由。在上一节例子里，最外层的组件是 App.vue ，做了下小调整：

```html
<div id="app">
    <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/login">Login</router-link>
    </div>
    <router-view />
</div>
```

上面使用了 `<router-view/>` 用于展示匹配到的路由组件，对应的路由配置是以下这样：


```js
const routes = [
    {
        path: '/',
        component: Layout
    },
    {
        path: '/login',
        component: Login
    }
]
```

这边的路由组件 `Layout` 里面除了可以有自己的界面内容，也可以使用 `<router-view/>` ：

```html
<div id="layout">
    <header>
      <img src="@/assets/logo.png" alt="">
    </header>
    <router-view />
    <footer>
      底部
    </footer>
  </div>
```

这种路由路径里面又使用了 `<router-view>` 的就是嵌套路由。那这块的 `<router-view>` 读取的配置还需要再配：

```diff
const routes = [
  {
    path: '/',
    component: Layout,
+   children: [
+     {
+       path: '/',
+       component: Home
+     },
+     {
+       path: '/detail',
+       component: Detail
+     }
+   ]
+ },
  {
    path: '/login',
    component: Login
  }
]
```

由于这里的 `<router-view>` 是属于 `Layout` 组件的，所以是属于 `Layout` 的子路由，应该在其配置上添加 children ，这里面就是用来配置子路由配置。子路由的 path 是会跟父路由的 path 合并的。如果父路由的 path 是 `/a` ，子路由是 `/b` ，子路由最终的路径是 `/a/b`。针对 `/` 有特殊处理，这边的 `//detail` 会合并成 `/detail` 。

## 编程时导航

```js
this.$router.push('/detail')
this.$router.push({ name: Detail , params: { id: 1 }})

this.$router.replace('/detail')
this.$router.go(-1)
this.$router.back()
```

## 路由模式

vue-router 里面分为两种路由模式：

- Hash 模式：
  
  `https://music.163.com/#/playlist?id=3102961863`

- History 模式：
   
  `https://music.163.com/playlist/3102961863`

两种的区别：

- Hash 模式是基于锚点，以及 `onhashchange` 事件
- History 模式是基于 HTML5 中的 History API ( IE10 以后才支持 )
    - history.pushState()
    - history.replaceState()

默认采用 Hash 模式，如果要开启 History 模式需要两个步骤：

第一、修改 router 对象配置：

```diff
const router = new VueRouter({
+   mode: 'history',
    routes
})
```

第二、在后端服务器上把所有路由指向重定向到首页：

- node express 服务器：

    ```sh
    $ yarn add connect-history-api-fallback
    ```

    ```js
    const history = require('connect-history-api-fallback')
    const express = require('express')

    const app = express()

    app.use(history())
    ```

- nginx 服务器

    ```diff
    server {
        ...
        location / {
            root   html;
            index  index.html index.htm;
    +       try_files $uri $uri/ /index.html;
        }
    }
    ```

    try_files 的作用是参数去找 `$uri` (当前 URL )，如果找不到就去找 `$uri/`（查找当前 URL 对应的目录里面有没有 index.html 或 index.htm 文件），如果找不到就去访问 `/index.html` ，即网址根目录下的 `index.html` 文件。
