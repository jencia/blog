# Rollup

Rollup 与 Webpack 很类似，只不过 Rollup 更加专注于打包 JS 文件， 是一款小巧的 ESM 打包器，充分利用了 ESM 各项特性的高效打包器。具体的优势可通过以下学习的过程中体现。

## 快速上手

### 初始化项目

为了方便后续代码测试，这边提供了基础代码

```
rollup-demo
├─ src/
│   ├─ index.js
│   ├─ logger.js
│   └─ messages.js
└─ package.json
```

package.json 由 `yarn init --yes` 生成。

index.js

```js
import { log } from './logger'
import messages from './messages'

const msg = messages.hi

log(msg)
```

logger.js

```js
export const log = msg => {
    console.log('----------- INFO -----------')
    console.log(msg)
    console.log('----------------------------')
}

export const error = msg => {
    console.log('----------- ERROR -----------')
    console.log(msg)
    console.log('----------------------------')
}
```

message.js

```js
export default {
    hi: 'Hey Guys, I am yjc~'
}
```

### 安装

```sh
yarn add -D rollup
```

### 使用

> rollup 版本 2.22.0

```sh
yarn rollup src/index.js
```

执行命令行时需要指定入口文件，默认执行结果不会输出到文件里，而是打印到控制台，想输出到文件里可传入参数。

```sh
yarn rollup src/index.js --file dist/bundle.js
```

这时候执行后就能看到 dist/bundle.js 文件，打开文件：

```js
const log = msg => {
    console.log('----------- INFO -----------');
    console.log(msg);
    console.log('----------------------------');
};

var messages = {
    hi: 'Hey Guys, I am yjc~'
};

const msg = messages.hi;

log(msg);
```

生成的代码惊人的简洁，没有任何额外的代码和注释，这里就能很明显的看出跟 webpack 的区别，代码可读性明显好很多。

从生成的代码可以看出，logger.js 文件有两个函数，这边只输出一个函数，也就是说没有使用到的函数不会输出。所以说 rollup 也支持 Tree Shaking ，默认开启。

### 配置文件

在项目根目录下创建 rollup.config.js

```js
export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js'
    }
}
```

rollup 也是运行在 NodeJS 环境的，但是配置文件会经过特殊处理，让我们能够只是使用 ES Module 规范。配置文件需要将对象作为默认成员导出，input 作为入口的输入文件，output 作为输出配置，file 指定具体文件路径。

```sh
yarn rollup --config
```

rollup 执行命令的时候传 --config 表示要使用配置文件，默认会去引用 rollup.config.js 文件。如果你的配置文件名称不叫这个可以指定配置文件：

```sh
yarn rollup --config xx.js
```

rollup 默认打包会以 ES Module 的格式打包，这种文件在浏览器上运行会有兼容性问题，通常在浏览器运行的代码都是采用 IIFE（自执行函数）格式，对应的配置：

```diff
export default {
    input: 'src/index.js',
    output: {
+       format: 'iife',
        file: 'dist/bundle.js'
    }
}
```

这样生成的代码会包在一个 IIFE 函数里，开启严格模式，也就是如下代码：

```js
(function () {
    'use strict';

    // ...
})();
```

### 使用插件

rollup 跟 webpack 一样同样拥有插件机制，rollup 本身的功能就只是合并各个 js 文件。如果想要加载其他资源文件，或是转化 ES6+ 新特性的话，就只能通过插件的方式提供支持。

rollup 默认只支持 js 文件的加载，如果我们要加载其他文件，比如 JSON 文件就需要使用插件，这边就以 JSON 为例。

```sh
yarn add -D rollup-plugin-json
```

```diff
+ import json from 'rollup-plugin-json'

  export default {
      input: 'src/index.js',
      output: {
          format: 'iife',
          file: 'dist/bundle.js'
      },
+     plugins: [
+         json(),
+     ]
  }
```

插件配置都放在 plugins 里面，以数组的形式加载多个插件。注意这边是传入 json() 函数执行结果。这样我们就可以加载 JSON 文件了，这边就对 `src/index.js` 文件做调整：

```diff
  import { log } from './logger'
  import messages from './messages'
+ import { name, version } from '../package.json'
  
  const msg = messages.hi
  
  log(msg)
  
+ log(name)
+ log(version)
```

重新打包后再看看生成的代码：

```diff
(function () {
    'use strict';

    const log = msg => {
        console.log('----------- INFO -----------');
        console.log(msg);
        console.log('----------------------------');
    };

    var messages = {
        hi: 'Hey Guys, I am yjc~'
    };

+   var name = "rollup-demo";
+   var version = "1.0.0";

    const msg = messages.hi;

    log(msg);

+   log(name);
+   log(version);

}());
```

可以看出打包后是代码也对 JSON 文件做了 Tree Shaking 处理，不会把 JSON 的对象整个导出，而是提取需要的代码重新定义变量存放。

## 加载 NPM 模块

rollup 在 import 加载文件的时候只能使用 './' 开头的这种读取本地文件的方式，而无法读取 node_modules 里的第三方模块，例如：

```js
import _ from 'lodash-es'
```

这种写法是无法拿到值的，执行的时候会出现警告说找不到文件。想要读取第三方的模块，需要使用插件支持，这边推荐 rollup-plugin-node-resolve

```sh
yarn add -D rollup-plugin-node-resolve
```

