# 搭建自己的 SSR

## 渲染一个 Vue 实例

1. 创建项目
2. 安装 `vue` 和 `vue-server-renderer`
3. `new Vue()` 创建 Vue 实例对象
4. 使用 `vue-server-renderer` 提供的 `createRenderer` 获取渲染器
5. 使用渲染器的 `renderToString` 渲染 Vue 实例对象

    - 第一个参数是 Vue 实例对象得到渲染结果
    - 第二参数是渲染完成后的回调函数 `(error, html) => {...}`


## 结合到 Web 服务中

1. 安装 NodeJS 的 Web 框架 `express`
2. 使用 `express` 创建服务器对象
3. 设置路由和监听窗口
4. 将 Vue 渲染工作放在路由回调里，将渲染结果作为服务器响应结果传给客户端
5. 设置编码类型
6. 给渲染结果增加 `head` 和 `body` 内容，并设置编码

## 使用 HTML 模板

1. 创建模板文件 `index.template.html` ，编写基本 HTML 结构
2. 在 `body` 里写 `<--vue-ssr-outlet-->` 作为渲染入口
3. 使用 `fs.readFileSync` 获取模板内容
4. 将模板内容传给 `createRenderer` 方法，作为对象属性 `template` 的值
5. 刚在渲染结果里加的内容删掉

## 在模板中使用外部数据

1. `renderToString` 第二参数改成传入对象，原本的回调函数作为第三个参数，对象的值就是给模板使用的数据
2. 在模板文件里，`{{ var }}` 是渲染转义后的，`{{{ var }}}` 是渲染转义前的。

## 构建配置

以上做法都是在服务端渲染，这只会渲染内容，并没有交互能力。服务器应该只负责首次渲染的工作，渲染完之后由客户端接管后续的交互能力。接下来将借助 webpack 搭建同构应用的环境。

1. 搭建项目结构

    ```
    ├─ build
    │  ├─ webpack.base.config.js
    │  ├─ webpack.client.config.js
    │  └─ webpack.server.config.js
    ├─ src
    │  ├─ App.Vue               根组件
    │  ├─ app.js                通用启动入口
    │  ├─ entry-server.js       服务端入口
    │  └─ entry-client.js       客户端打包入口
    ├─ index.template.html
    ├─ package.json
    └─ server.js
    ```

2. 安装依赖

    ```sh
    $ yarn add cross-env
    $ yarn add -D webpack webpack-cli webpack-merge webpack-node-externals @babel/core @babel/plugin-transform-runtime @babel/preset-env babel-loader css-loader url-loader file-loader rimraf vue-loader vue-template-compiler friendly-errors-webpack-plugin
    ```
