# Gulp

## 基本使用

1. 初始化项目

```sh
yarn init --yes
```

2. 安装 gulp

```sh
yarn add gulp --dev
```

3. 在根目录创建 gulpfile.js

4. 创建任务

在 gulpfile.js 里面写。

```js
exports.foo = done => {
    console.log('foo task working~')

    done()  // 标识任务完成
}
```

在 gulp 4.x 里面，所有的任务都是异步任务，都要执行一下 done 来标识任务完成，否则会报错

5. 运行任务

yarn gulp + 任务名称

```sh
yarn gulp foo
```

如果是运行默认任务，也就是任务名 default 的话可以这样：

```sh
yarn gulp
```

没有默认任务也这样去运行会去找第一个任务。

以上是 4.x 的写法，对于以前的写法也能支持，例如：

```js
const gulp = require('gulp')

gulp.task('bar', done => {
    console.log('bar task working~')
    done()
})
```

```sh
yarn gulp bar
```

老项目可能都是用这种写法，使用 gulp.task 来创建任务。

## 组合任务

组合任务分为串行任务和并行任务。

- 串行任务：按顺序执行几个任务，例如项目部署的时候我们需要先执行编译任务再执行打包、发布任务；
- 并行任务：同时执行好几个任务，例如编译 JS 和编译 CSS 是两个互不干扰的任务，这两个任务可以同时进行，从而提升构建效率。

```js
const { series, parallel } = require('gulp');

// 这些没有导出的任务称为私有任务
const task1 = done => {
    setTimeout(() => {
        console.log('task1 working~')
        done()
    }, 1000)
}
const task2 = done => {
    setTimeout(() => {
        console.log('task2 working~')
        done()
    }, 1000)
}
const task3 = done => {
    setTimeout(() => {
        console.log('task3 working~')
        done()
    }, 1000)
}

// 串行任务
exports.foo = series(task1, task2, task3)

// 并行任务
exports.bar = parallel(task1, task2, task3)
```

## 异步任务

前面有说到，在 gulp 4.x 里面，所有的任务都是异步任务。异步任务就会存在一个问题，我们如何通知 gulp 我们任务已经完成了，针对这个问题，gulp 提供了四种方式。

### 回调写法

回调写法其实就是前面示例里一直在用的，就像以下这样：

```js
exports.callback = done => {
    console.log('callback task~')
    done()
}
```

通过调用 done 函数来标记任务完成。之前调用 done 都是没传参数的，其实这边传了参数就意味着任务失败，会报错，即使是传 true，例如：

```js
exports.callback_error = done => {
    console.log('callback task~')
    done(true)
}
```

这也是属于任务异常，不过通常是传错误对象指定具体的错误类型，例如：

```js
exports.callback_error = done => {
    console.log('callback task~')
    done(new Error('task failed!'))
}
```

### promise 写法

在 es6 里通常使用 promise 来处理异步函数，在 gulp 也同样支持这种写法，可以通过返回 Promise.resolve() 来表示任务执行成功，例如：

```js
exports.promise = () => {
    console.log('promise task~')
    return Promise.resolve()
}
```

这边的 resolve 的调用参数传不传都无所谓，反正都会被 gulp 忽略。

如果要表示执行失败，那就返回 Promise.reject() ，例如：

```js
exports.promise_error = () => {
    console.log('promise task~')
    return Promise.reject(new Error('task failed!'))
}
```

当然我们也可以把任务整个包在 Promise 里面，例如：

```js
exports.promise = () => new Promise((resolve, reject) => {
    try {
        setTimeout(() => {
            console.log('promise task~')
            resolve('success')
        }, 1000)
    } catch (error) {
        reject(error)
    }
})
```

### async/await 写法

gulp 能支持 promise ，同样也能支持 async/await 。不过 gulp 依赖 NodeJS ，NodeJS 是 8 以上的版本才支持。

async/await 是一个 promise 的语法糖，用法其实差不多，这边简单举个例子：

```js
const timeout = time => {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}
exports.async = async () => {
    await timeout(1000)
    console.log('async task~')
}
```

这边能执行到打印语句，就代表执行了 resolve ，也就代表任务执行成功。

### stream 写法

stream 的写法一般是在文件操作的时候使用，而 gulp 做项目构建的时候又是经常需要操作文件，所以这种写法在 gulp 里是最常用的。

下面举了一个文件复制的例子：

