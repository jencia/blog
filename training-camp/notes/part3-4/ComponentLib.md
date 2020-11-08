# 封装 Vue.js 组件库

## 快速原型开发

快速预览单个 `vue` 文件的效果。

```sh
$ yarn global add @vue/cli-service-global
```

```sh
# 预览当前目录的 App.vue 文件
$ vue server App.vue

# 不指定文件时会自动查找 main.js、index.js、App.vue、app.vue
$ vue server
```

## 使用 ElementUI

```sh
# 初始化项目
$ yarn init --yes

# 加入 ElementUI
$ vue add element

? Still proceed? (y/N) y
? How do you want to import Element? (Use arrow keys)
  Fully import 
❯ Import on demand 
? Choose the locale you want to load (Use arrow keys)
❯ zh-CN 
  zh-TW 
  af-ZA 
  ar 
  bg 
  ca 
  cs-CZ 
```

项目根目录下创建 `main.js` :

```js
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'

Vue.use(ElementUI)

new Vue({
    el: '#app',
    render: h =>h(App)
})
```

然后在 `App.vue` 里就可以使用 `ElementUI` 的组件了。

## Monorepo

一个项目仓库中管理多个模块/包

```
├─ package.json
├─ node_modules/
└─ packages/
    ├─ button/
    │   ├─ src/
    │   ├─ node_modules/
    │   ├─ index.js
    │   ├─ package.json
    │   └─ README.md
    ├─ panel/
    │   ├─ __test__/
    │   ├─ src/
    │   ├─ index.js
    │   ├─ package.json
    │   └─ README.md
    ├─ modal/
    ├─ form/
    └─ card/
```

每一个模块都具有相同的项目结构，都有独立的 package.json 和 node_modules，都可以独立发布模块。

所有的模块都放在一个项目里管理，相同的第三方模块放在根目录的 node_modules ，不同的放在各自模块下的 node_modules，由此解决重复安装模块问题。


## yarn workspaces

`yarn workspaces` 是 `Monorepo` 的一种具体的实现方案，以下是具体的用法：

根目录的 `package.json` 添加配置：

```json
{
  "private": true,
  "workspaces": [
    "./packages/*"
  ]
}
```

配置 `private` 避免项目被不小心发布了，只允许各自的模块独自发布。
配置 `workspaces` 指定需要被统一管理的目录列表

依赖安装：

```sh
# 在根目录安装依赖
$ yarn add [module-name] -W

# 给指定模块安装依赖，遇到重复的会提取到根目录
$ yarn workspace [package-name] add [module-name]

# 给所有工作区安装依赖
$ yarn install

# 执行指定模块的 npm scripts
$ yarn workspace [package-name] run [script-name]
```

## storybook

特点：

- 可视化的组件展示平台
- 在隔离的开发环境中，以交互式的方式展示组件
- 独立开发组件
- 支持众多框架

基于上面的 `yarn workspaces` 引入 `storybook` ：

1. 安装：

```sh
$ npx sb init --type vue
$ yarn add -W vue
$ yarn add -D -W vue-loader vue-template-compiler
```

2. 修改 `.storybook/main.js`

```diff
module.exports = {
  "stories": [
-   "../stories/**/*.stories.mdx",
-   "../stories/**/*.stories.@(js|jsx|ts|tsx)",
+   "../packages/**/*.stories.js"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ]
}
```

3. 删除整个 `src` 目录
4. 开发 `stories` 文件:

在各个模块上创建 `[组件名].stories.js` 文件，例如：

```diff
├─ package.json
└─ packages/
    ├─ button/
    │   ├─ __test__/
    │   ├─ src/
+   │   ├─ stories/
+   │   │   └─ button.stories.js
    │   ├─ index.js
    │   ├─ package.json
    │   └─ README.md
    ...
```

`button.stories.js`

```js
import Button from '../'

// 默认导出成员作为第一层菜单信息
export default {
    title: 'Button',
    component: Button
}

// 第二层菜单信息，变量名 Demo1 将作为菜单名存在
// 传一个函数，返回一个组件配置，将作为预览组件
export const Demo1 = () => ({
    components: { Button },
    template: '<Button>第一种按钮</Button>'
})

export const Demo2 = () => ({
    components: { Button },
    template: '<Button type="reset">第二种按钮</Button>'
})
// 如果不想用 Demo2 为菜单名，可以通过配置修改
Demo2.story = {
  name: '重置按钮'
}
```

5. 运行 `storybook`

```sh
$ yarn run storybook
```

## Lerna

Lerna 是一个优化使用 git 和 npm 管理多包仓库的工作流工具，用于管理具有多个包的 JavaScript 项目，它可以一键把代码提交到 git 和 npm 仓库。

1. 安装

```sh
$ yarn global add lerna
```

