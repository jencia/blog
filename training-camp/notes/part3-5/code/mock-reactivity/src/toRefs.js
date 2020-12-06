import { ref } from './ref.js'
import { isObject } from './utils.js'

export function toRefs (proxy) {
    if (!isObject) {
        console.warn('toRefs() expects a reactive object but received a plain one.')
        return
    }
    const result = Array.isArray(proxy) ? [] : {}

    for (const key in proxy) {
        result[key] = {
            __v_isRef: true,
            // 这里不需要收集依赖，因为代理对象有 getter 和 setter 了，访问代理对象的数据自动会触发
            get value () {
                return proxy[key]
            },
            set value (newValue) {
                proxy[key] = newValue
            }
        }
    }
    return result
}
