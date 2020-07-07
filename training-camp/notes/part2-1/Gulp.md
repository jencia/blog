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
- `src/*.{sass,scss}` 代表 src 下所有 sass 或 scss 文件

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

开发过程中常常会使用一些预编译语言来提高样式开发效率和维护性，这边以 sass 为例，用到 sass 文件就需要编译。我们可以使用 gulp-sass 来编译，将 scss 文件编译为 css 文件。

```sh
yarn add -D gulp-sass
```

注意：这个插件依赖 node-sass ，安装会很慢。如果实在装不下就装下这个方案再重新安装：

```sh
npm install -g mirror-config-china --registry=http://registry.npm.taobao.org
```

```js
const { src, dest } = require('gulp')
const sass = require('gulp-sass')

const style = () => {
    // 设置 base 是为了文件输出路径与源码路径保持一致
    return src('src/assets/styles/*.scss', { base: 'src' })
        // 使用 gulp-sass 编译 scss 文件
        // expanded 代表代码输出风格为大括号完全展开
        .pipe(sass({ outputStyle: 'expanded' }))    
        .pipe(dest('dist'))
}
```

### 脚本编译

这边的脚本指的就是 JS 文件，代码里使用了 ES6+ 的特性就需要编译才能兼容所有浏览器。一般编译 ES6+ 代码通常采用 babel 编译，而 gulp 提供了一个叫 gulp-babel 的插件。

```sh
yarn add -D gulp-babel @babel/core @babel/preset-env
```

gulp-babel 底层会去调用 babel ，所以需要安装 @babel/core 这个 babel 核心库。不过这只是个平台，真正起作用的是 babel 插件，这边使用一个插件集 @babel/preset-env 。

```js
const { src, dest } = require('gulp')
const babel = require('gulp-babel')

const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('dist'))
}
```

### 页面模板编译

通常为了提高页面代码的通用性，都会采用模板引擎去开发页面。在模板文件里做插值操作，再通过外界传入的参数来展示不同的代码。页面模板引擎需要编译才能将值插入到模板里。这个示例项目使用的是 swig 语法，所以我们需要安装 gulp-swig 。

```sh
yarn add -D gulp-swig
```

```js
const { src, dest } = require('gulp')
const swig = require('gulp-swig')
const data = { /*...*/ }

const page = () => {
    return src('src/*.html', { base: 'src' })
        .pipe(swig({ data }))
        .pipe(dest('dist'))
}
```

### 图片和字体转换

图片和字体通常作为资源文件的存在，这种一般浏览器本身就已经支持的，能做的处理也就只有压缩文件。通过文件压缩减小总体资源文件的体积，从何提高网页的访问速度。不过文件压缩应该属于无损压缩，肉眼看不出压缩后的变化，这边使用 gulp-imagemin 。

```sh
yarn add -D gulp-imagemin
```

注意：这个插件依赖二进制文件，安装的时候很慢。

```js
const { src, dest } = require('gulp')
const imagemin = require('gulp-imagemin')

const asset = () => {
    return src('src/assets/{images,fonts}/**', { base: 'src' })
        .pipe(imagemin())
        .pipe(dest('dist'))
}
```

imagemin 只会压缩可压缩的文件，对于字体文件无法压缩只会原封不动的复制。

### 其他文件及文件清除

在项目开发中往往有一些是不需要编译也不需要压缩的，这些文件一般放在 public 目录下，在编译的时候只需要原封不动的拷贝就好。

```js
const { src, dest } = require('gulp')

const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}
```

每次编译的时候都只是往 dist 目录里加文件，时间久了里面就会掺杂一些不需要的文件，所以我们应该每次编译的时候都先去清除 dist 目录，这边引入了一个 del 模块：

```sh
yarn add -D del
```

```js
const del = require('del')

const clean = () => del('dist')
```

这边创建了一个 clean 任务专门用来清除 dist 目录。这任务不需要做文件流操作，所以不需要 src 和 dest ，直接写就好。这个 del 里面传入需要清除的目录，多个可传数组，返回的是一个 Promise 对象。Promise 对象就是异步，所以可以直接返回，就形成了现在这样的代码。

