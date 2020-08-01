# Vue CLI

## 安装

要求 Node.js >= 8.9 版本

推荐使用 yarn 安装

全局安装：

```sh
$ yarn global add @vue/cli
```

查看版本号：

```sh
vue --version
# @vue/cli 4.4.6
```

## 基础

### 快速原型开发

你可以使用 `vue serve` 和 `vue build` 命令对单个 `*.vue` 文件进行快速原型开发，不过这需要先额外安装一个全局的扩展：

```sh
yarn global add @vue/cli-service-global
```

#### vue serve

命令行使用说明：

```
Usage: serve [options] [entry]

在开发环境模式下零配置为 .js 或 .vue 文件启动一个服务器

Options:

  -o, --open  打开浏览器
  -c, --copy  将本地 URL 复制到剪切板
  -h, --help  输出用法信息
```

你所需要的仅仅是一个 App.vue 文件

```html
<template>
  <h1>Hello!</h1>
</template>
```

```sh
$ vue serve
```

这时候就会自动打开页面渲染这个组件。

这命令默认入口文件是 `main.js`、`index.js`、`App.vue` 或 `app.vue` 中的一个，如果是其他文件需要指定入口文件：

```sh
$ vue serve MyComponent.vue
```

#### vue build

命令行使用说明：

```
Usage: serve [options] [entry]

在开发环境模式下零配置为 .js 或 .vue 文件启动一个服务器

Options:

  -o, --open  打开浏览器
  -c, --copy  将本地 URL 复制到剪切板
  -h, --help  输出用法信息
```

使用：

```sh
$ vue build
```

此时就会将刚写的 App.vue 编译到 dist 目录下。

### 创建一个项目

命令行创建：

```sh
$ vue create hello-world
```

![](https://cli.vuejs.org/cli-new-project.png)

图形化界面创建：

```sh
$ vue ui
```

![](https://cli.vuejs.org/ui-new-project.png)

### 插件

Vue CLI 使用了一套基于插件的架构。如果你查阅一个新创建项目的 `package.json`，就会发现依赖都是以 `@vue/cli-plugin-` 开头的。插件可以修改 webpack 的内部配置，也可以向 `vue-cli-service `注入命令。在项目创建的过程中，绝大部分列出的特性都是通过插件来实现的。

基于插件的架构使得 Vue CLI 灵活且可扩展。如果你对开发一个插件感兴趣，请翻阅[插件开发指南](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html)。

安装插件：

```sh
$ vue add eslint
```

eslint 会被解析为完整的包名 `@vue/cli-plugin-eslint`，然后从 npm 安装它，调用它的生成器。

如果模块已经安装过了，只是想调用它的生成器，可以用 `vue invoke` 命令：

```sh
$ vue invoke eslint
```

eslint 是内置插件才会解析为完整包名，如果是第三方插件，比如 apollo

```sh
$ vue add apollo
```

最终安装的是 vue-cli-plugin-apollo

默认情况项目用到的插件是列在项目根目录下的 `package.json` 文件，如果想要设置到其他地方，可以在根目录下的 `package.json` 里配置 `vuePlugins.resolveFrom` 选项。例如指向 `.config/package.json` 文件：

```json
{
  "vuePlugins": {
    "resolveFrom": ".config"
  }
}
```

### CLI 服务

#### vue-cli-service serve

```
用法：vue-cli-service serve [options] [entry]

选项：

  --open    在服务器启动时打开浏览器
  --copy    在服务器启动时将 URL 复制到剪切版
  --mode    指定环境模式 (默认值：development)
  --host    指定 host (默认值：0.0.0.0)
  --port    指定 port (默认值：8080)
  --https   使用 https (默认值：false)
```

`vue-cli-service serve` 命令会启动一个开发服务器 (基于 `webpack-dev-server)` 并附带开箱即用的模块热重载 (Hot-Module-Replacement)。

除了通过命令行参数，你也可以使用 `vue.config.js` 里的 `devServer` 字段配置开发服务器。更多 `vue.config.js` 可查看[配置参数](https://cli.vuejs.org/zh/config/)

#### vue-cli-service build

```
用法：vue-cli-service build [options] [entry|pattern]

选项：

  --mode        指定环境模式 (默认值：production)
  --dest        指定输出目录 (默认值：dist)
  --modern      面向现代浏览器带自动回退地构建应用
  --target      app | lib | wc | wc-async (默认值：app)
  --name        库或 Web Components 模式下的名字 (默认值：package.json 中的 "name" 字段或入口文件名)
  --no-clean    在构建项目之前不清除目标目录
  --report      生成 report.html 以帮助分析包内容
  --report-json 生成 report.json 以帮助分析包内容
  --watch       监听文件变化
```

`vue-cli-service build` 会在 `dist/` 目录产生一个可用于生产环境的包，带有 JS/CSS/HTML 的压缩，和为更好的缓存而做的自动的 vendor chunk splitting。它的 chunk manifest 会内联在 HTML 里。

#### vue-cli-service inspect

```
用法：vue-cli-service inspect [options] [...paths]

选项：

  --mode    指定环境模式 (默认值：development)
```

#### 缓存和并行处理

- cache-loader 会默认为 Vue/Babel/TypeScript 编译开启。文件会缓存在 `node_modules/.cache` 中——如果你遇到了编译方面的问题，记得先删掉缓存目录之后再试试看。

- thread-loader 会在多核 CPU 的机器上为 Babel/TypeScript 转译开启。

### Git Hook

在安装之后，@vue/cli-service 也会安装 yorkie，它会让你在 package.json 的 gitHooks 字段中方便地指定 Git hook：

```jsons
{
  "gitHooks": {
    "pre-commit": "lint-staged"
  },
   "lint-staged": {
    "*.{js,vue}": [
      "vue-cli-service lint",
      "git add"
    ]
  }
}
```

## 开发