2. 初始化

```sh
$ lerna init
```

3. 发布

```sh
$ lerna publish
```

## Rollup 打包

安装依赖：

```sh
$ yarn add -D -W rollup rollup-plugin-terser rollup-plugin-vue@5.1.9 vue-template-compiler rollup-plugin-postcss @rollup/plugin-node-resolve rollup-plugin-delete
```

根目录下创建 `rollup.config.js` 文件：

```js
import fs from 'fs'
import path from 'path'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import del from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const isDev = process.env.NODE_ENV !== 'production'

// 公共插件配置
const plugins = [
  vue({
    // Dynamically inject css as a <style> tag
    css: true,
    // Explicitly convert template to render function
    compileTemplate: true
  }),
  nodeResolve(),
  postcss({
    // 把 css 插入到 style 中
    // inject: true,
    // 把 css 放到和js同一目录
    extract: true
  })
]

// 如果不是开发环境，开启压缩
isDev || plugins.push(terser())

// packages 文件夹路径
const root = path.resolve(__dirname, 'packages')

module.exports = fs.readdirSync(root)
  // 过滤，只保留文件夹
  .filter(item => fs.statSync(path.resolve(root, item)).isDirectory())
  // 为每一个模块创建对应的配置
  .map(item => {
    const pkg = require(path.resolve(root, item, 'package.json'))
    return {
      input: path.resolve(root, item, 'index.js'),
      output: [
        {
          exports: 'auto',
          file: path.resolve(root, item, pkg.main),
          format: 'cjs'
        },
        {
          exports: 'auto',
          file: path.join(root, item, pkg.module),
          format: 'es'
        },
      ],
      plugins: [
        // 清除每个模块下的 dist 目录
        del({ targets: path.resolve(root, item, 'dist') }),
        ...plugins
      ]
    }
  })
```

把 `packages` 目录下各个模块的 `package.json` 做调整：

```diff
{
  "name": "jc-button",
  "version": "1.0.0",
- "main": "index.js",
+ "main": "dist/cjs/index.js",
+ "module": "dist/es/index.js",
  "license": "MIT"
}
```

根目下的 `package.json` 将添加到 `script`

```diff
{
  ...
  "scripts": {
    ...
+   "build": "rollup -c"
  },
  ...
}
```

## 设置环境变量

安装依赖：

```sh
$ yarn add -D -W cross-env
```

修改根目录下 `package.json` 里的 `build` 命令：

```diff
{
  ...
  "scripts": {
    ...
-   "build": "rollup -c",
+   "build:dev": "cross-env NODE_ENV=development rollup -c",
+   "build:prod": "cross-env NODE_ENV=production rollup -c"
  },
  ...
}
```

## Plop 生成基本结构

1. 安装 plop：

```sh
$ yarn add -D -W plop
```

2. 创建模板文件

创建 `plop-template` 用来存放模板文件，将前面写好的组件拷贝过来，删除多余的代码，留下基本结构代码。把后面名都改成 `.hbs` ，文件名带有组件名的改成 `component` ，最后形成的文件结构如下：

```
plop-template/
├─ src/
│  └─ component.hbs
├─ stories/
│  └─ component.stories.hbs
├─ index.hbs
├─ package.hbs
└─ README.hbs
```

3. 修改模板文件

将里面的代码含有组件名的改成 `{{ name }}` 或 `{{ properCase name }}` ，前者是组件名，后者是组件名首字母大写，例如 `component.stories.hbs` 文件代码：

```hbs
import Jc{{ properCase name }} from '..'

export default {
    title: 'Jc{{ properCase name }}',
    component: Jc{{ properCase name }}
}

export const Demo = () => ({
    components: { Jc{{ properCase name }} },
    template: '<jc-{{ name }} />'
})
```

4. 在根目录下创建 `plopfile.js` 文件：

```js
/** @param {import('plop').NodePlopAPI} plop */
module.exports = plop => {
  plop.setGenerator('component', {
    description: '创建一个自定义组件',
    // 命令行询问组件名，这边 name 字段接收输入值
    prompts: [
      {
        type: 'input',
        name: 'name',
        default: 'MyComponent',
        message: 'component name'
      }
    ],
    // 文件生成
    actions: [
      // 传一个对象代表生成一个文件
      {
        type: 'add',
        // 最终生成路径
        path: './packages/{{ name }}/src/{{ name }}.vue',
        // 模板文件位置
        templateFile: './plop-template/src/component.hbs'
      },
      // ...
    ]
  })
}
```

5. 根目录 `package.json` 的 `scripts` 增加命令：

```diff
{
  ...
  "scripts": {
    ...
+   "plop": "plop"
  },
  ...
}
```

6. 模板生成测试

```sh
$ yarn run plop
```
