const fs = require('fs')
const { Transform } = require('stream')

exports.default = () => {
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

    read
        .pipe(transform) // 转换
        .pipe(write) // 写入
    
    return read
}
