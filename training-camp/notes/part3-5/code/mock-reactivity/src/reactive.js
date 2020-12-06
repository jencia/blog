import { isObject } from './utils.js'
import { track, trigger } from './effect.js'

export function reactive (data) {
    if (!isObject(data)) {
        console.warn(`value cannot be made reactive: ${data}`)
        return data
    }

    return new Proxy(data, {
        get (target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver)
            
            track(target, prop)

            return isObject(value) ? reactive(value) : value
        },
        set (target, prop, value, receiver) {
            const oldValue = Reflect.get(target, prop, receiver)

            if (value === oldValue) {
                return true
            }
            const result = Reflect.set(target, prop, value, receiver)

            trigger(target, prop)

            return result
        },
        deleteProperty (target, prop, receiver) {
            const key = target.hasOwnProperty(prop)
            const result = Reflect.deleteProperty(target, key)

            trigger(target, prop)

            return result
        }
    })
}

export const convert = v => (isObject(v) ? reactive(v) : v)
