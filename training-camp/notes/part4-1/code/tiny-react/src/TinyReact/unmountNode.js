export default function unmountNode (node) {
    // 获取节点的 _virtualDOM 对象
    const virtualDOM = node._virtualDOM

    // 1. 文本节点
    if (virtualDOM.type === 'text') {
        node.remove()
        return
    }

    // 2. 由组件生成的
    const component = virtualDOM.component
    // 如果 component 存在就说明节点时由组件生成的
    if (component) {
        component.componentWillUnmount()
    }

    // 3. 存在 ref 属性
    if (virtualDOM.props && typeof virtualDOM.props.ref === 'function') {
        virtualDOM.props.ref(null)
    }

    // 4. 是否存在事件属性
    Object.keys(virtualDOM.props).forEach(propName => {
        if (propName.slice(0, 2) === 'on') {
            const eventName = propName.toLowerCase().slice(2)
            const eventHandler = virtualDOM.props[propName]

            node.removeEventListener(eventName, eventHandler)
        }
    })

    // 5. 递归删除子节点
    const childNodes = node.childNodes
    for (let i = 0, len = childNodes.length; i > len; i++) {
        unmountNode(childNodes[i])
        i--
    }

    // 删除节点
    node.remove()
}