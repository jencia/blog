# JSX 到底是什么

JSX 最终会被转化 createElement 的调用，例如

```html
<div className="container">
    <h3>Hello React</h3>
    <p>React is great</p>
</div>
```

会被转化为以下代码

```js
React.createElement(
    'div',
    {
        className: 'container'
    },
    React.createElement('h3', null, 'Hello React'),
    React.createElement('p', null, 'React is great')
)
```

[babel repl](https://babeljs.io/repl)

# VirtualDOM介绍

JavaScript 操作 DOM 对象的速度比操作普通对象慢得多，VirtualDOM 为了提高操作 DOM 对象的效率。

每个 DOM 对应一个 VirtualDOM 对象，VirtualDOM 对象是描述 DOM 对象信息，例如：

```html
<div className="container">
  <h3>Hello React</h3>
  <p>React is great </p>
</div>
```

最终会转为这样对象：

```js
{
  type: "div",
  props: { className: "container" },
  children: [
    {
      type: "h3",
      props: null,
      children: [
        {
          type: "text",
          props: {
            textContent: "Hello React"
          }
        }
      ]
    },
    {
      type: "p",
      props: null,
      children: [
        {
          type: "text",
          props: {
            textContent: "React is great"
          }
        }
      ]
    }
  ]
}
```

VirtualDOM 之所以能提升效率，是因为使用 VirtualDOM 能精准找出发生变化的 DOM 对象，只更新发生变化的部分。

- React 在首次创建 DOM 时，会为每个 DOM 对象创建对应的 VirtualDOM 对象
- 发生变化时先更新 VirtualDOM，
- 对 VirtualDOM 新旧值做比较，找出发生变化的部分
- 将变化的部分更新到真实 DOM。

# 创建 VirtualDOM 对象

默认 JSX 会被转化为 `React.createElement` 的调用，现在我们要自己开发一个小型 React，叫 TinyReact，那就要改成将 JSX 转成 `TinyReact.Element` 的调用，就需要调整 Babel 配置。

局部的方式：文件头部加上一行注释

```js
/** @jsx TinyReact.createElement */
```

全局的方式：修改 .babelrc 文件

```diff
{
    "presets": [
        "@babel/preset-env",
        [
            "@babel/preset-react",
+           {
+               "pragma": "TinyReact.createElement"
+           }
        ]
    ]
}
```

创建最基本的 createElement

```js
function createElement (type, props, ...children) {
    return {
        type,
        props,
        children
    }
}
```

其中有几点要注意的：

- children 里面存的有可能是文本节点，文本节点要转化为 `{ type: 'text', props: { textContent: '内容' } }`
- children 里面可能存在判断语句，返回布尔值或者 `null` 应该过滤掉
- children 的值也存在于 props 中

改完后：

```js
export default function createElement (type, props, ...children) {
    const childElement = [].concat(children)
        .filter(child => ![false, true, null].includes(child))
        .map(child => {
            if (child instanceof Object) {
                return child
            }
            return createElement('text', { textContent: child })
        })

    return {
        type,
        props: Object.assign({ children: childElement }, props),
        children: childElement
    }
}
```

# VirtualDOM 转为真实DOM

html 里添加一个元素作为容器节点，virtualDOM 将渲染在这个容器里。

创建 render 方法

```js
function render (virtualDOM, container, oldDOM) {
    // 调用 diff 算法对比
    diff(virtualDOM, container, oldDOM)
}
```

创建 diff 方法

```js
function diff (virtualDOM, container, oldDOM) {
    // 如果不存在旧的 DOM，就直接渲染，否则对比差异
    if (!oldDOM) {
        mountElement(virtualDOM, container)
    }
}
```

创建 mountElement 文件

```js
function mountElement (virtualDOM, container) {
    // virtualDOM 可能是 DOM 元素，也可能是组件
    // 先考虑 DOM 元素的情况
    mountNativeElement(virtualDOM, container)
}
```

创建 mountNativeElement 文件

```js
function mountNativeElement (virtualDOM, container) {
    let newElement = null

    if (virtualDOM.type === 'text') {
        // 文本节点
        newElement = document.createTextNode(virtualDOM.props.textContent)
    } else {
        // 元素节点
        newElement = document.createElement(virtualDOM.type)
    }

    virtualDOM.children.forEach(child => {
        mountElement(child, newElement)
    })

    container.appendChild(newElement)
}
```
