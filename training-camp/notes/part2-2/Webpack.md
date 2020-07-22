# Webpack

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
$ yarn init --yes
```

### 2. 安装 webpack

```sh
$ yarn add webpack webpack-cli --dev
```

### 3. 运行 webpack

```sh
$ yarn webpack
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

1. **第一行**

函数接收 module、`__webpack_exports__`、`__webpack_require__`，module 可以获取到模块信息和向外暴露的方法，`__webpack_exports__`、`__webpack_require__` 就相当于 CommonJS 里的 exports 和 require。

2. **第二行**

打包后的代码都会开启严格模式

3. **第三行**

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

4. **第四行**

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

webpack 默认只能识别 JS 和 JSON 文件，对于资源文件（比如 css，png ）是无法识别的，例如我们这边加入一个 css 文件：

```diff
  ├─ src/
  │   ├─ heading
+ │   ├─ main.css
  │   └─ main.js
  ├─ index.html
  ├─ package.json
  └─ webpack.config.js
```

main.css

```css
body {
    margin: 0 auto;
    padding: 0 20px;
    max-width: 800px;
    background: #f4f8fb;
}
```

然后在 main.js 引入：

```diff
  import createHeading from './heading.js'
+ import './main.css'
  
  const heading = createHeading()
  
  document.body.append(heading)
```

这时候再打包会发现报错了，报了模块解析失败的错误。

针对于非 JS 和 JSON 文件都需要设置加载器，webpack.config.js 应该改成这样：

```diff
const path = require('path')

module.exports = {
    entry: './src/main.js',
    mode: 'none',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
-   }
+   },
+   module: {
+       rules: [
+           {
+               test: /\.css$/,
+               use: [
+                   'style-loader',
+                   'css-loader'
+               ]
+           }
+       ]
+   }
}
```

module 放模块相关配置，rules 专门用来配置加载器，在里面设置文件解析规则，每一项就是一个规则。

test 传入正则表达式匹配文件名，这边写 `/\.css$/` 就代表匹配所有 .css 结尾的文件，匹配到的文件使用 use 指定的加载器去解析文件。

use 单个加载器传入字符串，多个加载器传入字符串数组，每个元素代表一个加载器.

**注意：use 的加载顺序是从后往前执行**

这边用到了两个加载器，需要安装下依赖：

```sh
$ yarn add -D style-loader css-loader
```

每个加载器的职责单一，css-loader 是用来解析 css 文件，将文件内容转化为字符串。style-loader 是将这些 css 字符串添加到页面的 style 标签里面，从而完成 css 的引入。这时候再去打包就能正常打包进去了。

## 文件资源加载器

文件资源比如图片、字体，关于文件资源用到的加载器是 file-loader

```sh
$ yarn add -D file-loader
```

配置规则，这边以 png 文件为例：

```js
{
    test: /\.png$/,
    use: 'file-loader'
}
```

这时候在代码里加载图片：

main.js

```diff
  import createHeading from './heading.js'
  import './main.css'
+ import icon from './demo.png'
  
  const heading = createHeading()
  
  document.body.append(heading)
 
+ const img = new Image()
+ 
+ img.src = icon
+ document.body.append(img);
```

然后去打包文件查看效果。这时候你会发现在页面上找不到图片，但实际图片是有生成到 dist 目录下的。查看图片的访问路径你会发现，其实是路径错了，图片是生成到 dist 目录下的，但是访问路径却是在项目根目录下查找。想要查看路径的生成方式，可以查看生成的代码：

```js
(function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "a82ccc877770d169d05ea0bf93263446.png");
})
```

图片路径是将 `__webpack_require__.p` 的值与生成的文件名做拼接，这边 `__webpack_require__.p` 的值并没有设置，默认是空字符串，所以最终生成的图片路径是 `'a82ccc877770d169d05ea0bf93263446.png'` 而我们页面是在项目根目录打开的，也就会在项目根目录去找这张图片。想要解决这问题就是去设置 `__webpack_require__.p` 的值，这个值是在出口配置那边设置：