3. 编写构建代码，这块直接使用现成的

    `webpack.base.config.js`

    ```js
    const VueLoaderPlugin = require('vue-loader/lib/plugin')
    const path = require('path')
    const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
    const resolve = file => path.resolve(__dirname, file)

    const DEV = process.env.NODE_ENV === 'development'

    module.exports = {
        mode: DEV ? 'development' : 'production',
        output: {
            path: resolve('../dist/'),
            publicPath: '/dist/',
            filename: '[name].[chunkhash].js'
        },
        resolve: {
            alias: {
            // 路径别名，@ 指向 src
            '@': resolve('../src/')
            },
            // 可以省略的扩展名
            // 当省略扩展名的时候，按照从前往后的顺序依次解析
            extensions: ['.js', '.vue', '.json']
        },
        devtool: DEV ? 'cheap-module-eval-source-map' : 'none',
        module: {
            rules: [
            // 处理图片资源
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                {
                    loader: 'url-loader',
                    options: {
                    limit: 8192,
                    },
                },
                ],
            },

            // 处理字体资源
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                'file-loader',
                ],
            },

            // 处理 .vue 资源
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },

            // 处理 CSS 资源
            // 它会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块
            {
                test: /\.css$/,
                use: [
                'vue-style-loader',
                'css-loader'
                ]
            },
            
            // CSS 预处理器，参考：https://vue-loader.vuejs.org/zh/guide/pre-processors.html
            // 例如处理 Less 资源
            // {
            //   test: /\.less$/,
            //   use: [
            //     'vue-style-loader',
            //     'css-loader',
            //     'less-loader'
            //   ]
            // },
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new FriendlyErrorsWebpackPlugin()
        ]
    }
    ```

    `webpack.client.config.js`

    ```js
    const webpack = require('webpack')
    const { merge } = require('webpack-merge')
    const baseConfig = require('./webpack.base.config.js')
    const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

    module.exports = merge(baseConfig, {
        entry: {
            app: './src/entry-client.js'
        },

        module: {
            rules: [
            // ES6 转 ES5
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    cacheDirectory: true,
                    plugins: ['@babel/plugin-transform-runtime']
                }
                }
            },
            ]
        },

        // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
        // 以便可以在之后正确注入异步 chunk。
        optimization: {
            splitChunks: {
            name: "manifest",
            minChunks: Infinity
            }
        },

        plugins: [
            // 此插件在输出目录中生成 `vue-ssr-client-manifest.json`。
            new VueSSRClientPlugin()
        ]
    })
    ```

    `webpack.server.config.js`

    ```js
    const { merge } = require('webpack-merge')
    const nodeExternals = require('webpack-node-externals')
    const baseConfig = require('./webpack.base.config.js')
    const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

    module.exports = merge(baseConfig, {
        // 将 entry 指向应用程序的 server entry 文件
        entry: './src/entry-server.js',

        // 这允许 webpack 以 Node 适用方式处理模块加载
        // 并且还会在编译 Vue 组件时，
        // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
        target: 'node',

        output: {
            filename: 'server-bundle.js',
            // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
            libraryTarget: 'commonjs2'
        },

        // 不打包 node_modules 第三方包，而是保留 require 方式直接加载
        externals: [nodeExternals({
            // 白名单中的资源依然正常打包
            allowlist: [/\.css$/]
        })],

        plugins: [
            // 这是将服务器的整个输出构建为单个 JSON 文件的插件。
            // 默认文件名为 `vue-ssr-server-bundle.json`
            new VueSSRServerPlugin()
        ]
    })
    ```

4. 给 `package.json` 增加 `scripts`

    ```json
    {
        "scripts": {
            "build:client": "cross-env NODE_ENV=production webpack --config build/webpack.client.config.js",
            "build:server": "cross-env NODE_ENV=production webpack --config build/webpack.server.config.js",
            "build": "rimraf dist && yarn run build:client && yarn run build:server"
        }
    }
    ```

5. 之前文件都在 `server.js` 里写，将之前的 Vue 实例代码放在 `App.vue` 里面写
6. 在 `app.js` 里面定义一个方法 `createApp` 用于创建 Vue 实例，以 `App.vue` 作为根组件渲染，并导出实例对象
7. 在 `entry-server.js` 中导出默认成员为一个方法，方法返回实例对象
8. 在 `entry-client.js` 中渲染 Vue 实例
9. 在 `server.js` 中加入一个中间件用来指定静态资源根目录
10. 执行 `build` 命令打包，生成 `dist` 目录及里面的文件
11. 回到 `server.js` 文件做一些改动：

    - 将 `createRenderer` 改成 `createBundleRenderer` ，第一个参数传入 `server-bundle`（引入 `dist` 目录里面的文件），第二个参数是对象，传入模板内容 `template` 和 `clientManifest`
    - 删除 `renderToString` 第一个参数，之前写的 Vue 实例代码都删了
12. NodeJS 运行 `server.js` 启动应用

## 构建开发模式配置

