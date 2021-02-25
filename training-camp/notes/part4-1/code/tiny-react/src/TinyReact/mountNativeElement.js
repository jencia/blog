import createDOMElement from './createDOMElement'
import mountElement from './mountElement'

export default function mountNativeElement (virtualDOM, container) {
    const newElement = createDOMElement(virtualDOM)

    // 将转化后的DOM放置在页面中
    container.appendChild(newElement)
    
    if (virtualDOM.component) {
        virtualDOM.component.setDOM(newElement)
    }
}