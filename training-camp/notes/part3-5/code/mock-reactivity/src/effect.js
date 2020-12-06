let activeEffect

export function effect (callback) {
    activeEffect = callback
    callback()
    activeEffect = null
}

// 依赖收集的数据存储设计：targetMap (WeakMap) => depsMap (Map) => dep (Set) => value (function)
const targetMap = new WeakMap()

// track 函数是将 activeEffect 作为 value 加入 dep 里
export function track (target, prop) {
    if (!activeEffect) return

    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(prop)
    if (!dep) {
        dep = new Set()
        depsMap.set(prop, dep)
    }

    dep.add(activeEffect)
}

// trigger 函数将 dep 里的 value 逐个取出来执行它
export function trigger (target, prop) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return

    const dep = depsMap.get(prop)
    if (!dep) return

    dep.forEach(fn => fn())
}