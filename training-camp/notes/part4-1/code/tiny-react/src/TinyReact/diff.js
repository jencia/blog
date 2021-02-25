import createDOMElement from './createDOMElement';
import mountElement from './mountElement';
import unmountNode from './unmountNode';
import updateNodeElement from './updateNodeElement';
import updateTextNode from './updateTextNode';
import { isFunction } from './utils';

export default function diff (virtualDOM, container, oldDOM) {
    const oldVirtualDOM = oldDOM && oldDOM._virtualDOM

    // 判断 oldDOM 是否存在
    if (!oldDOM) {
        mountElement(virtualDOM, container)
    } else if (virtualDOM.type !== oldVirtualDOM.type && !isFunction(virtualDOM.type)) {
        const newElement = createDOMElement(virtualDOM)

        // 使用新的 DOM 替换旧 DOM
        oldDOM.parentNode.replaceChild(newElement, oldDOM)
    } else if (virtualDOM.type === oldVirtualDOM.type) {
        if (virtualDOM.type === 'text') {
            // 更新内容
            updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
        } else {
            // 更新元素属性
            updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
        }

        // 对比子节点
        (virtualDOM.children || []).forEach((child, i) => (
            diff(child, oldDOM, oldDOM.childNodes[i])
        ))

        // 删除节点
        // 获取旧节点
        const oldChildNodes = oldDOM.childNodes
        // 判断旧节点的数量
        if (oldChildNodes.length > virtualDOM.children.length) {
            for (
                let i = oldChildNodes.length - 1;
                i > virtualDOM.children.length - 1;
                i--
            ) {
                unmountNode(oldChildNodes[i])
            }
        }
    }
}