# Vue Loader

## 起步

### 安装

```sh
$ yarn add -D vue-loader vue-template-compiler
```

### webpack 配置

```js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            // 它会应用到普通的 `.js` 文件
            // 以及 `.vue` 文件中的 `<script>` 块
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            // 它会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        // 请确保引入这个插件
        new VueLoaderPlugin(),
        new HTMLWebpackPlugin({
            template: './src/index.html'
        })
    ]
};
```

## 处理资源路径

在 `<template>` 块内资源 URL 会被转为 require 引入，例如

```js
<img src="../image.png">
```

会转换为

```js
createElement('img', {
    attrs: {
        src: require('../image.png') // 现在这是一个模块的请求了
    }
})
```

默认会被转换的有这些：

```js
{
  video: ['src', 'poster'],
  source: 'src',
  img: 'src',
  image: ['xlink:href', 'href'],
  use: ['xlink:href', 'href']
}
```

可以通过 `transformAssetUrls` 选项修改配置

资源 URL 转换会遵循如下规则：

- 如果路径是绝对路径 (例如 `/images/foo.png`)，会原样保留。
- 如果路径以 `.` 开头，将会被看作相对的模块依赖，并按照你的本地文件系统上的目录结构进行解析。
- 如果路径以 `~` 开头，其后的部分将会被看作模块依赖。这意味着你可以用该特性来引用一个 Node 依赖中的资源
- 如果路径以 `@` 开头，也会被看作模块依赖。如果你的 webpack 配置中给 `@` 配置了 alias，这就很有用了。所有 vue-cli 创建的项目都默认配置了将 `@` 指向 `/src`

## 处理Sass

```sh
$ yarn add -D sass-loader node-sass
```

```js
module.exports = {
    module: {
        rules: [
            // 普通的 `.scss` 文件和 `*.vue` 文件中的
            // `<style lang="scss">` 块都应用它
            {
                test: /\.scss$/
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    }
    // ...
}
```

```html
<style lang="scss">
/* 在这里撰写 SCSS */
</style>
```

## Scoped CSS

当 `<style>` 标签有 scoped 属性时，它的 CSS 只作用于当前组件中的元素。

```html
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

转换结果：

```html
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

你可以在一个组件中同时使用有 scoped 和非 scoped 样式：

```html
<style>
/* 全局样式 */
</style>

<style scoped>
/* 本地样式 */
</style>
```

使用 `scoped` 后，父组件的样式将不会渗透到子组件中。不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响。

如果想要想强制影响子组件，可以使用 `>>>` 操作符：

```html
<style scoped>
.a >>> .b { /* ... */ }
</style>
```

有些像 Sass 之类的预处理器无法正确解析 `>>>` 。这种情况你可以使用 `/deep/` 或 `::v-deep` ：

```html
<style lange="scss" scoped>
.a/deep/ .b { /* ... */ }
.a::v-deep .b { /* ... */ }
.a::v-deep {
    .b { /* ... */ }
}
</style>
```

如果是通过 `v-html` 创建的 DOM 内容就不受 scoped 样式影响，但是你仍然可以通过深度作用选择器来为他们设置样式。

## CSS Modules

### 用法

CSS Module 必须通过向 `css-loader` 传入 `module: true` 来开启：

```js
{
    test: /\.css$/,
    use: [
        'vue-style-loader',
        {
            loader: 'css-loader',
            options: {
                // 开启 CSS Modules
                modules: true,
                // 需要自定义生成的类名的传对象
                // modules: {
                //     localIdentName: '[local]_[hash:base64:8]'
                // }
            }
        }
    ]
}
```

然后在你的 `<style>` 上添加 `module` 特性：

```html
<style module>
.red {
  color: red;
}
.bold {
  font-weight: bold;
}
</style>
```

这个 `module` 特性指引 Vue Loader 作为名为 `$style` 的计算属性，向组件注入 CSS Modules 局部对象。然后你就可以在模板中通过一个动态类绑定来使用它了：

```html
<template>
    <p :class="$style.red">
        This should be red
    </p>
    <p :class="{ [$style.red]: isRed }">
      Am I red?
    </p>
    <p :class="[$style.red, $style.bold]">
      Red and bold
    </p>
</template>
```

