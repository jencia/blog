import { h, init } from 'snabbdom'

// 2. div 中放置子元素 h1, p
let patch = init([])

let vnode = h('div#container', [
    h('h1', 'Hello Snabbdom'),
    h('p', '这是一个 p 标签')
])

let app = document.querySelector('#app')

let oldVnode = patch(app, vnode)

setTimeout(() => {
    vnode = h('div#container', [
        h('h1', 'Hello World'),
        h('p', 'Hello P')
    ])
    patch(oldVnode, vnode)

    // 清空页面元素 -- 错误做法
    // patch(oldVnode, null)
    // 正常做法
    patch(oldVnode, h('!'))
}, 2000)