```diff
  import json from 'rollup-plugin-json'
+ import resolve from 'rollup-plugin-node-resolve'

  export default {
      input: 'src/index.js',
      output: {
          format: 'iife',
          file: 'dist/bundle.js'
      },
      plugins: [
          json(),
+         resolve(),
      ]
  }
```

这时候上面的那句 import 语句就能被支持了。不过这边有两点要注意的：

1. 不要导出整个模块，应该解构出需要的函数：

```js
import { camelCase } from 'lodash-es'
```

这样才能最大程度的减小打包文件的大小，因为这样其他没用到函数会被 Tree Shaking 掉。如果导入整个对象，rollup 就会认为你是想要使用整个对象，就不会 Tree Shaking 掉。

2. 这边引入的是 lodash-es ，是 es 版本的。rollup 只能识别 ES Module 规范的代码，无法识别 CommonJS 。如果要识别的话需要引入插件处理。

## 加载 CommonJS 模块

上一节有提到，rollup 默认无法支持加载 CommonJS 规范的代码，需要加载插件才能支持，可以使用 rollup-plugin-commonjs

```js
yarn add -D rollup-plugin-commonjs
```

```diff
  import json from 'rollup-plugin-json'
  import resolve from 'rollup-plugin-node-resolve'
+ import commonjs from 'rollup-plugin-commonjs'

  export default {
      input: 'src/index.js',
      output: {
          format: 'iife',
          file: 'dist/bundle.js'
      },
      plugins: [
          json(),
          resolve(),
+         commonjs(),
      ]
  }
```

这样就可以支持加载 CommonJS 规范的文件了，我们这边可以做个测试，创建一个 `src/cjs-module.js` 文件：

```js
module.exports = {
    foo: 'bar'
}
```

然后修改 `src/index.js` 文件：

```js
// ...
import cjs from './cjs-module'

// ...

log(cjs)
```

打包之后可以看到这样几行代码：

```js
// ...
var cjsModule = {
    foo: 'bar'
};

// ...

log(cjs)
```

这就代码加载成功了，如果配置失败就会报错。

## 代码拆分

rollup 默认就能支持代码拆分，实现方式跟 webpack 一样采用动态导入的方式实现。这边为了测试，调整下 `src/index.js` 代码：

```js
import('./logger').then(module => {
    module.log('code splitting!')
})
```

采用 import() 的方式，返回一个 Promise，then 接收到 module 对象，包含模块的全部导出内容被整合到一个对象里。所以可以通过 module.log 的方式拿到 log 函数。

以之前的配置，直接这样运行会报错，存在两个问题：

1. iife 和 umd 格式不支持代码拆分，我们只能换一种。剩下的浏览器能支持的就剩下 amd 了。
2. 代码拆分其实就是分包导出，会导出多个文件，而我们之前的配置是指定导出文件，只能是一个文件，所以这边打包就不知道怎么进行了。想要实现分包需要改成指定打包目录。

根据上述问题，配置文件可改成这样：

```diff
...
export default {
    input: 'src/index.js',
    output: {
-       format: 'iife',
+       format: 'amd',
-       file: 'dist/bundle.js'
+       dir: 'dist'
    },
    ...
}
```

这时候再去打包就能正常输出文件了，这时候生成的目录会是这样：

```
...
├─ dist
│   ├─ index.js
│   └─ logger-a06eeab6.js
...
```

动态导入的文件 logger.js 生成后会独立生成一个文件，logger 后面跟上 hash 值。非动态导入的 index.js 文件则还是原来的名称。采用动态导入的方式就无法实现 Tree Shaking ，logger.js　里两个方法都被导出，即使 module 对象有解构还是一样的结果。

还有一点需要注意的是，文件格式使用 amd ，如果在浏览器上使用就需要引用 requirejs 库，在 html 中的代码就应该是这样：

```html
<script src="https://unpkg.com/requirejs@2.3.6/require.js" data-main="index.js"></script>
```

## 多入口打包

rollup 默认就支持多入口打包，而且对于多个文件公共的代码会自动提取到单独的文件，配置如下：

```js
export default {
    input: ['src/index.js', 'src/album.js'],
    output: {
        format: 'amd',
        dir: 'dist'
    }
}
```

多入口打包其实就是 input 原本是指定入口文件，现在改成数组，数组几个成员就是几个打包入口。多入口打包最终生成的也是多个文件，所以 output 配置也要跟代码拆分一样，配置打包目录，文件格式使用 amd 。传入数组打包出来的文件是跟源文件同名，你也可以传入对象，修改各个出口文件的名字：

```js
export default {
    input: {
        foo: 'src/index.js',
        bar: 'src/album.js'
    },
    output: {
        format: 'amd',
        dir: 'dist'
    }
}
```

对象的 key 值为作为文件名称导出，最终生成的结构会是这样：

```
...
├─ dist
│   ├─ foo.js
│   ├─ bar.js
│   └─ logger-a06eeab6.js
...
```

`logger-a06eeab6.js` 文件是提取的公共代码的文件，这节的代码有做调整，具体示例代码看 [这里](./code/rollup/demo3)

## 选用原则

经过以上的尝试可以看出，rollup 相对于 webpack 还是有它的优势的：

- 输出结果更加扁平
- 自动移除未引用代码
- 打包结果依然完全可读

对应的缺点也是很明显的：

- 加载非 ESM 的第三方模块比较复杂
- 模块最终都被打包到一个函数中，无法实现 HMR
- 浏览器环境中，代码拆分功能依赖 AMD 库

综合优缺点，rollup 比较适合用于开发框架或者类库，开发应用比较适合 webpack