也可以通过 JavaScript 访问到它：

```html
<script>
export default {
    created () {
        console.log(this.$style.red)
        // -> "red_1VyoJ-uZ"
        // 一个基于文件名和类名生成的标识符
    }
}
</script>
```


### 可选用法

如果你只想在某些 Vue 组件中使用 CSS Modules，你可以使用 oneOf 规则并在 resourceQuery 字符串中检查 module 字符串：

```js
{
    test: /\.css$/,
    oneOf: [
        // 这里匹配 `<style module>`
        {
            resourceQuery: /module/,
            use: [
                'vue-style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: '[local]_[hash:base64:5]'
                    }
                }
            ]
        },
        // 这里匹配普通的 `<style>` 或 `<style scoped>`
        {
            use: [
                'vue-style-loader',
                'css-loader'
            ]
        }
    ]
}
```

### 自定义的注入名称

默认样式是从 `$style` 取值，可在单个 `.vue` 文件里可能存在多个 `<style>` ，为了避免样式互相覆盖，可以把注入名称改掉：

```html
<style module="a">
  .card { }
</style>

<style module="b">
  .card { }
</style>
```

使用的时候就是 `a.card` 或 `b.card`

## 热重载

我们用 `vue-loader` 去编译 `.vue` 文件，其实内置已经封装得很好了，只要 `devServer` 开启 `hot` 就享受热重载了。

不过默认情况只有改 html 和 css 才能享用热重载。如果是改变 JS 还是会刷新页面。你需要自己通过 [vue-hot-reload-api](https://github.com/vuejs/vue-hot-reload-api) 去处理重载逻辑。

`vue-loader` 默认开启热重载，除非遇到以下情况：

如果想要关闭，就需要配置

- webpack 的 `target` 的值是 `node` (服务端渲染)
- webpack 会压缩代码
- `process.env.NODE_ENV === 'production'`

你可以设置 `hotReload: false` 选项来显式地关闭热重载：

```js
{
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
        hotReload: false // 关闭热重载
    }
}
```

## 函数式组件

```html
<!-- 在 template 上加 functional 属性表示使用函数式组件 -->
<template functional>
    <!-- 直接使用 props 访问父组件传来的属性 -->
    <div>{{ props.foo }}</div>
    <!-- 使用 parent 访问 Vue 全局属性 -->
    <div>{{ parent.$someProperty }}</div>
</template>
```

## 自定义块

`.vue` 文件一般是使用 `<template>`、`<script>`、`<style>` 这三个语言块，这种语言块也可以自定义。

例如这边自定义一个 `<docs>` 语言块：

```html
<!-- ComponentB.vue -->
<template>
  <div>Hello</div>
</template>

<docs>
This is the documentation for component B.
</docs>
```

```html
<!-- ComponentA.vue -->
<template>
  <div>
    <ComponentB/>
    <p>{{ docs }}</p>
  </div>
</template>

<script>
import ComponentB from './ComponentB.vue';

export default {
  components: { ComponentB },
  data () {
    return {
      docs: ComponentB.docs
    }
  }
}
</script>
```

使用的时候通过组件的 `.docs` 静态属性获取自定义块的内容。要完成这样的功能需要 webpack 配置 loader。

```js
// wepback.config.js
module.exports = {
  module: {
    rules: [
        {
            resourceQuery: /blockType=docs/,
            loader: require.resolve('./docs-loader.js')
        }
    ]
  }
}
```

这个 loader 不再是使用 test 匹配文件，而是用 `resourceQuery` 源码查询匹配自定义块，`/blockType=docs/` 代表自定义块的类型是 docs ，类似于标签名称。loader 需要自定义：

```js
module.exports = function (source, map) {
  this.callback(
        null,
        `export default function (Component) {
            Component.options.docs = ${
                JSON.stringify(source)
            }
        }`,
        map
  )
}
```

匹配到的 source 值就是 `<docs>` 里的内容，`Component.options.docs` 给当前组件添加选项数据，也就是组件静态属性。

## ESLint

```js
// .eslintrc.js
module.exports = {
    extends: [
        "plugin:vue/essential"
    ]
}
```

```js
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ]
    }
}
```
