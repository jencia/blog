# Vue 3.0 介绍

## 源码组织方式

- 源码全部采用 TypeScript 编写
- 使用 Monorepo 管理项目结构

```
packages
├─ compiler-core/      编译与平台无关的代码
├─ compiler-dom/        编译浏览器平台代码
├─ compiler-sfc/        编译单文件组件
├─ compiler-ssr/        编译服务端渲染
├─ reactivity/          数据响应式系统
├─ runtime-core/        运行时处理与平台无关的代码
├─ runtime-dom/         运行时处理浏览器平台代码
├─ runtime-test/        提供测试支持，可以用来测试渲染结果是否正确
├─ server-renderer/     用于服务器渲染
├─ shared/              内部使用，公共 API
├─ size-check/          内部使用，检测包的大小
├─ template-explorer/   浏览器运行的实时编译组件，输出 render 函数
├─ vue/                 构建完整版的 vue
└─ global.d.ts
```

## 不同构建版本

- cjs       用于 CommonJS 规范下使用
    - `vue.cjs.js`
    - `vue.cjs.prod.js`
- global    用于 html 文件 script 引入
    - `vue.global.js`
    - `vue.global.prod.js`
    - `vue.runtime.global.js`
    - `vue.runtime.global.prod.js`
- browser   用于浏览器原生模块化使用
    - `vue.esm-browser.js`
    - `vue.esm-browser.prod.js`
    - `vue.runtime.esm-browser.js`
    - `vue.runtime.esm-browser.prod.js`
- bundler   用于 webpack 环境里使用
    - `vue.esm-bundler.js`
    - `vue.runtime.esm-bundler.js`

其中文件名带有 `.runtime` 的代表只有运行时，反之代表编译器和运行时都有。文件名带有 `.prod` 的代表生成环境代码，有经过压缩处理。

## Composition API

- RFC（Request For Comments）   官方发起提案，收集社区的反馈和讨论，最终确认
    - https://github.com/vuejs/rfcs
- Composition API RFC          官方 Composition API 提案文档
    - https://v3.vuejs.org/guide/composition-api-introduction.html#why-composition-api

设计动机：

Options API 开发复杂组件时，同一个功能逻辑的代码被拆分到不同选项，不易于维护

Composition API 是一组基于函数的 API ，可以更灵活的组织组件的逻辑


## 性能提升

1. 响应式系统升级

使用 Proxy 对象重写响应式系统
- 可以监听动态新增的属性
- 可以监听删除的属性
- 可以监听数组的索引和 length 属性

2. 编译升级

编辑和提升所有的静态节点，
- Fragments：不再要求组件要有一个唯一的根节点，需升级 vetur 插件
- 静态节点提升：模板编译的时候会将静态节点（没有绑定数据的节点）提升，diff 的时候只需要对比动态节点内容
- Patch flag：标记节点类型，提高 diff 算法比对速度
- 缓存事件处理函数：避免重新渲染时重复创建和绑定函数，避免不必要的操作

3. 优化打包体积

- 移除了一些不常用的 API，例如 inline-template、filter
- 支持 Tree-shaking

## Vite

Vite 伴随着 Vue 3.0 一起出来的构建工具，比传统的 Webpack 快很多。

Vite 生成的模板使用原生 ES Module ，我们先来回顾下。

### 原生 ES Module

用法：

```html
<script type="module" src="./main.js"></script>
<script type="module">
    // your code
</script>
```

ES Module 默认延迟加载
- 类似于 `<script>` 设置 `defer`
- 在文档解析完成后，触发 DOMContentLoaded 事件前执行

### Vite 的优势

Vite 在开发模式下不需要打包可以直接运行，由此有了以下优点：

- 快速冷启动：不需要编译，直接开启，开启速度快
- 按需编译：当代码需要加载的时候才去编译
- 模块热更新：热更新速度不会因为项目体积变大而变慢

Vite 在生成环境下采用 Rollup 打包，打包体积更小

### Vite 的使用

无需安装，直接创建项目

```sh
$ npm init vite-app <project-name>
# 或者
$ yarn create vite-app <project-name>
```

`<project-name>` 换成你的项目名，然后就可以进入项目目录，安装模块，启动项目。

以上是使用默认的模板，Vite 不只是运用到 Vue 项目，也可以运用到其他框架的项目，官方出了几个模块：

- `vue (default)`
- `vue-ts`
- `react`
- `react-ts`
- `preact`
- `reason-react`

如果使用的是 `react` 模板，项目创建命令行应该改成：

```sh
$ npm init vite-app <project-name> --template react
## 或者
$ yarn create vite-app <project-name> --template react
```