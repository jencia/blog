import mountElement from './mountElement';
import { isFunctionComponent } from './utils';

export default function mountComponent (virtualDOM, container) {
    let nextVirtualDOM = null

    if (isFunctionComponent(virtualDOM)) {
        // 处理函数式组件
        nextVirtualDOM = buildFunctionComponent(virtualDOM)
    } else {
        // 处理类组件
        nextVirtualDOM = buildClassComponent(virtualDOM)
    }
    mountElement(nextVirtualDOM, container)
}

// 构建函数式组件
function buildFunctionComponent (virtualDOM) {
    return virtualDOM.type(virtualDOM.props || {})
}

// 构建类组件
function buildClassComponent (virtualDOM) {
    const component = new virtualDOM.type(virtualDOM.props)
    const nextVirtualDOM = component.render()

    nextVirtualDOM.component = component
    return nextVirtualDOM
}