```js
const fs = require('fs')

exports.stream = () => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('temp.txt')

    readStream.pipe(writeStream)
    return readStream
}
```

这边使用了 pipe 方法，采用了类似管道的方式，把读取到的文件流 readStream 通过 pipe 像管道一样流向 writeStream ，从而让 temp.txt 拥有 package.json 的内容，完成了文件复制的操作。

最后返回文件流，gulp 会自动监听文件流是否已完成，就不需要我们自己标记完成。这块的内部实现其实是 gulp 去做了 readStream 监听 end 事件处理， readStream 执行完成的时候会去触发 end 事件，所以代码也可以改成这样：

```js
const fs = require('fs')

exports.stream = done => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('temp.txt')

    readStream.pipe(writeStream)
    readStream.on('end', () => {
        done()
    })
}
```

## 构建过程

构建过程：输入 -> 加工 -> 输出
对应 gulp 的构建过程：读取流 -> 转化流 -> 写入流

以下以 css 代码压缩的例子演示构建过程：

```js
const fs = require('fs')
const { Transform } = require('stream')

exports.stream = () => {
    // 文件读取流
    const read = fs.createReadStream('normalize.css')
    // 文件写入流
    const write = fs.createWriteStream('normalize.min.css')
    // 文件转换流
    const transform = new Transform({
        transform (chunk, encoding, callback) {
            // 核心转换过程实现
            // chunk => 读取流中读取到的内容
            const input = chunk.toString()
            const output = input.replace(/\s*/g, '').replace(/\/\*.+?\*\//g, '')

            // 第一个参数是错误信息，没有异常就传入 null
            callback(null, output)
        }
    })

   
    read // 读取
        .pipe(transform) // 转换
        .pipe(write) // 写入
    
    return read
}
```

## 文件操作 API

gulp 给我们提供了专门处理读取流和写入流的 API ，相对于底层 NodeJS 的 API ，gulp 提供的 API 更强大、更容易使用。至于负责文件加工的转换流，绝大部分情况是通过独立的插件来提供。

下面先以文件复制的例子感受下 gulp API 给我们带来的便捷：

```js
const { src, dest } = require('gulp')

exports.default = () => {
    return src('src/normalize.css')
        .pipe(dest('dist'))
}
```

这样就已经完成了文件的复制功能。src 是文件读取流，dest 是文件写入流，这段代码的意思是将 src 下的 normalize.css 文件读取出来，再写入到 dist 目录下，这边没改文件名就是使用源文件的名称。

gulp API 不仅简化了代码，还能支持通配符，例如现在的目录结构是这样：

```
├─ src/
│   ├─ bootstrap.css
│   └─ normalize.css
├─ gulpfile.js
└─ package.json
```

这边把读取流地址改成通配符：

```js
const { src, dest } = require('gulp')

exports.default = () => {
    return src('src/*.css')
        .pipe(dest('dist'))
}
```

这样会将 src 下所有的 css 文件都复制到 dist 目录下，执行后的目录结构就会变成这样：

```
├─ dist/
│   ├─ bootstrap.css
│   └─ normalize.css
├─ src/
│   ├─ bootstrap.css
│   └─ normalize.css
├─ gulpfile.js
└─ package.json
```

关于通配符还有这些：

- `src/*` 代表 src 下所有文件
- `src/**` 代表 src 本身 、src 下的所有目录、文件、子目录、子文件
- `src/**/*` 代表 src 下的所有目录、文件、子目录、子文件
- `src/*.css` 代表 src 下所有 css 文件

有加后缀名的就会筛选指定后缀名，这边就不全部列出来了。

以上演示了读取流和写入流，至于转换流，官方有出了一些插件，我们可以找到对应的插件完成功能。例如我们要实现 css 代码压缩功能就可以使用 gulp-clean-css 插件，压缩完要修改文件名，就可以使用 gulp-rename 插件，具体使用如下：

```js
const { src, dest } = require('gulp')
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename')

exports.default = () => {
    return src('src/*.css')
        .pipe(cleanCss())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(dest('dist'))
}
```

最终的执行结果会形成这样的目录结构：

```
├─ dist/
│   ├─ bootstrap.min.css
│   └─ normalize.min.css
├─ src/
│   ├─ bootstrap.css
│   └─ normalize.css
├─ gulpfile.js
└─ package.json
```

## Gulp 案例

案例以[这个模板](https://github.com/zce/zce-gulp-demo)进行项目构建

### 样式编译


