const fs = require('fs')
const express = require('express')
const art = require('art-template')

const app = express()

app.get('/', (req, res) => {
    // 1. 获取页面模板
    const template = fs.readFileSync('./template.html', 'utf-8')
    // 2. 获取数据
    const data = require('./data.json')
    // 3. 渲染：模板 + 数据 = 最终结果
    const html = art.render(template, data)

    // 4. 把渲染结果发送给客户端
    res.end(html)
})
app.listen(3000, () => {
    console.log('server running at http://localhost:3000')
})