import diff from './diff'

export default class Component {
    constructor (props) {
        this.props = props
    }
    setDOM (dom) {
        this._dom = dom
    }
    getDOM (dom) {
        return this._dom
    }
    setState (state) {
        this.state = Object.assign({}, this.state, state)

        const virtualDOM = this.render()
        const oldDOM = this.getDOM()
        const container = oldDOM.parentNode

        diff(virtualDOM, container, oldDOM)
    }
    updateProps (props) {
        this.props = props
    }

    // 生命周期函数
    componentWillMount() {}
    componentDidMount() {}
    componentWillReceiveProps(nextProps) {}
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps != this.props || nextState != this.state
    }
    componentWillUpdate(nextProps, nextState) {}
    componentDidUpdate(prevProps, preState) {}
    componentWillUnmount() {}
}