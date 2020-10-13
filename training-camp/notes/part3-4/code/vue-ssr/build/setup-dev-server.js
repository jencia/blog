const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

const resolve = file => path.resolve(__dirname, file)

class DevServer {
    constructor (server, updateCallback) {
        this.server = server
        this.serverBundle = null
        this.template = null
        this.clientManifest = null
        this.updateCallback = updateCallback
    }
    watch () {
        this.watchTemplate()
        this.watchServerBundle()
        this.watchClientManifest()
    }
    update () {
        if (this.serverBundle && this.template && this.clientManifest) {
            this.updateCallback(this.serverBundle, this.template, this.clientManifest)
        }
    }
    watchTemplate () {
        const path = resolve('../index.template.html')
        const setTemplate = () => {
            this.template = fs.readFileSync(path, 'utf-8')
            this.update()
        }

        setTemplate()
        chokidar.watch(path).on('change', setTemplate)
    }

    // 监视构建 serverBundle
    watchServerBundle () {
        const serverConfig = require('./webpack.server.config')
        const serverCompiler = webpack(serverConfig)
        // 使用 devMiddleware 去编译会将结果存在内存，而不是写入磁盘
        const serverDevMiddleware = devMiddleware(serverCompiler, {
            log: 'silent'   // 关闭日志输出
        })

        serverCompiler.hooks.done.tap('server', () => {
            const memFs = serverDevMiddleware.fileSystem    // 用于读取内存文件数据
            const path = resolve('../dist/vue-ssr-server-bundle.json')
            const jsonStr = memFs.readFileSync(path, 'utf-8')
            
            this.serverBundle = JSON.parse(jsonStr)
            this.update()
        })
    }

    // 监视构建 clientManifest
    watchClientManifest () {
        const clientConfig = require('./webpack.client.config')
        const clientCompiler = webpack(clientConfig)
        // 使用 devMiddleware 去编译会将结果存在内存，而不是写入磁盘
        const clientDevMiddleware = devMiddleware(clientCompiler, {
            publicPath: clientConfig.output.publicPath,
            log: 'silent'   // 关闭日志输出
        })

        clientCompiler.hooks.done.tap('client', () => {
            const memFs = clientDevMiddleware.fileSystem    // 用于读取内存文件数据
            const path = resolve('../dist/vue-ssr-client-manifest.json')
            const jsonStr = memFs.readFileSync(path, 'utf-8')
            
            this.clientManifest = JSON.parse(jsonStr)
            this.update()
        })

        // 增加热更新中间件
        this.server.use(hotMiddleware(clientCompiler, { log: false }))

        // 将 clientDevMiddleware 挂载到 Express 服务中，提供对其内部内存中数据的访问
        this.server.use(clientDevMiddleware)
    }
}

module.exports = (server, callback) => new Promise(resolve => {
    const devServer = new DevServer(server, (...options) => {
        resolve()
        callback(...options)
    })

    devServer.watch()
})