clean 需要在编译开始之前就执行，需要用到组合任务里的 series 做串行任务。而前面讲到的那些样式编译、脚本编译、页面编译、资源文件压缩都是互不干扰的，所以可以使用 parallel 做并行任务，组合起来就是以下这样：

```js
const { parallel, series } = require('gulp')

const compile = parallel(style, script, page, asset)
const build = series(clean, parallel(compile, extra))

module.exports = { build }
```

最后只要执行 build 任务就能将上面讲到的所有任务组合起来运行。

### 自动加载插件

从前面几节讲到的已经有 4 个 gulp 插件，每个都要单独 require 引入进来：

```js
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const swig = require('gulp-swig')
const imagemin = require('gulp-imagemin')
```

后续还会用到更多的插件，每次都这样引入很麻烦，也不利于后续的维护。gulp 提供了一个自动引入的插件：

```sh
yarn add -D gulp-load-plugins
```

```js
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins();

plugins.sass
plugins.imagemin
```

这个会帮忙引入所有 gulp 插件，也就是 `gulp-` 开头的模块，后续使用插件的时候只需要 `plugins. + 插件名` ，例如 `gulp-sass` 就可以使用 `plugins.sass` 拿到。

### 开发服务器

以前传统的开发方式是代码写完后还需要手动到浏览器上刷新下页面才能看到最新效果，每次改完想看效果都要手动刷新页面，这很繁琐，开发体验很差。前端发展到工程化后就有了一个叫热更新的东西，修改代码浏览器会自动刷新，可以实时看到最新效果，这可以大大提高工作效率。热更新需要搭建一个前端服务器，现在市面上已经有很多这种插件，这边我们使用 browserSync 。

```sh
yarn add -D browser-sync
```

```js
const browserSync = require('browser-sync')
const bs = browserSync.create()

const serve = () => {
    bs.init({
        files: 'dist/**', // 监听 dist 下的所有文件，一旦有变化就刷新页面
        server: {
            baseDir: 'dist', // 网站根目录
            routes: {
                // 处理路径映射
                // 用来解决编译后的代码无法识别到 node_modules 里的文件
                '/node_modules': 'node_modules'
            }
        }
    })
}
```

开发服务器一般是在开发的时候才需要用到，开发完成就不需要了，所以我们这边需要区分下开发环境和生产环境。回顾下之前的代码：

```js
const { parallel, series } = require('gulp')

const compile = parallel(style, script, page, asset)
const build = series(clean, parallel(compile, extra))

module.exports = { build }
```

之前我们只创建了 build 任务，build 就是属于编译打包准备发到生产环境的，所以这块属于生产环境的构建。对于开发环境有些编译时不需要的，比如 asset 和 extra ，这两个任务的作用就是压缩和拷贝到另外一个地方，这两个对于开发环境没有作用，还会消耗编译时间。结合开发服务器，改成以下这样：

```js
const compile = parallel(style, script, page)

const develop = parallel(compile, serve)
const build = series(clean, parallel(compile, asset, extra))

module.exports = { develop, build }
```

这样改的话对于开发环境，在 dist 里面是找不到 asset 和 extra 的文件的，所以需要改下服务器配置：

```js
bs.init({
    files: 'dist/**',
    server: {
        // dist 找不到文件会到 src 里找，再找不到就到 public 
        baseDir: ['dist', 'src', 'public'],
        routes: {
            '/node_modules': 'node_modules'
        }
    }
})
```

### 监视变化

gulp 给我们了一个文件监视的 API ，用来监视文件变化，例如：

```js
const { watch } = require('gulp')

// 监听 styles 下的 scss 文件的变化，一旦发现变化就去执行 style 任务
watch('src/assets/styles/*.scss', style)
```

支持监听多个路径的变化：

```js
const { watch } = require('gulp')

watch([
    'src/assets/{images,fonts}/**',
    'public/**'
], bs.reload)
```

这边的 `bs.reload` 是 browserSync 提供的一个页面刷新的方法，这边去监听文件变化，一旦有文件改变了就去刷新页面。`bs.reload` 是个函数，他可以作为任务传入 watch 的第二个参数。

`bs.reload` 也可以作为流传入 pipe 里面，所以 style 任务也可以这样改：

