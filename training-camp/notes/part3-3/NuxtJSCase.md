# NuxtJS 综合案例

使用 NuxtJS 实现 RealWorld 全部功能

示例地址：https://demo.realworld.io/

静态页面模板和接口 API 直接使用 [realworld-starter-kit](https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INSTRUCTIONS.md)

## 创建项目

```sh
$ mkdir realworld-nuxt  # 创建项目目录
$ cd realworld-nuxt     # 进入目录

$ yarn init --yes       # 初始化项目
$ yarn add nuxt         # 安装 nuxt
```

修改 `package.json` 添加 `scripts`

```diff
{
  "name": "realworld-nuxt",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
+ "scripts": {
+   "dev": "nuxt",
+   "start": "nuxt start",
+   "build": "nuxt build"
+ },
  "dependencies": {
    "axios": "^0.20.0"
  }
}
```

各命令行的作用：

- `nuxt` 启动开发环境
- `nuxt start` 启动 web 服务器访问打包文件
- `nuxt build` 项目打包

创建 git 忽略文件 `.gitignore`

```
node_modules
.nuxt
```

## 创建首页

创建 `pages` 文件夹，并在文件夹下创建 `index.vue` 文件，此时的项目结构是这样的：

```
├─ node_modules/
├─ pages/
│   └─ index.vue
├─ package.json
└─ yarn.lock
```

编辑 `pages/index.vue` 文件：

```html
<template>
    <div>Hello World!</div>
</template>

<script>
export default {
    name: 'Home'
}
</script>
```

启动项目：

```sh
$ yarn run dev
```

访问页面：http://localhost:3000/ 

如果能正常访问，页面就创建成功。

## 导入资源文件

创建 `app.html` 文件，从 [NuxtJS 官网](https://zh.nuxtjs.org/guide/views) 找到默认的模板，复制到 `app.html` 里

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

在 [realworld-starter-kit](https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INSTRUCTIONS.md) 里找到 `Header` 模板，复制 `<link>` 部分到 `app.html` 文件：

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
    <link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
    <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="//demo.productionready.io/main.css">
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

这边用到 `ionicons`，这个库可以在 CDN 里找到，而这边用到的 CDN 是国外的，所以我们可以换成国内的 CDN，可以在 [jsdelivr](https://www.jsdelivr.com/) 上搜索 `ionicons` 找到同样的版本 `2.0.1` ，复制 `ionicons.min.css` 的 CDN 地址。

```diff
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
-   <link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
+   <link href="https://cdn.jsdelivr.net/npm/ionicons@2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
    <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="//demo.productionready.io/main.css">
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

这边的 `//demo.productionready.io/main.css` 也是挂载在国外的，可以直接下载到本地，引用本地文件。将地址粘贴到浏览器地址栏，前面加上 `http:` 访问，然后下载到本地，改名为 `index.css`。

创建 `static` 目录，将 `index.css` 文件丢进去，然后就可以通过 `/index.css` 路径访问到。

```diff
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
    <link href="https://cdn.jsdelivr.net/npm/ionicons@2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
    <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css">
-   <link rel="stylesheet" href="//demo.productionready.io/main.css">
+   <link rel="stylesheet" href="/index.css">
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

## 创建布局组件

创建 `layouts/default.vue` 文件，内容从 `Header` 和 `Footer` 模板里面取，只拿 `body` 里面的代码就好。使用 `<nuxt>` 来接收页面内容作为内容层。最终代码如下：

```html
<template>
    <div>
        <nav class="navbar navbar-light">
            <div class="container">
                <a class="navbar-brand" href="index.html">conduit</a>
                <ul class="nav navbar-nav pull-xs-right">
                <li class="nav-item">
                    <!-- Add "active" class when you're on that page" -->
                    <a class="nav-link active" href="">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="">
                    <i class="ion-compose"></i>&nbsp;New Post
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="">
                    <i class="ion-gear-a"></i>&nbsp;Settings
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="">Sign up</a>
                </li>
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
    name: 'DefaultLayout'
}
</script>
```

## 创建各个页面

根据 [realworld-starter-kit](https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INSTRUCTIONS.md) 的路由设计和 NuxtJS 的路由自动化机制，创建如下结构的页面文件：

```
pages
├─ article/
│   └─ _article_id.vue 
├─ editor/
│   └─ _article_id.vue 
├─ profile/
│   ├─ _user_id/
│   │     ├─ favorites.vue
│   │     └─ index.vue 
│   └─ index.vue 
├─ index.vue
├─ login.vue
├─ register.vue
└─ settings.vue
```

从模板那复制相应的代码到对应页面里。不过有些页面模板的一样的，就需要提取到公共组件里，再引用同一个组件。

- login 和 register 内容一样，提取出 `components/Auth.vue` 组件
- profile 里的 index 和 favorites 内容一样，提取出 `component/Profile.vue` 组件

## 封装请求模块和方法

安装 axios 模块：

```sh
$ yarn add axios
```

创建 `utils/request.js` 文件，设置请求基本地址：

```js
import axios from 'axios'

const request = axios.create({
    baseURL: 'https://conduit.productionready.io'
})

export default request
```

根据realword 提供的 [接口 API 文档](https://github.com/gothinkster/realworld/tree/master/api) 封装对应的请求方法。

根据接口类别创建 `api/user.js`、`api/article.js`、`api/profiles.js`、`api/tag.js` 。例如 `api/user.js` 代码如下：

```js
import request from '@/utils/request'

export function login (data) {
    return request({
        method: 'POST',
        url: '/api/users/login',
        data
    })
}

export function register (data) {
    return request({
        method: 'POST',
        url: '/api/users',
        data
    })
}
```
