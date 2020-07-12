// gulp 的入口文件

exports.foo = done => {
    console.log('foo task working~')
    done()  // 标识任务完成
}

exports.default = done => {
    console.log('default task working~')
    done()
}

const gulp = require('gulp')

gulp.task('bar', done => {
    console.log('bar task working~')
    done()
})
