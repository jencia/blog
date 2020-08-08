import Dep from './dep'

export default class Observer {
    constructor (data) {
        this.walk(data)
    }
    // 数据劫持
    walk (data) {
        // 1. 判断 data 是否是对象
        if (!data || typeof data !== 'object') {
            return
        }
        // 2. 遍历 data 对象的所有属性
        Object.keys(data).forEach(key => {
            this.definedReactive(data, key, data[key])
        })
    }
    // 将数据定义响应式数据
    definedReactive (obj, key, val) {
        const that = this
        // 负责收集依赖，并发送通知
        const dep = new Dep()
        
        // 如果 val 是对象，把 val 内部的数据也转换为响应式数据
        this.walk(val)

        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get () {
                // 收集依赖
                Dep.target && dep.addSub(Dep.target)
                return val
            },
            set (newValue) {
                if (newValue === val) {
                    return
                }
                val = newValue
                that.walk(newValue)
                // 发送通知
                dep.notify()
            }
        })
    }
}