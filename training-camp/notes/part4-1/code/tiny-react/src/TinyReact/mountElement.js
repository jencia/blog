import mountNativeElement from './mountNativeElement';
import { isFunction } from './utils';
import mountComponent from './mountComponent'

export default function mountElement (virtualDOM, container, oldDOM) {
    if (isFunction(virtualDOM)) {
        mountComponent(virtualDOM, container, oldDOM)
    } else {
        mountNativeElement(virtualDOM, container, oldDOM)
    }
}