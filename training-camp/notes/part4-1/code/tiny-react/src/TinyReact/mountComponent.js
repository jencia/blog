import mountElement from './mountElement';
import { isFunctionComponent } from './utils';

export default function mountComponent (virtualDOM, container, oldDOM) {
    let nextVirtualDOM = null
    let component = null

    if (isFunctionComponent(virtualDOM)) {
        // 处理函数式组件
        nextVirtualDOM = buildFunctionComponent(virtualDOM)
    } else {
        // 处理类组件
        nextVirtualDOM = buildClassComponent(virtualDOM)
        component = nextVirtualDOM.component
    }

    mountElement(nextVirtualDOM, container, oldDOM)

    if (component) {
        component.componentDidMount()
        if (component.props && typeof component.props.ref === 'function') {
            component.props.ref(component)
        }
    }
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