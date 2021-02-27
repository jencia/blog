import createDOMElement from './createDOMElement'
import mountElement from './mountElement'
import unmountNode from './unmountNode'

export default function mountNativeElement (virtualDOM, container, oldDOM) {
    const newElement = createDOMElement(virtualDOM)

    // 将转化后的DOM放置在页面中
    if (oldDOM) {
        container.insertBefore(newElement, oldDOM)
    } else {
        container.appendChild(newElement)
    }
    
    // 判断旧的 DOM 对象是否存在，存在就删除
    if (oldDOM) {
        unmountNode(oldDOM)
    }

    // 如果存在 component ，意味着这是类组件进来的，需要传递 DOM 给组件实例
    if (virtualDOM.component) {
        virtualDOM.component.setDOM(newElement)
    }
}