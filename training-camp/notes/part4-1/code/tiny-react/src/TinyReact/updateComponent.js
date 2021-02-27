import diff from './diff'

export default function updateComponent (virtualDOM, oldComponent, oldDOM, container) {
    oldComponent.componentWillReceiveProps(virtualDOM.props)

    if (oldComponent.shouldComponentUpdate(virtualDOM.props)) {
        // 旧的 props
        let prevProps = oldComponent.props

        oldComponent.componentWillUpdate(virtualDOM.props)
        // 更新组件属性
        oldComponent.updateProps(virtualDOM.props)

        // 获取新的 virtualDOM
        let nextVirtualDOM = oldComponent.render()

        // 更新组件实例
        nextVirtualDOM.component = oldComponent
        // 开始更新
        diff(nextVirtualDOM, container, oldDOM)

        oldComponent.componentDidUpdate(prevProps)
    }
}
