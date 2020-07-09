# pages-boilerplate

## 使用

1. 安装依赖

```sh
yarn
# or 
npm install
```

2. 启动项目

```sh
yarn start
# or
npm run start
```

3. 项目编译打包

```sh
yarn build
# or
npm run build
```

生成的 dist 目录就是编译后的文件目录。

## 特性

- JS 支持 ES6+ 新特性
- 能够识别 SCSS 文件
- HTML 支持 Swig 语法
- 开发环境支持热更新
- 生成环境能够压缩 HTML、CSS、JS、图片、字体文件

## 目录结构

```
└── my-awesome-pages 
   ├─ public        存放不需要编译的文件
   │  └─ favicon.ico
   ├─ src             存放源码
   │  ├─ assets       存放资源文件
   │  │  ├─ fonts     存放字体文件
   │  │  │  └─ pages.ttf
   │  │  ├─ images    存放图片文件
   │  │  │  └─ logo.png
   │  │  ├─ scripts   存放脚本文件
   │  │  │  └─ main.js
   │  │  └─ styles    存放样式文件
   │  │     ├─ _variables.scss
   │  │     └─ main.scss
   │  ├─ layouts
   │  │  └─ basic.html
   │  ├─ partials
   │  │  └─ header.html
   │  ├─ about.html
   │  └─ index.html   首页
   ├─ .csscomb.json
   ├─ .editorconfig
   ├─ .gitignore
   ├─ .travis.yml
   ├─ CHANGELOG.md
   ├─ LICENSE
   ├─ README.md
   ├─ gulpfile.js
   ├─ package.json
   └─ yarn.lock
```
