// 可迭代对象实现
const obj = {
    data: ['foo', 'bar', 'baz'],
    [Symbol.iterator] () {
        let index = 0;

        return {
            next: () => ({
                value: this.data[index],
                done: index++ >= this.data.length
            })
        }
    }
}

// 遍历可迭代对象
for (const value of obj) {
    console.log(value)
}

// 模拟 for…of 实现
function each (obj, callback) {
    const ite = obj[Symbol.iterator]()
    const handleFn = rs => {
        if (rs.done) return
        callback(rs.value)
        handleFn(ite.next())
    }
    
    handleFn(ite.next())
}

each(obj, value => {
    console.log(value)
})