1. 给 Npm Scripts 分别设置开发模式和生产环境下的项目启动命令
2. `renderer` 的赋值分生产环境和开发环境，以前的做法作为生产环境的方式，开发环境后续写
3. 路由回调函数抽离出来，生产环境直接执行函数，开发环境等待生成最新 `renderer` 再执行
4. 创建 `setupDevServer` 方法用来生成最新 `renderer`，`setupDevServer` 返回一个 Promise，将这个 Promise 赋值给 `onReady`，再通过 `onReady` 来判断是否已经生成 `renderer` 
5. 在 `setupDevServer` 里分别监听 `index.template.html`、`vue-ssr-server-bundle.json`、`vue-ssr-client-manifest.json` 文件的变化，当发生变化的时候触发回调函数，在回调函数里对 `renderer` 重新赋值
6. 由于项目刚启动时不会触发监听事件，所以三个文件在监听前，先生成文件并获取文件内容，触发一次回调生成 `renderer`
7. 监听 `index.template.html` 文件监听采用第三方模块 `chokidar` 实现
8. 由于 `vue-ssr-server-bundle.json` 和 `vue-ssr-client-manifest.json` 是通过 webpack 打包生成的，所以需要借助 webpack 的钩子函数去监听，因此需要引入 webpack 和配置文件，在 JS 手动触发 webpack 构建，通过 `[webpack 编译对象].hooks.done.tap(取个事件名称, 回调函数)` 监听 webpack 构建完成事件
9. 为了提高构建速度，避免频繁读写磁盘文件，使用 `webpack-dev-middleware` 去构建，将文件打包到内存里。通过构建结果对象的 `fileSystem` 属性替代 `fs` 去读取文件内容，`fileSystem` 所含有的属性和方法与 `fs` 一致。`webpack-dev-middleware` 作为中间件，需要在 express 实例对象里使用 `.use(中间件)` 才能生效 
10. 使用 `webpack-dev-middleware` 需要传入选项 `log` 设置为 `silent` 关闭日志输出，客户端还需要传入 `publicPath`
11. 引入 `webpack-hot-middleware` 实现热更新，在 `vue-ssr-client-manifest.json` 文件监听里使用 `webpack-hot-middleware`，并将使用后的返回值作为中间件使用。 `webpack.client.config.js` 中开发环境引入插件 `webpack.HotModuleReplacementPlugin`，`entry` 改成数组，增加 `webpack-hot-middleware/client?quiet=true&reload=true` 放在第一个元素位置

## 路由处理

1. 创建 `src/pages` 文件夹，在这下创建相关页面文件
2. 创建 `src/router/index.js` 文件，引入并使用 `vue-router`，创建 `createRouter` 用于创建路由配置对象，配置对象里除了配置路由信息，还需要设置路由模式为 `history`
3. 在 `app.js` 里的 `createApp` 创建调用 `createRouter` 获取 `router` ，在实例上使用并加入到方法的返回对象里
4. 在 `entry-server.js` 里，将方法改为 `async/await` ，调用 `router.push(context.url)` ，这个 `context` 由 `renderer` 渲染时传入，`url` 由客户端传入，即 `req.url` 。之后执行 `await new Promise(router.onReady.bind(router)` 表示等待路由跳转完成
5. 在 `entry-client.js` 里，把渲染代码放在 `router.onReady()` 的回调函数里
6. 在 `server.js` 里除了 `renderer` 渲染时传入 `url` 外，还得将路由配置地址改成 `*`，才能正确的做 `history` 模式的路由跳转
7. 在 `App.vue` 改成路由跳转内容，增加 `router-view`

## 管理页面 Head 内容

1. 在 `app.js` 里引入并使用 `vue-meta` ，设置 Vue 混合传入 `metaInfo.titleTemplate` 设置公共的标题模板
2. 在 `entry-server.js` 中在路由跳转前调用 `app.$meta()` 获得 `meta` 数据，在路由跳转之后将值传给 `context.meta`
3. 将 `meta` 数据运用到模板里，`meta.inject().title.text()` 获取标题信息，其他信息同理
4. 在具体页面里，通过设置 `mtaInfo` 来定制每个页面不同的 Head 内容

## 数据预取和状态管理

1. 创建 `src/store/index.js` ，引入并使用 `vuex`, 创建 `createStore` 用于创建 `store` 对象
2. 在 `app.js` 里的 `createApp` 创建调用 `createStore` 获取 `store` ，在实例上使用并加入到方法的返回对象里
3. 在 `entry-server.js` 里，在路由跳转完成之后，设置 `context.rendered` 值，值为一个函数，函数里将 `store.state` 赋值给 `context.state`
4. 在 `entry-client.js` 里，使用 `store.replaceState` 将 `window.__INITIAL_STATE__` 替换掉当前的 `state`
5. 在页面里面，在 `serverPrefetch` 生命周期里发起 Action，注意 `serverPrefetch` 需要返回 Promise，才能确保 Action 执行完成才去渲染
6. `serverPrefetch` 只在服务端执行，客户端渲染的页面需在 `mounted` 里请求数据，请求数据前先判断下数据有没有在服务端获取到
