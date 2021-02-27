import mountElement from './mountElement';
import updateComponent from './updateComponent';
import { isSameComponent } from './utils';

export default function diffComponent (virtualDOM, oldComponent, oldDOM, container) {
    if (isSameComponent(virtualDOM, oldComponent)) {
        // 同一个组件
        updateComponent(virtualDOM, oldComponent, oldDOM, container)
    } else {
        // 不同组件
        mountElement(virtualDOM, container, oldDOM)
    }
}

