const fs = require('fs')

// 回调写法
exports.callback = done => {
    console.log('callback task~')
    done()
}
exports.callback_error = done => {
    console.log('callback task~')
    done(new Error('task failed!'))
}

// promise 写法
exports.promise = () => {
    console.log('promise task~')
    return Promise.resolve()
}
exports.promise_error = () => {
    console.log('promise task~')
    return Promise.reject(new Error('task failed!'))
}
exports.promise2 = () => new Promise((resolve, reject) => {
    try {
        setTimeout(() => {
            console.log('promise task~')
            resolve('success')
        }, 1000)
    } catch (error) {
        reject(error)
    }
})

// async/await 写法
const timeout = time => {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}
exports.async = async () => {
    await timeout(1000)
    console.log('async task~')
}

// stream 写法
exports.stream = done => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('temp.txt')

    readStream.pipe(writeStream)

    // 标记完成写法一
    // readStream.on('end', () => {
    //     done();
    // })

    // 标记完成写法二
    return readStream
}