```diff
module.exports = {
    ...
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
+       publicPath: 'dist/'
    },
    ...
}
```

在 output 里配置 publicPath，注意这边的斜杆不能省略。这样再去重新打包就能成功显示图片了。

## URL 加载器

文件资源除了可以以物理文件的形式存在，还可以以 Data URLs 的形式存在。Data URLs 是一种特殊的 URL 协议，它可以用来直接表示一个文件，传统 URL 要求在服务器上有对应的文件，通过访问这个 URL 去读取到对应的文件。而 Data URLs 是当前 URL 就能表示全部文件内容的方式，它遵守着以下的格式：

![](https://jencia.github.io/images/blog/training-camp/notes/Webpack-1.png)

例如：

```js
data:text/html;charset=UTF-8,<h1>html content</h1>
```

浏览器能够将这样一串内容为一个 html 内容，编码采用 UTF-8，内容为 `<h1>html content</h1>`。

如果是图片或者字体，这种无法通过文本去表示的二进制文件，可以通过对其内容进行 base64 编码，以编码后的结果（也就是一串字符串）来表示文件内容，例如：

```js
data:image/png;base64,iVBORw0KGgoAAAANSUhE...SuQmCC
```

在 webpack 打包资源模块时同样可以采用这种方式实现，通过 Data URLs 就可以以代码的形式表示任何类型的文件，具体做法是使用 url-loader 加载器，将之前的 file-loader 改成 url-loader：

```sh
$ yarn add -D url-loader
```

```diff
{
    test: /\.png$/,
-   use: 'file-loader'
+   use: 'url-loader'
}
```

这时候再去打包就不会生成图片文件，也能正常显示图片。这种方式就适合打包项目中体积比较小的文件，最佳实践就是：

- 小文件使用 Data URLs，减少请求次数
- 大文件单独提取存放，提高加载速度

url-loader 支持通过配置来实现上述的最佳实践，配置就要改成这样：

```diff
{
    test: /\.png$/,
-   use: 'url-loader'
+   use: {
+       loader: 'url-loader',
+       options: {
+           limit: 10 * 1024
+       }
+   }
}
```

加载器需要传递参数的时候 use 的值就要改成对象的形式，加载器放在 loader 里，而参数放在 options 里。limit 设置 `10 * 1024` 代表 10KB ，也就是说文件小于 10KB 采用 Data URLs 打包，超过 10KB 就采用 file-loader 的方式打包。

**注意：使用 url-loader 的同时也要去安装 file-loader** ，超过 10KB 的时候 url-loader 内部会调用 file-loader。

## ES6 编译

webpack 默认不会去编译 ES6 代码，打开上一节打包后的代码：

```js
(function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */ __webpack_exports__["default"] = (() => {
        const element = document.createElement('h2')

        element.textContent = 'Hello world'
        element.addEventListener('click', () => {
            alert('hello webpack')
        })

        return element
    });
}),
```

打包后的代码还是能看到 const 和箭头函数，如果想要编译 ES6 代码需要配置编译加载器，常用的有 babel-loader。使用 babel-loader 还需要安装 babel 核心模块和 babel 插件：

```sh
$ yarn add -D babel-loader @babel/core @babel/preset-env
```

```js
{
    test: /\.js$/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env']
        }
    }
}
```

注意：这边要配置 presets ，否则不会去编译。配完之后再去打包：

```js
(function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */ __webpack_exports__["default"] = (function () {
        var element = document.createElement('h2');
        element.textContent = 'Hello world';
        element.addEventListener('click', function () {
            alert('hello webpack');
        });
        return element;
    });
})
```

这时候 es6 代码已经成功编译了。

通常 babel 的配置不会放在 loader 里面配置，而是在项目根目录下创建 .babelrc 文件专门用来配置 babel：

```json
{
    "presets": ["@babel/preset-env"]
}
```

这时候 loader 就不需要传参数了，就可以改成这样了：

```js
{
    test: /\.js$/,
    use: 'babel-loader'
}
```

这时候再去打包也能达到同样的效果。

## 加载资源的方式

webpack 加载模块不仅能用 import 加载，还能支持 require 。webpack 同时支持 ES Module、CommonJS、AMD 多种模块标准。

```js
// ES Module
import createHeading from './heading.js'
import './main.css'
import icon from './demo.png'

// CommonJS
const createHeading = require('./heading.js').default   // 引入 JS 模块要取 default 值
const icon = require('./demo.png')
require('./main.css')

// AMD
require(['./heading.js', './demo.png', './main.css'], (createHeading, icon) => {
    // ...
})
```

虽然都能支持，但建议统一用同一种，这样更易于维护。

除了这些 JS 加载器外，还有一些其他独立的加载器，例如：

1. 样式代码中的 @import 指令和 url 函数

```css
@import url(reset.css)

body {
    min-height: 100vh;
    background: #f4f8fb;
    background-image: url(background.png);
    background-size: cover;
}
```

这边的加载了 reset.css 和 background.png ，这两个文件就会参与 webpack 打包，最后替换成打包后的路径。

2. html 的 scr 属性

```html
<!-- footer.html -->
<footer>
    <img src="./demo.png">
</footer>
```

```js
import footer from './footer.html'

const div = document.createElement('div');
div.innerHTML = footer;
document.body.append(div);
```

img 的 src 引用了 `./demo.png` ，这个文件也就会参与打包，最后替换为打包后的路径。

这段代码还不能运行，这边引入了 html 文件，需要配置 html 的加载器：

```sh
$ yarn add -D html-loader
```

```js
{
    test: /\.html$/,
    use: 'html-loader'
}
```

以上是能够参与 webpack 打包的模块加载方式。当然也有些情况不会打包，比如 a 标签的 href 属性就不会。如果我把 footer.html 改成 a 标签的形式：

```html
<footer>
    <a href="./demo.png">demo.png</a>
</footer>
```

这里的 './demo.png' 就不会被 webpack 打包。打包后打开页面，这时候点击 a 标签会找不到图片。如果想要能支持 a 标签的 href 属性，可以在加载器上改配置：

```js
{
    test: /\.html$/,
    use: {
        loader: 'html-loader',
        options: {
            attributes: {
                list: [
                    {
                        tag: 'img',
                        attribute: 'src',
                        type: 'src'
                    },
                    {
                        tag: 'a',           // 标签名
                        attribute: 'href',  // 属性名
                        type: 'src'
                    }
                ]
            }
        }
    }
}
```

默认能支持 img 标签的 src 属性，但如果配置了 attributes 属性就代表不使用默认配置，所以也要把 img 配上去。这样就是能支持 img 的 src 属性和 a 标签的 href 属性，没有配的就不会参与资源打包。

## 核心工作原理

在项目开发中都会各自各样的文件散落各处

![](https://jencia.github.io/images/blog/training-camp/notes/Webpack-2.png)

webpack 工作的时候会根据配置选择一个文件作为打包入口，这个文件一般是 javascript 文件。

![](https://jencia.github.io/images/blog/training-camp/notes/Webpack-3.png)

然后顺着入口文件的代码往下走，检测文件代码有用到 import 或者 其他资源加载代码 （上一节讲到的加载资源方式），就会解析推断出文件所依赖的资源模块，然后分别解析每一个模块对应的依赖，最后就形成了整个项目模块所有用到的文件之间依赖关系的依赖树。

![](https://jencia.github.io/images/blog/training-camp/notes/Webpack-4.png)

生成依赖树之后，webpack 会遍历整个依赖树，找到每个节点对应的资源文件。然后根据配置文件中的 rules 属性找到每个模块的加载器，然后交给加载器去加载每个模块，最后再将这些加载到的结果放入到 bundle.js 也就是打包文件。

![](https://jencia.github.io/images/blog/training-camp/notes/Webpack-5.png)

从而完成整个项目的打包工作。

## 开发一个 Loader

前面的讲解用到了大量的 Loader ，Loader 作为 Webpack 的核心机制，为我们做了很多事情。那么 Loader 到底是怎么工作的呢？下列通过开发一个自己的 Loader 来了解 Loader 的工作原理。

我们这个 Loader 的需求是加载 md 文件，取名叫 markdown-loader 。Loader 其实就是一个纯函数，一个输入一个输出，简单处理就是这样：

```js
module.exports = source => {
    return source
}
```

接收的参数为源文件内容，经过一系列处理后输出出来。不过就这样去使用会报错的，Loader 还有一个规则。

![](https://jencia.github.io/images/blog/training-camp/notes/Webpack-6.png)

Loader 的加载就类似一个管道一样，从源文件到输出结果，中间可以加载多个 Loader 。每个 Loader 的输入都是前一个 Loader 的输出，也就是每个 Loader 接收到的参数都是前一个 Loader 的返回值。第一个 Loader 收到的是源代码，最后一个输出的是最终的结果代码。而结果代码一定是要 JS 能够识别的内容。

上述代码中如果读取的是 md 文件，那 source 的值 md 的代码，在 JS 中无法识别，直接作为返回值输出会报错，你可以这样改：

```js
module.exports = source => {
    return JSON.stringify(source)
}
```

这样输出的就是一串字符串了，这样就能被 JS 识别，这就是一个最基本的 Loader，就可以拿来使用了：

webpack.config.js

```js
module.exports = {
    mode: 'none',
    module: {
        rules: [
            {
                test: /\.md$/,
                use: './markdown-loader'
            }
        ]
    }
}
```

这边 Loader 的使用加了 `./` 是因为 markdown-loader.js 是写在本地的，use 使用 Loader 就跟 require 一样，类似 `require('./markdown-loader')` 的操作。这样配好 webpack 配置就可以去测试功能了，由于这边没有配 entry ，所以入口文件是默认的，我们这里建一个 `src/index.js` 文件。

```js
import md from './test.md'

console.log(md)
```

`src/test.md`

```md
# 标题1

段落

- 列表
```

最终 `src/test.md` 文件打包出来的结果是这样：

```js
/* 1 */
/***/ (function(module, exports) {

"# 标题\n\n段落\n\n- 列表"

/***/ })
```

成功将 md 的内容转成字符串输出出来，但仔细观察会发现，这文件就只是一串字符串，并没有将内容导出，这样外界无法拿到这里的内容。所以我们的 Loader 还需要做个调整：

```js
module.exports = source => {
    return `export default ${JSON.stringify(source)}`
}
```

改完后再去打包：

```js
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("# 标题\n\n段落\n\n- 列表");

/***/ })
```

现在的结果才是对的，到这里，一个最基本的 Loader 就算完成了。不过现在这个 Loader 只是做了将源码输出，没有任何功能，接下来就要给 Loader 赋予功能了。

这边可以借助第三方库去解析 md 内容，这边推荐用 marked。

```sh
$ yarn add -D marked
```

```js
const marked = require('marked');

module.exports = source => {
    const html = marked(source)
    
    return `export default ${JSON.stringify(html)}`
}
```

这时候再去打包：

```js
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<h1 id=\"标题\">标题</h1>\n<p>段落</p>\n<ul>\n<li>列表</li>\n</ul>\n");

/***/ })
```

可以看到 md 内容已经成功转化为 html 代码了，解析 md 文件其实就是把内容转为 html 代码，到这里我们的 markdown-loader 就算大功告成了。

以上演示的是独立一个 Loader 就完成了功能的用法，我们也可以结合其他 Loader 一起使用。既然解析 md 最终是生成 html 代码，那我们就可以把这些 html 代码交给 html-loader 处理。这时候 html-loader 就是管道的最后一层了，我们的 markdown-loader 就不需要转成字符串了，就可以这样改：

```sh
$ yarn add -D html-loader
```

markdown-loader.js

```diff
const marked = require('marked');

module.exports = source => {
    const html = marked(source)
    
-   return `export default ${JSON.stringify(html)}`
+   return html
}
```

webpack.config.js

```diff
module.exports = {
    mode: 'none',
    module: {
        rules: [
            {
                test: /\.md$/,
-               use: './markdown-loader'
+               use: ['html-loader', './markdown-loader']
            }
        ]
    }
}
```

这样也能达到同样的效果。注意 use 的加载顺序是从后往前执行，最先执行的应该让最后面。

## 插件机制

插件机制是 Webpack 的另外一个核心机制，目的是为了增加 Webpack 自动化能力。Loader 专注于实现资源模块加载，Plugin 解决除了资源加载以外的自动化工作。比如：

- 清理 dist 目录
- 拷贝静态文件至输出目录
- 压缩输出代码
- etc.

### clean-webpack-plugin

自动清除 dist 目录

```sh
$ yarn add -D clean-webpack-plugin
```

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    // ...
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```

### html-webpack-plugin

自动生成 HTML

```sh
$ yarn add -D html-webpack-plugin
```

- 基本使用

```js
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    // ...
    plugins: [
        new HTMLWebpackPlugin()
    ]
}
```

- 设置标题和 meta

```js
new HTMLWebpackPlugin({
    title: '标题',
    meta: {
        viewport: 'width=device-width'
    }
})
```

- 使用模板文件

`src/index.html`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Webpack</title>
</head>
<body>
    <div class="container">
        <h1><%= htmlWebpackPlugin.options.title %></h1>
    </div>
</body>
</html>
```

```js
new HTMLWebpackPlugin({
    title: '标题',
    meta: {
        viewport: 'width=device-width'
    },
    template: './src/index.html'
})
```

- 输出多个 html 文件

```js
module.exports = {
    // ...
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'page1.html'
        }),
        new HTMLWebpackPlugin({
            filename: 'page2.html'
        }),
        new HTMLWebpackPlugin({
            filename: 'page3.html'
        })
    ]
}
```

### copy-webpack-plugin

拷贝目录文件

```sh
$ yarn add -D copy-webpack-plugin
```

> copy-webpack-plugin 版本号 6.0.3

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    // ...
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public' }
            ]
        })
    ]
```

将 public 目录下所有文件拷贝到 dist 目录。

## 开发一个插件

相比于 Loader，Plugin 拥有更宽的能力范围。Loader 只有在加载模块的时候工作，而 Plugin 触及到 Webpack 工作的每一个环节。

Plugin 通过钩子机制实现，Webpack 给每个工作环节都埋下了钩子，Plugin 通过在钩子上挂载各种各样的任务来扩展 Webpack 的能力。具体有哪些钩子可以查看 [官网的 Compiler Hooks](https://webpack.js.org/api/compiler-hooks/) 。

Webpack 要求我们插件一定要是一个函数或者是一个包含 apply 方法的对象，一般我们都是定义一个类，然后在类上定义一个 apply 方法。

```js
class MyPlugin {
    apply (compiler) {
        console.log('MyPlugin 启动')
    }
}
```

apply 接收一个参数 compiler，compiler 包含此次构建的所有配置信息。这边简单的做一个功能：

1. 先明确需求，我们要把生成的 bundle.js 文件里面的所有注释信息去掉；
2. 查找官网文档查找有没有合适的钩子，经过查阅找到了 emit 钩子，这钩子是在即将输出文件时执行，很适合我们的需求
3. 注册钩子
  
    ```js
    class MyPlugin {
        apply (compiler) {
            // compiler.hooks.emit 是对应的钩子
            // .tap 是在这个钩子上挂载任务
            // 第一个参数是插件名称，第二个是执行函数
            compiler.hooks.emit.tap('MyPlugin', compilation => {
                // ccompilation 是此次打包的上下文
            })
        }
    }
    ```
4. 重写文件内容

    ```js
    class MyPlugin {
        apply (compiler) {
            compiler.hooks.emit.tap('MyPlugin', compilation => {
                // compilation.assets 是所有导出的文件数据
                for (const name in compilation.assets) {

                    // name 是文件名，匹配 .js 后缀的文件，指处理 js 文件
                    if (/\.js$/.test(name)) {
                        // .source() 是获取文件内容
                        const content = compilation.assets[name].source();
                        // 去除文件内容里注释部分
                        const result = content.replace(/\/\*\*+\*\//g, '')

                        // 覆盖原来的值，要自己实现 source 和 size 方法
                        compilation.assets[name] = {
                            source: () => result,
                            size: () => result.length
                        }
                    }
                }
            })
        }
    }
    ```

5. 插件使用

    ```js
    module.exports = {
        // ...
        plugins: [
            new MyPlugin()
        ]
    }
    ```

## Webpack Dev Server

提供用于开发的 HTTP Server ，集成「自动编译」和「自动刷新浏览器」等功能。

### 基本使用

安装

```sh
$ yarn add -D webpack-dev-server
```

使用的方式很简单，之前 Webpack 打包是使用 webpack 命令，现在只要换成 webpack-dev-server 就好，比如：

```sh
$ yarn webpack-dev-server
```

执行效果跟执行 webpack 一样，只不过执行完不会停止运行，会继续监听代码变化。这时候可以在浏览器访问页面，默认地址是 `http://localhost:8080/` 。

这时候可以尝试去改变源代码，保存后你会发现 webpack 自动重新打包了，而且浏览器自动刷新了。需要注意的是这边打包的结果不会输出文件，而是存在内存里，访问页面读取的是内存中的数据。

webpack-dev-server 可以传入参数让它启动时自动打开页面：

```sh
$ yarn webpack-dev-server --open
```

### 静态资源访问

webpack-dev-server 默认只能识别到打包后的文件，有些文件我们是不需要编译打包的，对于这些文件之前的做法是用 copy-webpack-plugin 将这些插件拷贝到打包目录里。这样的做法是可以让 webpack-dev-server 识别到，只是这种方式更适合在生产环境进行。因为在开发环境中代码会频繁的修改，webpack-dev-server 每次修改文件时都会去打包一次，也就是每次 copy-webpack-plugin 都要去拷贝一遍，要是文件大的话编译速度就会受影响。对于这种情况 webpack-dev-server 有了一个解决方案，就是对于这类文件就直接读取源文件就好，只要配置 contentBase 就能让这些文件可读。

webpack 有对 webpack-dev-server 专门开设了一个配置项：

```js
module.exports = {
    // ...
    devServer: {
        contentBase: './public'
    },
    // ...
}
```

这样开启 webpack-dev-server 后就能读得到 public 目录和里面的文件

### 代理 API

使用 webpack-dev-server 提供的 HTTP Server ，在调后端接口的时候就会存在跨域的问题。问了解决这问题 webpack-dev-server 提供了一个代理 API 。


```js
module.exports = {
    // ...
    devServer: {
        contentBase: './public',
        proxy: {
            // 匹配 /api 开头的路径就会走这条代理
            '/api': {
                // 将 http://localhost:8080/api/users 转化为 http://api.github.com/api/users
                target: 'http://api.github.com',
                // 路径覆盖，将 '^/api' 替换为 ''
                // 将 http://api.github.com/api/users 转为 http://api.github.com/users
                pathRewrite: {
                    '^/api': ''
                },
                // 使用代理的主机名去请求接口
                changeOrigin: true
            }
        }
    },
    // ...
}
```

## Source Map

我们开发项目的时候经常需要用到 ES6 语法，ES6 语法想要让浏览器识别就需要 babel 编译，实际在浏览器上运行的其实是编译后的代码，这就导致运行的代码跟开发的代码不一致。这会存在什么问题呢？一旦代码出错的时候无法准确定位到错误代码，就导致无法快速的找到问题代码。而 Source Map 就是为了解决这类问题，顾名思义，这是源代码地图，就是记录着生成后的代码和源代码的映射关系。也就是通过 Source Map 可以将生成后的代码逆向的转化为源代码。

Source Map 是一个 .map 后缀的文件，使用是在文件末尾加载一段注释指定 map 文件路径：

```js
// ...
//# sourceMappingURL=myfile.map
```

这写法除了指定 map 文件，还可以指定 JS 文件：

```js
//# sourceURL=index.js
```

只不过这种在代码报错的时候只会提示哪个文件错误，不能定位到具体代码，显示的代码还是打包后的代码。

在 Webpack 中使用 Source Map 只要配置 devtool 就好：

```js
module.exports = {
    // ...
    devtool: 'source-map'
}
```

这时候去打包就会生成 map 文件。webpack提供了很多选项，以下将对这些选项详细讲解。

devtool 拥有的选项对比：

| devtool                        | build   | rebuild | production | quality                        |
| ------------------------------ | ------- | ------- | ---------- | ------------------------------ |
| （none）                       | fastest | fastest | yes        | bundled code                   |
| eval                           | fastest | fastest | no         | generated code                 |
| eval-source-map               | lowest  | fast    | no         | original source |
| cheap-eval-source-map          | fast    | faster  | no         | transformed code（lines only） |
| cheap-module-eval-source-map   | slow    | faster  | no         | original source（lines only）  |
| source-map                     | slowest | slowest | yes        | original source                |
| cheap-source-map               | fast    | slow    | yes        | transformed code（line only）  |
| cheap-module-source-map        | slow    | slower  | yes        | original source（line Only）   |
| inline-cheap-source-map        | fast    | slow    | no         | transformed code（line only）  |
| inline-cheap-module-source-map | slow    | slowest | no         | original source（lines only）  |
| inline-source-map             | lowest  | slowest | no         | original source                |
| hidden-source-map              | slowest | slowest | yes        | original source                |
| nosources-source-map           | slowest | slowest | yes        | without source content         |

- `generated code`  没有 map 文件，只生成代码，只能定位错误文件，没有代码信息
- `original source` 源代码，有行列信息
- `transformed code（lines only）` 转化后的代码，只能行信息
- `original source（lines only）` 源代码，只有行信息
- `without source content` 没有源码内容，但能定位错误文件和行列信息

名字里还蕴含的一些含义：

- 带 evel 的都是采用 evel 函数包起来的；
- 带 source-map 的都能定位代码信息，有的有行列信息、有的只有行信息；
- 带 cheap 的都是只有行信息的
- 带 module 的都能看到源码信息的
- 带 inline 的都是将 Source Map 转成 base64 放在代码里的

两个特殊的：

- hidden-source-map：有生成源码信息的 source map 文件，但代码里面没引用
- nosource-source-map：能定位错误文件，能知道代码行列信息，但是看不到源代码

Source 如何选择呢？

- 开发环境推荐选择 cheap-module-eval-source-map
  - 每行代码不会写得太长，能定位到行信息就已经够了
  - 代码经过转化后差异较大，需要保留源代码
  - 首次打包速度慢无所谓，重新打包相对较快
- 生成环境推荐选择 none
  - Source Map 会暴露源代码
  - 调式是开发阶段的事情

## HMR

之前我们讲到了使用 webpack-dev-server 可以帮我们自动编译和自动刷新页面，这能极大程度的增加我们的开发效率。不过仅仅是这样还不够，当我们在开发表单页面的时候，我们需要输入一些文本看效果。输入完之后我们觉得还不满意，改了代码后保存，这时候页面刷新了，我们之前填的文本都不见了。为了解决这情况，Webpack 提供了 HMR 热更新，它能做到局部刷新，在不刷新页面的情况下更新最新保存的内容。

HMR 的使用需要三个步骤：

1. 配置 devServer

   ```js
   module.exports = {
     // ...
     devServer: {
       hot: true
     },
     // ...
   }
   ```

2. 加入热更新插件

   ```js
   const webpack = require('webpack')
   
   module.exports = {
     // ...
     plugins: [
       new webpack.HotModuleReplacementPlugin()
     ]
   }
   ```

3. 编写热更新逻辑

   ```js
   if (module.hot) {
     // module.hot.accept() // 接受自身更新
     module.hot.accept('./deps_file.js', () => {
       // deps_file.js 更新完的处理函数
     })
   }
   ```

   如果使用的第三方库，第三方库有处理，我们就需不需要再处理，比如 css-loader 。

注意：

1. module.hot.accept 逻辑写得有问题的话就会自动改成浏览器自动刷新功能，这样就会导致我们无法定位问题。解决这问题就是将 hot 配置改成 hotOnly，这样就不会自动刷新页面了。
2. 没有配置 HMR 的话 module.hot 是找不到的，要注意先判断是否存在再使用。

## 不同环境的配置

### 内置写法

```js
const webpack = require('webpack')

module.exports = (env, argv) => {
  const config = {
    // ...
  }
  
  config.mode = env
  
  if (env === 'development') {
    config.devtool = 'cheap-module-eval-source-map'
    config.devServer = {
      hot: true
    }
    config.plugins = [
      ...config.plugins,
      new webpack.HotModuleReplacementPlugin()
    ]
  }
  if (env === 'production') {
    config.plugins = [
      ...config.plugins,
      new cleanWebpackPlgin()
    ]
  }
  return config
}
```

打包命令

```sh
# 开发环境
$ yarn webpack-dev-server --env development
# 生产环境
$ yarn webpack --env production
```



### webpack-merge

```sh
$ yarn add -D webpack-merge
```

Webpack.common.js

```js
module.exports = {
  entry: {
    // ...
  },
  output: {
    // ...
  }
  module: {
    rules: [
      // ...
    ]
  }
}
```

webpack.prod.js

```js
const common = require('./webpack.common')
const merge = require('webpack-merge')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    // ...
  ]
})
```

webpack.dev.js

```js
const common = require('./webpack.common')
const webpack = require('webpack')
const merge = require('webpack-merge')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map'
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
```

打包命令：

```sh
# 开发环境
$ yarn webpack-dev-server --config webpack.dev.js
# 生产环境
$ yarn webpack --config webpack.prod.js
```

## DefinePlugin

DefinePlugin 是 Webpack 内置的插件，用于向代码注入全局成员，也就是声明一个全局变量，默认注入了 process.env.NODE_ENV ，我可以直接在代码里面是要这个值：

```js
console.log(process.env.NODE_ENV)  // 'development'
```

值为 webpack 里配的 mode 。也可以在 html 里面使用：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>webpack</title>
  </head>
  <body>
    <p><%= process.env.NODE_ENV ></p>
  </body>
</html>
```

如果想注入其他变量，可以这样配：

```js
const webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      BASE_URL: JSON.stringify('http://localhost:8080/api')
    })
  ]    
}
```

这边定义了 BASE_URL 变量，值为 `'http://localhost:8080/api'` ，注意：这边的变量会以字符串替换的方式，实际使用会把 `BASE_URL` 替换成 ` http://localhost:8080/api` ，外面的引号会没掉，所以最好是使用 JSON.stringify 转化下。













