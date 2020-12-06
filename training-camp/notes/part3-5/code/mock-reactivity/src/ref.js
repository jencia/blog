import { isObject } from './utils.js'
import { convert } from './reactive.js'
import { track, trigger } from './effect.js'

export function ref (data) {
    if (isObject(data) && data.__v_isRef) {
        return data
    }
    let oldValue = convert(data)

    return {
        __v_isRef: true,
        get value () {
            track(this, 'value')
            return oldValue
        },
        set value (newValue) {
            if (newValue === oldValue) {
                return
            }
            oldValue = convert(newValue)
            trigger(this, 'value')
        }
    }
}

