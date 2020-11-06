// 模拟 ajax 请求接口
function ajax (n) {
    return Promise.resolve({ n })
}

// 模拟 async/await 实现
function co (main) {
    const g = main()

    function handleResult (res) {
        if (res.done) return
        res.value.then(rs => {
            handleResult(g.next(rs))
        })
    }
    handleResult(g.next())
}

// 主体代码
function * test () {
    const data1 = yield ajax(1)
    console.log(data1)

    const data2 = yield ajax(2)
    console.log(data2)

}

// 运行函数
co(test)
