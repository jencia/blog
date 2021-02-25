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