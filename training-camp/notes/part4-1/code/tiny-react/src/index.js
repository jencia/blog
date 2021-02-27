import TinyReact from './TinyReact'

const virtualDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <h2 data-test="222">(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(观察: 这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert("你好")}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3
    <input type="text" value="23"/>
  </div>
)

const modifyDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <h2 data-test="test222">(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(观察: 这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段被修改的内容</span>
    <button onClick={() => alert("你好！！！")}>点击我</button>
    2, 3
    <input type="text" value="23"/>
  </div>
)

class Alert extends TinyReact.Component {
  constructor (props) {
    super(props)
    this.state = {
      count: 0
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    this.setState({ count: this.state.count + 1 })
  }
  render () {
    return (
      <div>
        <p>{this.state.count}</p>
        <button onClick={this.handleClick}>点我</button>
      </div>
    )
  }
}

class Demo extends TinyReact.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    console.log(this.input.value)
    console.log(this.al)
  }
  render () {
    return (
      <div>
        <input type="text" ref={input => (this.input = input)} />
        <button onClick={this.handleClick}>按钮</button>
        <Alert ref={al => this.al = al} />
      </div>
    )
  }
}

class Li extends TinyReact.Component {
  componentWillUnmount () {
    console.log('componentWillUnmount')
  }
  render () {
    return (
      <li>{this.props.children}</li>
    )
  }
}
// const Li = ({ children }) => (
//   <li>{this.props.children}</li>
// )

class Demo2 extends TinyReact.Component {
  constructor (props) {
    super(props)

    this.state = {
      data: [
        { id: 1, name: 'aaa' },
        { id: 2, name: 'bbb' },
        { id: 3, name: 'ccc' },
        { id: 4, name: 'ddd' },
      ]
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    const data = JSON.parse(JSON.stringify(this.state.data))

    // data.push(data.shift())
    // const nextId = data.length + 1
    // data.splice(1, 0, { id: nextId, name: `new${nextId}` })

    data.pop()

    this.setState({ data })
  }
  render () {
    return (
      <div>
        <ul>
          {this.state.data.map(v => (
            <Li key={v.id}>{v.name}</Li>
          ))}
        </ul>
        <button onClick={this.handleClick}>点我</button>
      </div>
    )
  }
}

const root = document.getElementById('root')

TinyReact.render(<Demo2 />, root)
// TinyReact.render(virtualDOM, root)

// setTimeout(() => {
//   TinyReact.render(<Demo title="2222" />, root)
// }, 2000)