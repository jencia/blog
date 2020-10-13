import { createApp } from './app'

// 路由钩子函数可能是异步的
export default async context => {
    const { app, router, store } = createApp()
    const meta = app.$meta()    // 在路由设置之前

    // 设置服务端 router 的位置
    router.push(context.url)
    
    context.meta = meta

    await new Promise(router.onReady.bind(router))

    context.rendered = () => {
        // Renderer 会把 context.state 数据对象内联到页面模板中
        // 最终发送给客户端的页面中会包含一段脚本：window.__INITIAL_STATE__ = context.state
        // 客户端就要把页面中的 window.__INITIAL_STATE__ 拿出来填充到客户端 store 容器中
        context.state = store.state
    }

    return app
}