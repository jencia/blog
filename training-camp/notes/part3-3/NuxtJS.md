# NuxtJS 基础

一个基于 Vue.js 的服务端渲染应用框架，它可以帮我们轻松的实现同构应用。

[官方文档](https://zh.nuxtjs.org/guide/)

## 初始化项目

```sh
# 创建项目目录
$ mkdir nuxtjs-demo

# 进入项目目录
$ cd nuxtjs-demo

# 初始化项目
$ yarn init --yes

# 安装 nuxt
$ yarn add nuxt
```

修改 `package.json` 文件：

```diff
{
  "name": "nuxtjs-demo",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
+ "scripts": {
+   "dev": "nuxt"
+ },
  "dependencies": {
    "nuxt": "^2.14.6"
  }
}
```

创建首页文件 `page/index.vue` ：

```html
<template>
  <h1>Hello Nuxt.js!</h1>
</template>

<script>
export default {
    name: 'Home'
}
</script>
```

这时候的项目结构是这样的：

```
├─ node_modules/
├─ pages/
│    └─ index.vue
├─ package.json
└─ yarn.lock
```

项目的基本结构就完成了，现在可以运行程序了，执行命令行：

```sh
$ yarn run dev
```

执行完后会打印出页面访问路径 `http://localhost:3000` ，能成功访问就代表项目搭建成功了。

第一次运行会在项目根目录下会生成 `.nuxt` 目录，这目录是 NuxtJS 生成的同构应用代码，里面包含客户端和服务端代码。根据你项目源码实时生成最新的代码，里面的代码不允许修改。

## 路由

NuxtJS 应用默认采用自动化路由配置，会依据 `pages` 目录结构自动生成 `vue-router` 所需的路由配置，生成的最终代码可到 `.nuxt/router.js` 查看。


### 基本路由

```
├─ index.vue            /
├─ login.vue            /login
├─ about/
│   ├─ index.vue        /about
│   └─ me.vue           /about/me
```

### 动态路由

```
├─ article/
│   ├─ index.vue        /article
│   └─ _id.vue          /article/:id
├─ profile/
│   └─ _username
│       ├─ index.vue    /article/:username
│       ├─ test.vue     /article/:username/test
│       └─ _id.vue      /article/:username/:id
```

名字为下划线开头代表动态路由。

如果需要对动态路径中的参数做校验，可以在文件里面定义校验方法：

```js
export default {
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id)
  }
}
```

如果校验方法返回的值不为 `true` 或 Promise 中 `resolve` 解析为 `false` 或抛出 `Error` ， NuxtJS 将自动加载显示 404 错误页面或 500 错误页面。

### 嵌套路由

```
├─ users/
│   ├─ index.vue        /users
│   └─ foo.vue          /users/foo
├─ users.vue
```

文件夹与文件必须同名

- `users.vue` 文件作为父级路由，需要使用 `<nuxt-child />` 用来指定子路由的展示位置
- `users/` 文件夹里面的文件作为二级路由，访问路径还是一样，只能视图展示的位置不一样

### 404 路由

```
├─ _.vue                /*
```

文件名字就放一个下划线，表示任意路径都能匹配到，前提是没有其他路由被匹配到。

### 路由导航

```html
<router-link to="/about">关于</router-link>
<nuxt-link to="/about">关于</nuxt-link>
<n-link to="/about">关于</n-link>
```

以上三种写法等价，用法都跟 `router-link` 一样，只是标签名不一样，推荐用 `nuxt-link` 或 `n-link`

```js
this.$router.push('/article')
```

函数式导航就完全跟 `vue-router` 一样了，名称没有改变。

### 自定义路由

创建 NuxtJS 配置文件 `nuxt.config.js`，关于路由的配置可以查阅 [官方文档](https://zh.nuxtjs.org/api/configuration-router) ，这边就列举两个例子：

- 配置项目文根：

```js
module.exports = {
  router: {
    base: '/app'
  }
}
```

- 扩展路由配置

```js
module.exports = {
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  }
}
```

### 中间件

在页面渲染之前，可以先执行一个函数，这个函数就是中间件。

中间件固定放在 `middleware` 目录下，例如 `middleware/auth.js` ，一个文件就是一个中间件，文件名称就是中间件的名称。例如：

```js
export default function ({ store, redirect }) {
  // 判断是否存在 user 数据，不存在则重定向到登录页
  if (!store.state.user) {
    redirect('/login')
  }
}
```

文件导出的默认成员才是中间件的函数，函数第一个参数是上下文对象，可以拿到路由对象和 Vuex 数据。中间件可以是异步的，只需要返回一个 Promise 。

如果中间件想应用到每一个页面，就在 `nuxt.config.js` 里配置下：

```js
module.exports = {
  router: {
    middleware: 'auth'
  }
}
```

你也可以单独添加到布局组件或者页面：

```js
export default {
  middleware: 'auth'
}
```

## 视图

NuxtJS 的页面渲染的结构是 “模板 + 布局组件 + 页面组件”，上一章节讲的是路由，路由设置的都是页面组件，本章节就讲下模板和布局组件

### 模板

这个页面最外层结构，主要是 `html`、`head`、`body` 标签内容。默认的内容是这样的：

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

其中有一些变量，那些都是配置生成的内容，那些最好不要动他，能做的就是加一些内容。如果想修改模板的话，就在项目根目录下创建 `app.html` 文件，将默认代码复制粘贴进来改一改。例如 `head` 里 CDN 引入 JQuery 库：

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
    <script async src="https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js"></script>
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

### 布局

布局就是给路由嵌套了一层，也就是路由的父级组件，可用于开发公共布局部分。

默认布局组件没什么内容，如果你想修改布局组件。所有布局组件都必须放在 `layouts` 文件夹下，且文件名将作为布局组件的名称，例如 `default.vue` ，名称就是 `default`。引用的话需要在页面组件上配置：

```js
export default {
  layout: 'default'
}
```

`layout` 的默认值就是 `default` ，不需要配置也行，也就是说所有页面默认会使用 `layouts/default.vue` ，如果想开发另外一个布局组件才需要配置。

布局组件在写法上跟一般的组件没什么区分，唯一的区别是布局组件需要使用 `<nuxt />` 作为路由的入口，例如：

```html
<div>
  <p>外框</p>
  <hr />
  <nuxt />
</div>
```

## 异步数据

NuxtJS 给页面组件增加一个 `asyncData` ，`asyncData` 会在服务端渲染的时候被调用，方法的返回值将作为数据对象与 `data` 合并。`asyncData` 方法可以是异步的，异步状态下会等数据请求完才进行客户端渲染。例如：

```html
<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>
<script>
export default {
  async asyncData() {
    const { data } = await axios.get('https://my-api/posts')

    return { title: data.title }
  }
}
</script>
```

`asyncData` 的加载时机是：

- 第一次访问页面的时候在服务端调用，调用完才去渲染页面
- 之后由客户端接管，是在路由跳转之前调用，调用完才进行路由跳转

**注意：只有页面组件有 asyncData ，其他组件都不能使用**

在 `asyncData` 请求数据会堵塞页面的渲染，所以不要什么页面都在 `asyncData` 请求数据。只有需要做 SEO 优化的时候才适合在 `asyncData` 请求数据，否则请在 `mounted` 请求数据。

在 `asyncData` 里获取不到 `this` 对象，不过 `asyncData` 方法的第一个参数提供了上下文对象，可以通过上下文对象拿到路由数据、服务器请求和响应对象等，具体有哪些数据看 [这里](https://zh.nuxtjs.org/api/context)

与 `asyncData` 配合使用的还有一个 `watchQuery` ，用来监听地址的上的查询参数，例如：

```js
export default {
  watchQuery: ['id']
}
```

当 `id` 变化时，例如 `localhost:3000/article?id=111` 变成 `localhost:3000/article?id=222` 时，重新调用一次 `asyncData` 方法。

以上就是 NuxtJS 的基本使用，具体的使用案例可以查看 [这里](./NuxtJSCase.md)