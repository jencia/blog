export function isFunction (virtualDOM) {
    return virtualDOM && typeof virtualDOM.type === 'function'
}

// 是否是函数式组件
export function isFunctionComponent (virtualDOM) {
    if (!isFunction(virtualDOM)) {
        return false 
    }
    return !(virtualDOM.type.prototype && virtualDOM.type.prototype.render)
}

// 判断是否是同一个组件
export function isSameComponent(virtualDOM, oldComponent) {
    return oldComponent && virtualDOM.type === oldComponent.constructor
}