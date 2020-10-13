const fs = require('fs')
const express = require('express')
const Vue = require('vue')
const { createBundleRenderer } = require('vue-server-renderer')
const setupDevServer = require('./build/setup-dev-server')

const dev = process.env.NODE_ENV === 'development'
const server = express()
let renderer, onReady

server.use('/dist', express.static('./dist'))

if (dev) {
    // 开发环境
    // 监视打包构建 -> 重新生成 Renderer 渲染器
    onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
        renderer = createBundleRenderer(serverBundle, { template, clientManifest })
    })
} else {
    // 生产环境
    const template = fs.readFileSync('./index.template.html', 'utf-8')
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    
    renderer = createBundleRenderer(serverBundle, {
        template,
        clientManifest
    })
}

const render = async (req, res) => {
    try {
        const html = await renderer.renderToString({
            title: '标题',
            meta: '<meta name="description" content="这是一段描述" />',
            url: req.url
        });

        res.setHeader('Content-Type', 'text/html; charset=utf8')
        res.end(html)
    } catch (err) {
        res.status(500).end(err.message)
    }
}

server.get('*', !dev ? render : async (req, res) => {
    await onReady
    render(req, res)
})

server.listen(3000, () => console.log('server running at http://localhost:3000'))