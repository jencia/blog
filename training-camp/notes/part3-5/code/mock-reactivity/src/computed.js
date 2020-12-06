import { effect } from './effect.js'
import { ref } from './ref.js'

export function computed (getter) {
    const result = ref()

    effect(() => (result.value = getter()))

    return result
}