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
    $ yarn add -D webpack webpack-cli webpack-merge webpack-node-externals @babel/core @babel/plugin-transform-runtime @babel/preset-env babel-loader css-loader url- loader file-loader rimraf vue-loader vue-template-compiler friendly-errors- webpack-plugin
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
6. 在 `app.js` 里面定义一个方法用于创建 Vue 实例，以 `App.vue` 作为根组件渲染，并导出实例对象
7. 在 `entry-server.js` 中导出默认成员为一个方法，方法返回实例对象
8. 在 `entry-client.js` 中渲染 Vue 实例
9. 在 `server.js` 中加入一个中间件用来指定静态资源根目录
10. 执行 `build` 命令打包，生成 `dist` 目录及里面的文件
11. 回到 `server.js` 文件做一些改动：

    - 将 `createRenderer` 改成 `createBundleRenderer` ，第一个参数传入 `server-bundle`（引入 `dist` 目录里面的文件），第二个参数是对象，传入模板内容 `template` 和 `clientManifest`
    - 删除 `renderToString` 第一个参数，之前写的 Vue 实例代码都删了
12. NodeJS 运行 `server.js` 启动应用
