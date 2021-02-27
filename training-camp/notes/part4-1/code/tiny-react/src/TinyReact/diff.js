import createDOMElement from './createDOMElement';
import diffComponent from './diffComponent';
import mountElement from './mountElement';
import unmountNode from './unmountNode';
import updateNodeElement from './updateNodeElement';
import updateTextNode from './updateTextNode';
import { isFunction } from './utils';

export default function diff (virtualDOM, container, oldDOM) {
    const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
    const oldComponent = oldVirtualDOM && oldVirtualDOM.component

    // 判断 oldDOM 是否存在
    if (!oldDOM) {
        mountElement(virtualDOM, container)
    } else if (virtualDOM.type !== oldVirtualDOM.type) {
        // 如果元素类型不是函数，就代表是元素 DOM
        if (!isFunction(virtualDOM)) {
            const newElement = createDOMElement(virtualDOM)

            // 使用新的 DOM 替换旧 DOM
            oldDOM.parentNode.replaceChild(newElement, oldDOM)
        } else {
            diffComponent(virtualDOM, oldComponent, oldDOM, container)
        }
    } else if (virtualDOM.type === oldVirtualDOM.type) {
        if (virtualDOM.type === 'text') {
            // 更新内容
            updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
        } else {
            // 更新元素属性
            updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
        }

        // 将拥有 key 属性的子元素放置在一个单独的对象中
        const keyedElements = {}
        const oldChildNodes = oldDOM.childNodes
        
        for (let i = 0, len = oldChildNodes.length; i < len; i++) {
            const domElement = oldChildNodes[i]
            if (domElement.nodeType === 1) {
                const key = domElement.getAttribute('key')

                if (key) {
                    keyedElements[key] = domElement
                }
            }
        }

        const hasNoKey = Object.keys(keyedElements).length === 0

        if (hasNoKey) {
            // 对比子节点
            (virtualDOM.children || []).forEach((child, i) => (
                diff(child, oldDOM, oldDOM.childNodes[i])
            ))
        } else {
            // 循环 VirtualDOM 的子元素获取子元素的 key 属性
            virtualDOM.children.forEach((child, i) => {
                const key = child.props.key

                if (!key) {
                    mountElement(child, oldDOM, oldDOM.childNodes[i])
                    return
                }
                const domElement = keyedElements[key]

                if (domElement) {
                    // 看看当前位置的元素是不是我们期望的元素，如果不是，就将期望的元素移动到当前位置
                    if (oldChildNodes[i] && oldChildNodes[i] !== domElement) {
                        oldDOM.insertBefore(domElement, oldChildNodes[i])
                    }
                } else {
                    mountElement(child, oldDOM, oldChildNodes[i])
                }
            })
        }


        // 删除节点
        // 判断旧节点的数量
        if (oldChildNodes.length > virtualDOM.children.length) {
            if (hasNoKey) {
                for (
                    let i = oldChildNodes.length - 1;
                    i > virtualDOM.children.length - 1;
                    i--
                ) {
                    unmountNode(oldChildNodes[i])
                }
            } else {
                for (let i = 0, len = oldChildNodes.length; i < len; i++) {
                    const oldChild = oldChildNodes[i]
                    const oldKey = oldChild._virtualDOM.props.key
                    let found = false
        
                    for (let j = 0; j < virtualDOM.children.length; j++) {
                        if (oldKey === virtualDOM.children[j].props.key) {
                            found = true
                        }
                    }

                    if (!found) {
                        unmountNode(oldChild)
                    }
                }
            }
        }
    }
}