# Webpack 打包

## 快速上手

### 1. 初始化项目

这边提供一个简单的示例代码供后续调试用：

```
demo1
├─ src/
│   ├─ heading.js
│   └─ index.js  
└─ index.html
```

src/heading.js

```js
export default () => {
    const element = document.createElement('h2')

    element.textContent = 'Hello world'
    element.addEventListener('click', () => {
        alert('hello webpack')
    })

    return element
}
```

src/index.js

```js
import createHeading from './heading.js'

const heading = createHeading()

document.body.append(heading)
```

index.html

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Webpack - 快速上手</title>
</head>
<body>
    <script type="module" src="src/index.js"></script>
</body>
</html>
```

初始化配置

```sh
yarn init --yes
```

### 2. 安装 webpack

```sh
yarn add webpack webpack-cli --dev
```

### 3. 运行 webpack

```sh
yarn webpack
```

执行后默认会以 `src/index.js` 为入口文件进行打包。默认打包到 `dist/main.js` 。

这时候再把 index.html 里的 script 路径改成 `dist/main.js` ，如果页面能正常展示就代表成功了。

## 配置文件

webpack 默认入口文件是 `src/index.js` ，默认出口文件是 `dist/main.js` ，如果不想采用默认配置就需要在项目根目录下创建配置文件 webpack.config.js

webpack 是运行在 NodeJS 下的，所以可以直接使用 NodeJS 的 API ，模块化规范遵守 CommonJS 规范。webpack.config.js 需要导出一个对象，webpack 配置代码都在这个对象上。

```js
const path = require('path')

module.exports = {
    entry: './src/main.js',     // 入口配置
    output: {                   // 出口配置
        filename: 'bundle.js',  // 最终生成的文件名
        path: path.join(__dirname, 'output')    // 出口的根目录
    }
}
```

这样配置的结果是将 `src/main.js` 文件作为入口文件，打包到 `output/bundle.js` 文件里。

**注意：output 里的 path 要用绝对路径**

## 工作模式

webpack 4.x 出了一个工作模式的配置，提供了一系列默认配置，简化了我们很多配置工作。工作模式的配置是 mode ，提供了三个属性：

- `none` 采用最原始的打包方式
- `development` 提供了开发模式下的相关配置
- `production` 提供了生成环境下的相关配置

```diff
const path = require('path')

module.exports = {
+   mode: 'production',    
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    }
}
```

这时候再运行 yarn webpack ，生成的 dist/bundle.js 代码是被压缩过的

## 打包结果运行原理

这里来解读一下 webpack 打包结果的运行原理。

### 整体代码

清除下注释，留下最简化的代码：

```js
(function(modules) {
    // 主函数
    // ...
})([
    (function(module, __webpack_exports__, __webpack_require__)) {
        // 模块函数
        //...
    }),
    (function(module, __webpack_exports__, __webpack_require__)) {
        //...
    }),
])
```

这样就可以直观的看出，webpack 打包代码其实是一个 IIFE（自执行）函数。函数传入一个数组，数组的元素就是各个模块。这边参与打包的有两个文件，也就是两个模块，打包的时候会把每个模块包成函数。

按照文件运行顺序吗，每个模块依次放入数组里，moduleId（模块 id ） 就是对应数组的下标。

### 模块模块

展开第一个模块内容对比下源代码：

```js
import createHeading from './heading.js'

const heading = createHeading()

document.body.append(heading)
```

```js
(function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

    const heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])()

    document.body.append(heading)
})
```

```diff
+ (function(module, __webpack_exports__, __webpack_require__) {
+     "use strict";
+     __webpack_require__.r(__webpack_exports__);
-     import createHeading from './heading.js'
+     /* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ =   __webpack_require__(1);
  
-     const heading = createHeading()
+     const heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])()

      document.body.append(heading)
+ })
```

#### 第一行

函数接收 module、`__webpack_exports__`、`__webpack_require__`，module 可以获取到模块信息和向外暴露的方法，`__webpack_exports__`、`__webpack_require__` 就相当于 CommonJS 里的 exports 和 require。

#### 第二行

打包后的代码都会开启严格模式

#### 第三行

`__webpack_require__.r` 方法可以看看源码：

```js
__webpack_require__.r = function(exports) {
    if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
}
```

这方法的作用只是做个标记，告诉 JS 这个方法是一个模块，且采用 ES Module 规范。

#### 第四行

```js
/* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ =  __webpack_require__(1);
```

前面的注释标记这边是 import 进来的，相应在导出的模块里面会找到 `/* harmony default export */` 的代码。

import 代码转成 webpack 实现的一个 require 方法，源码：

```js
function __webpack_require__(moduleId) {
    // 如果模块存在于缓存里就直接读缓存
    if(installedModules[moduleId]) {
        return installedModules[moduleId].exports;
    }
    
    // 创建一个新模块，放入缓存里
    var module = installedModules[moduleId] = {
        i: moduleId,    // 模块 id
        l: false,       // 是否加载完成
        exports: {}     // 导出数据
    };
    
    // 执行函数，参数传入 module 对象和导出导入方法
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    
    // 标记为加载完成
    module.l = true;
    
    // 将导出数据 return 出去
    return module.exports;
}
```

这方法就只是调用了模块，拿到模块导出的数据，调用后将模块缓存起来，并标记为已加载。

这边执行 `__webpack_require__(1)` 也就是执行 moduleId 为 1 的模块，拿到导出的数据，赋值给 `_heading_js__WEBPACK_IMPORTED_MODULE_0__` 。

仔细一看这变量的命令也是很有规律：

```
_文件名__WEBPACK_IMPORTED_MODULE_当前模块id__
```

文件名的点号 . 被转成下划线 _ ，WEBPACK_IMPORTED_MODULE 翻译过来就是 webpack 导入模块，看这名字其实就能得出以下信息：

- 源文件的文件名
- 这是通过模块导入拿到的数据
- 这是在 moduleId 为 0 的模块里面定义的变量

后续的代码跟源代码差不多就不说的。

### 主函数

展开主函数代码：

```js
function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        // ...
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function(exports, name, getter) {
    	// ...
    };
    __webpack_require__.r = function(exports) {
    	// ...
    };
    __webpack_require__.t = function(value, mode) {
    	// ...
    };
    __webpack_require__.n = function(module) {
    	// ...
    };
    __webpack_require__.o = function(object, property) {
        // ...
    };
    __webpack_require__.p = "";
    
    return __webpack_require__(__webpack_require__.s = 0);
}
```

这里只是给 `__webpack_require__` 定义了一些属性和方法，核心方法 `__webpack_require__()` 上面已经讲过了，其他都还用不到。这里唯一做的事情是最后一行：

```js
return __webpack_require__(__webpack_require__.s = 0)
```

执行了 `__webpack_require__` 方法，给 `__webpack_require__.s` 赋值为 0 的同时将 0 传给 `__webpack_require__` 函数。`__webpack_require__.s` 的 `s` 应该是 `start` ，代表入口模块的 id 值。总的来说这边做的事情就是加载第一个模块。

## 资源模块加载

