# ES Module

## 基本特性

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ES Module - 模块的新特性</title>
</head>
<body>
    <!-- 以 ES Module 的标准执行其中的 JS 代码 -->
    <script type="module">
        console.log('this is es module')
    </script>

    <!-- 不支持 ES Module 的情况下执行  -->
    <script nomodule>
        console.log('Your browser does not support ES Modules’)
    </script>
</body>
</html>
```

这是原生 ES6 的写法，存在以下几种特性：

1. ESM自动采用严格模式，忽略'use strict'

```html
<script type="module">
    console.log(this)   // undefined
</script>
```

2. 每个 ES Module 都是运行在单独的私有作用域中

```html
<script type="module">
    var foo = 100
    console.log(foo) // 100
</script>
<script type="module">
    console.log(foo) // Uncaught ReferenceError: foo is not defined
</script>
```


3. ESM 是通过 CORS 的方式请求外部 JS 模块

```html
<script type= "module" src= "https://unpkg.com/jquery@3.4.1/dist/jquery.min.js"></script>
```

4. ESM 的 script 标签会延迟执行脚本

```html
<script type="module" src="features.demo.js"></script>
<p>需要显示的内容</p>
```

```js
// features.demo.js

alert('alert')
```

会先渲染页面再执行，效果跟使用 defer 一样

```html
<script defer src="features.demo.js"></script>
```

## 导出

```js
// 定义变量、方法、类的同时导出
export var name = 'foo module'
export function hello () {
    console.log('hello')
}
export class Person {}

// 先定义后导出
var name = 'foo module'
function hello () {
    console.log('hello')
}
class Person {}

// 导出指定成员
export { name, hello, Person }

// 导出重命名
export { name as fooName }

// 默认导出成员
export default name
```

## 导入

```js
// 导入指定成员，可以用 as 重命名
import { name, hello as fooHello, Person } from './module.js'

// 导入默认成员，还可以顺带重命名
import fooName from './module.js'

// 同时导出默认成员和指定成员
import fooName, { hello } from './module.js'

// 不需要提取成员
import './module.js'

// 导入所有成员
import * as obj from './module.js'

// 动态导入
import('./module.js').then(function (module) {
    console.log(module)
})
```

## 注意事项

1. 导入导出指定成员问题

```js
export { name, hello, Person }

var obj = { name, hello, Person }
export obj  // error
```

这两种写法很像，其实作用完全不一样。第一种写法不是导出一个对象，而是导出多个成员。而第二种写法其实是会报错。相应的导入也是一个道理。

```js
import { name, hello, Person } from './foo.js' 

import obj from './foo.js'
console.log(obj.name)    // error
```

第一种导入的写法是导入指定成员，而不是解构。第二种导入的其实是默认成员，这边找不到默认成员就报错。

2. 导入导出传递的是引用

```js
var name = 'aa';

// 800 毫秒后改变值
setTimeout(() => {
    name = 'bb'
}, 800)
export { name }
```

```js
import { name } from './module.js'

console.log(name);  // aa

// 1000 毫秒后再次打印值，这时候值也跟着改变了
setTimeout(() => {
    console.log(name);  // bb
}, 1000)
```

3. 导入的值不可改变

```js
import { name } from './module.js'

name = 'bar' // error
```

4. 导入路径写法

```js
import { name } from './module.js'  // './' 开头的是相对路径
import { name } from '/module.js'   // '/' 开头的是绝对路径

// 开头不是 ’./‘ 也不是 '/' 的会到 node_modules 查找模块
import { name } from 'module.js' 

// 使用网络地址
import { name } from 'http://localhost:3000/module.js'

// 在原生 ES Module 里要文件名称要写完整，不然找不到
import { name } from './module' // error
import { name } from './module/' // error
```

## 导出导入

```js
// 导入的同时导出成员
export { name } from './module.js'

// 导出导入默认成员
export { default } from './module.js'

// 将所有导入成员导出，也就是模块继承
export * from './module.js'
```

## NodeJS 中使用

### 如何使用

NodeJS 正常遵循的是 CommonJS 规范，在 8.5 版本之后开始支持 ES Module 规范，不过需要做一些调整。

我们先来看下不做调整的时候是怎样的，这边尝试导入内置对象 fs ：

```js
import fs from 'fs'
```

结果会报 ERR_REQUIRE_ESM 错误。想要支持 ES Module 需要做两步操作：

1. 文件后缀名改成 `.mjs`
2. 运行命令行里加一个属性 `--experimental-modules`

例如：

```sh
$ node --experimental-modules foo.mjs
```

这样就能支持了。

在 NodeJS 12.10 版本之后又做了进一步支持，文件后缀名不需要改了，只要在项目根目录加上一个 package.json 配置文件：

```json
{
    "type": "module"
}
```

运行命令行还是一样要加那个属性，例如

```sh
$ node --experimental-modules foo.js
```

不过这时候你想改成 CommonJS 规范的话，就会报错，这时候想要两种同时支持的话，就要将遵守 CommonJS 规范的文件后缀名改成 `.cjs` 。

### 与 CommonJS 结合

- ES Module 中可以导入 CommonJS 模块
- CommonJS 中不能导入 ES Module 模块
- CommonJS 始终只会导出一个默认成员

### 与 CommonJS 差异

导出

```js
// CommonJS
exports.name = 'foo'
module.exports = 'bar'

// ES Module
export const name = 'foo'
export default 'bar'
```

导入

```js
// CommonJS
const obj = require('./module.js')

// ES Module
import obj from './module.js'
```

当前文件的绝对路径

```js
// CommonJS
__filename

// ES Module
const __filename = fileURLToPath(import.meta.url)
```

当前文件所在目录

```js
// CommonJS
__dirname

// ES Module
const __dirname = dirname(__filename)
```