```js
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest('dist'))
        .pipe(bs.reload({ stream: true }))
}
```

这样就可以每次样式变化的时候就去刷新页面，script 和 page 也做同样的处理，这样开发服务器就不需要监听 dist 目录的变化了，最终 serve 任务改成这样：

```js
const serve = () => {
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', script)
    watch('src/*.html', page)

    watch([
        'src/assets/{images,fonts}/**',
        'public/**'
    ], bs.reload)

    bs.init({
        notify: false,
        server: {
            baseDir: ['dist', 'src', 'public'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}
```

### useref 文件引用处理

之前生成到 dist 里面的 html 文件其实是不能直接拿去生产环境使用的，因为代码里还用到了 node_modules 里的文件，只能在这个项目环境下才能使用，拿到其他地方就找不到文件了。仔细观察可以发现，之前生成的 html 文件包含着这样的代码：

```html
<!-- build:css assets/styles/vendor.css -->
<link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
<!-- endbuild -->
<!-- build:css assets/styles/main.css -->
<link rel="stylesheet" href="assets/styles/main.css">
<!-- endbuild -->
```

在 link 和 script 代码周围存在 build:css 、endbuild:css 的代码，其实这是转换后做的一个标记，这么我们还需要借助 gulp-useref ，它可将标记内的引用路径合并成一个文件，并且根据标记的文件路径生成文件。

```sh
yarn add -D gulp-useref
```

```js
const useref = () => {
    return src('dist/*.html', { base: 'dist' })
        .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
        .pipe(dest('dist'))
}
```

这边传的 searchPath 参数是代表从哪个路径下开始查找，html 里面的引用的文件大部分是在 dist 里面，所以 dist 写在第一个会优先查找 dist 底下的文件。像 bootstrap 文件是属于 node_modules 里的，在 dist 里找不到就会查找根目录下。最终 html 代码会变成这样：

```html
<link rel="stylesheet" href="assets/styles/vendor.css">
<link rel="stylesheet" href="assets/styles/main.css">
```

所有引用文件都变成明确的文件路径，原本引用了 node_modules 里面的文件变成了 vendor.css 文件，这样就不用担心 dist 目录放在其他地方访问不了的问题。

### 文件压缩

经过上一节使用了 gulp-useref ，dist 里面的 html、css、js 文件已经重新整合了一遍，我们可以借此整合的时间点，对各个文件做压缩动作。在 gulp-useref 执行完之后其实就拿到了全新的 html、css、js 文件。我们可以在这之后，在写入流之前做压缩。不过这时候拿到的文件流很杂，有三种类型的文件，这边需要借助 gulp-if 做区分。压缩插件分别是：

- gulp-uglify 压缩 js 文件
- gulp-clean-css 压缩 css 文件
- gulp-htmlmin 压缩 html 文件

所以这边需要状 4 个插件：

```sh
yarn add -D gulp-if gulp-uglify gulp-clean-css gulp-htmlmin
```

```js
const useref = () => {
    return src('dist/*.html', { base: 'dist' })
        .pipe(plugins.useref({ searchPath: ['dist', '.'] }))

        // 文件压缩
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({
            collapseWhitespace: true,   // 折叠空白字符
            minifyCSS: true,            // 压缩 html 里面的 css
            minifyJS: true              // 压缩 html 里面的 js
        })))

        // 这边由于读取流是 dist 所以写入流只能换个地方存放
        .pipe(dest('release'))
}
```

### 重新规划构建过程

经过了上一节的折腾，原本生产文件都在 dist ，现在变成了 html、css、js 在 release 里，图片和字体在 dist 里，所以这边需要重新规划下。

这边有 dist 和 release 两块内容，最终要的应该是放在 dist 里的，所以这边需要一个中间目录作为临时目录，这边叫 temp。具体的修改流程如下：

- clean 任务里 del 参数改成数组，增加一个 temp ；
- style 、script 、 page 任务的写入流放在 temp 里；
- serve 任务的 dirDir 里的 dist 改成 temp
- useref 任务里的 dist 改成 temp ，release 改成 dist

最终的 build 任务改成这样：

```js
const build = series(
    clean,
    parallel(
        series(compile, useref),
        asset,
        extra
    )
)
```

这样就大功告成了。


