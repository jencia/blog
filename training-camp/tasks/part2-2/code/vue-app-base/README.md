# vue-app-base

## 使用

1. 安装依赖

```sh
yarn
# or 
npm install
```

2. 启动项目

```sh
yarn serve
# or
npm run serve
```

3. 打包前检查 ESLint

```sh
yarn lint
# or
npm run lint
```

4. 项目编译打包

```sh
yarn build
# or
npm run build
```

生成的 dist 目录就是编译后的文件目录。

## 特性

- JS 支持 ES6+ 新特性
- 能够识别 png、jpg、less 资源文件
- 支持 vue
- 开发环境支持热更新、能够 ESLint 实时监测
- 生成环境能够压缩 HTML、CSS、JS、图片

## 目录结构

```
└── vue-app-base
   ├─ public        存放不需要编译的文件
   │  ├─ favicon.ico
   │  └─ index.html
   ├─ src             存放源码
   │  ├─ assets       存放资源文件
   │  │  ├─ logo.png
   │  ├─ components
   │  │  └─ HolloWorld.vue
   │  ├─ App.vue
   │  ├─ main.js
   │  └─ style.less
   ├─ .editorconfig
   ├─ .eslintignore   eslint 忽略文件
   ├─ .eslintrc.js    eslint 配置文件
   ├─ babel.config.js babel 配置文件
   ├─ package.json
   ├─ README.md
   ├─ webpack.common.js  公共配置
   ├─ webpack.dev.js     开发环境配置
   └─ webpack.prod.js    生产环境配置
```
