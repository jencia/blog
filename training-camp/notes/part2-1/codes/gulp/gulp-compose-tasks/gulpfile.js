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

// 串行任务，按顺序执行 3 个任务
exports.foo = series(task1, task2, task3)

// 并行任务，同时执行 3 个任务
exports.bar = parallel(task1, task2, task3)
