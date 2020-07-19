# ESLint

- ESLint 是目前最为主流的 JavaScript Lint 工具监测 JS 代码质量。
- ESLint 很容易统一开发者的编码风格
- Eslint 可以帮助开发者提升编码能力

## 快速上手

### 1. 初始化项目

创建一个项目目录并进入目录

```sh
$ yarn init --yes
```

### 2. 安装依赖

```sh
$ yarn add -D eslint
```

### 3. 初始化 ESLint

> 当前版本 7.5.0

```sh
$ yarn eslint --init

? How would you like to use ESLint？ # 你想如何使用 ESLint
  To check syntax only               # 仅检测语法
  To check syntax and find problems  # 检测语法并找到问题代码
> To check syntax and find problems, and enforce code style  # 检测语法并找到问题代码, 检测代码风格

? What type of modules does your project use?  # 模块化采用哪种风格
  JavaScript modules (import/export)
  CommonJS (require/exports)
> None of these

? which framework does your project use? # 你的项目使用说明框架
  React
  Vue.js
> None of these

? Does your project use TypeScript? No / (Yes)

? Where does your code run? # 你的代码如何运行
> Browser
  Node

? How would you link to define a style for your project? #你如何为你的项目定义一个风格
> Use a popular style guide          # 市面上受欢迎的风格
  Answer questions about your style  # 通过问答形成一个风格
  Inspect your JavaScript file(s)    # 根据你的 JS 文件推断出一种风格

? Which style guide do you want to follow?  # 你想遵循哪种风格
  Airbnb: https://github.com/airbnb/javascript
> Standard: https://github.com/standard/standard
  Google: https://github.com/google/eslint-config-google

? What format do you want your config file to be in? # 你想要配置文件的格式是什么
> JavaScript
  YAML
  JSON

? Would you like to install them now with npm? No / (Yes) # 上述问答用到了 Standard 是否需要现在安装
```

这时候在项目根目录下就能看到一个 .eslintrc.js 的文件。

### 4. 编写代码

这边简单的写一些代码，在根目录下创建一个 index.js 文件

```js
const str = '';


console.log(str)
```

### 5. ESLint 检测代码

如果你的编辑器支持 ESLint，且开启 ESLint 检测，此时应该就能看到代码上报错了。你也可以通过命令行检测：

```sh
$ yarn eslint index.js
```

如果你只完全复制粘贴上面的 JS 代码，此时应该是报了 3 个错误。这时候你可以手动去修改掉代码，也可以通过命令行自动修复

```sh
$ yarn eslint index.js --fix
```

这时候再去看下 index.js 代码，你会发现错误的代码已经自动纠正好了。不过这个自动修复功能不是万能的，有些错误是无法自动修复的。

建议不要去使用自动修复功能，不要去依赖工具，有问题最好自己去改，改多了就知道套路了，所以这可以帮助你提升编码质量。


## 配置文件解析

上一节我们通过 `yarn eslint --init` 生成了一个配置文件，这一节就详细讲解下这个文件。

```js
module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
  }
}
```

1. env

标记当前代码的最终运行环境，ESLint 会根据这边的配置判断你使用的全局对象是否存在，这边设置 browser 为 true ，就代表在浏览器环境下运行，也就可以使用 DOM 和 BOM 的 API 。如果设置为 false ，你再去使用 document 对象 ESLint 就会报错。

按照前面说的 browser 设置为 false，再去使用 document 对象，实际测试却没有报错。那是因为我们继承了 standard , standard 配置里面我们可以看到这样一条配置：

```json
{
    "globals": {
        "document": "readonly",
        "navigator": "readonly",
        "window": "readonly"
    },
}
```

在 env 找不到对应的全局对象，但在 globals 却找到了，所以没有报错。那我们换一个对象，使用 alert ，这时候就会报错了。

env 里的 browser 配置就相当于定义了一系列全局变量对象，就是一个变量集合。env 就是配这些变量集合，提供了很多集合，可以随意组合。

2. extends

继承配置

3. parserOptions

解析器参数配置。

这边配了 ecmaVersion 是指定 ECMAScript 版本号，11 就代表 es11 。这边检测的是语法层面，而 env 里的 es2020 是配全局成员对象的检测。

4. rules

配置 ESLint 每一个配置的开启状态。

```js
module.exports = {
    // ...
    rules: {
        'no-alert': 'error'
    }
}
```

这边配置是代码风格检测，以键值对的形式配置，键是具体的规则名称，值是开启状态。ESLint 提供了很多规则，报错的时候都会标明具体不满足哪一个规则，可以根据这个规则名称去官网查阅相关文档。

开启状态有三个值：

- 'off'：关闭
- 'warn'：开启，以警告的形式体现
- 'error'：开启，以报错的形式体现

有些规则有参数配置，值就可以传数组：

```js
module.exports = {
    // ...
    rules: {
        "camelcase": ["error", { "properties": "never" }]
    }
}
```

5. globals

添加自定义全局成员

```js
module.exports = {
    // ...
    globals: {
        "jQuery": "readonly"
    }
}
```

## 配置注释

开发过程总会有那么几个是要违反规则配置的，ESLint 针对这种情况提供了配置注释的形式，通过代码注释来忽略某些代码 eslint 检测。具体的用法如下：

- 忽略当前行

```js
const str = 'xx';    // eslint-disable-line semi
```

- 忽略下一行

```js
/* eslint-disable-next-line semi */
const str = 'xx';
```

- 忽略一个范围

```js
/* eslint-disable semi */
const str = 'xx';
/* eslint-enable semi */
```

配置注释最后跟上要忽略的具体规则，这样就只会忽略一个规则，其他规则还是照常检测。

## 结合 Gulp

拿之前 gulp 示例里面的 [zce-gulp-demo](../part2-1/code/gulp/zce-gulp-demo/gulpfile.js) 来改。

```sh
$ yarn add -D eslint gulp-eslint
$ yarn eslint --init
```

```diff
const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
+       .pipe(plugins.eslint())
+       .pipe(plugins.eslint.format())
+       .pipe(plugins.eslint.failAfterError())
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}
```

加上 `plugins.eslint.format()` 和 `plugins.eslint.failAfterError()` 是为了在 ESLint 检测到错误的时候终止管道，让 Gulp 不会继续执行下去。

## 结合 Webpack

```sh
$ yarn add -D eslint eslint-loader
```

```diff
module.exports = {
    ...
    module: {
        rules: [
            {
                testL /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
+           {
+               testL /\.js$/,
+               exclude: /node_modules/,
+               use: 'eslint-loader',
+               enforce: 'pre'
+           },
        ]
    }
}
```


