# Vue 2.x 学习

## 基础

### 安装

Vue 不支持 IE8 及以下版本

版本发布遵循 [语义化版本控制](https://github.com/vuejs/vue/releases) ，其变更会描述在[发布说明](https://github.com/vuejs/vue/releases)中。

浏览器开发工具：[Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools)

vue.js 文件下载：[开发版本](https://cn.vuejs.org/js/vue.js)、[生产版本](https://cn.vuejs.org/js/vue.min.js)

最新版本 CDN ：https://cdn.jsdelivr.net/npm/vue/dist/vue.js

指定版本 CDN ：https://cdn.jsdelivr.net/npm/vue@2.6.11

ESM 导入：

```html
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
</script>
```

NPM 安装：

```sh
$ npm install vue
```

命令行工具（CLI）：[vue-cli](https://github.com/vuejs/vue-cli) 、[文档](https://cli.vuejs.org/zh/)

NPM 包不同版本的差异对比：

|    | UMD | CommonJS | ES Module (基于构建工具使用) | ES Module (直接用于浏览器) |
| -- | --- | -------- | ------------------------- | ----------------------- |
| 完整版 | vue.js | vue.common.js | vue.esm.js | vue.esm.browser.js |
| 只包含运行时版 | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js | - |
| 完整版 (生产环境) | vue.min.js | - | - | vue.esm.browser.min.js |
| 只包含运行时版 (生产环境) | vue.runtime.min.js | - | - | - |

完整版 = 编译器 + 运行时

- 编译器：将 vue 里 es5 无法识别的代码转成 es5 代码
- 运行时：除编译器以外的工作

UMD 是直接在浏览器通过 `<script>` 标签直接引入的

CommonJS 和 ES Module 版本里有对 `process.env.NODE_ENV` 的检测，所以构建工具需要包含这个环境变量的定义。

### 介绍

这边不使用 CLI ，也不用构建工具，就用原始的 UMD 的方式，这样才能更清楚 vue 的开发模式。

#### 起步

创建 `.html` 文件，引入 CDN 文件：

```html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

#### 声明式渲染

```html
<div id="app">
    {{ message }}
</div>
<script>
var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
})
</script>
```

- el 绑定 dom 元素
- data 定义数据
- 双大括号（`{{ }}`）绑定数据

这数据是响应式的，打开浏览器控制台，输入 `app.message = 'test'` 改变了数据，界面也会跟着改变。

```html
<div id="app-2">
  <span v-bind:title="message">
    鼠标悬停几秒钟查看此处动态绑定的提示信息！
  </span>
</div>
<script>
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: '页面加载于 ' + new Date().toLocaleString()
  }
})
</script>
```

数据的绑定也可以用在属性上，在属性前面加上 `v-bind:` ，这种同样是响应式的数据。

#### 条件与循环

```html
<div id="app-3">
    <p v-if="seen">现在你看到我了</p>
</div>
<script>
    var app3 = new Vue({
        el: '#app-3',
        data: {
            seen: true
        }
    })
</script>
```

条件语句 v-if 指令，值也是响应式的，在控制台执行 `app3.seen = false`  后内容就会隐藏。

```html
<div id="app-4">
    <ol>
        <li v-for="todo in todos">
            {{ todo.text }}
        </li>
    </ol>
</div>
<script>
    var app4 = new Vue({
        el: '#app-4',
        data: {
            todos: [
                { text: '学习 JavaScript' },
                { text: '学习 Vue' },
                { text: '整个牛项目' },
            ]
        }
    })
</script>
```

循环语句使用 v-for 指令，遍历 todos 数组，todo 为每次遍历的元素。同样也支持响应式，控制台执行 `app4.todos.push({ text: '新项目' })`  后就会多一条数据。

#### 处理用户输入

```html
<div id="app-5">
    <p>{{ message }}</p>
    <button v-on:click="reverseMessage">反转消息</button>
</div>
<script>
    var app5 = new Vue({
        el: '#app-5',
        data: {
            message: 'Hello Vue.js!'
        },
        methods: {
            reverseMessage: function () {
                this.message = this.message.split('').reverse().join('')
            }
        }
    })
</script>
```

使用 v-on 绑定事件，`v-on:click` 绑定点击事件。方法定义在 methods 里。

```html
<div id="app-6">
    <p>{{ message }}</p>
    <input v-model="message">
</div>
<script>
    var app6 = new Vue({
        el: '#app-6',
        data: {
            message: 'Hello Vue.js'
        }
    })
</script>
```

使用 v-model 实现双向数据绑定。

#### 组件化

```html
<div id="app-7">
    <ol>
        <todo-item
            v-for="item in groceryList"
            v-bind:todo="item"
            v-bind:key="item.id"
        >
    </ol>
</div>
<script>
    Vue.component('todo-item', {
        props: ['todo'],
        template: '<li>{{ todo.text }}</li>'
    })
    var app7 = new Vue({
        el: '#app-7',
        data: {
            groceryList: [
                { id: 0, text: '蔬菜' },
                { id: 1, text: '奶酪' },
                { id: 2, text: '随便其它什么人吃的东西' }
            ]
        }
    })
</script>
```

使用 Vue.component 定义组件，第一参数是组件名，第二个参数是组件配置。组件内用到的属性都定义在 props 上，template 定义组件内容。使用组件的时候跟普通 dom 元素的没什么区别。

### Vue 实例

### 数据与方法

```js
// 我们的数据对象
var data = { a: 1 }

// 该对象被加入到一个 Vue 实例中
var vm = new Vue({
  data: data
})

// 获得这个实例上的 property
// 返回源数据中对应的字段
vm.a === data.a // true

// 设置 property 也会影响到原始数据
vm.a = 2
data.a // 2

// ……反之亦然
data.a = 3
vm.a // 3
```

当这些数据改变时，视图会进行重渲染。前提是这些属性在实例被创建时就已经存在于 data 中，可能一开始并不知道值是多少，这种情况一般是设置初始值。

想要让响应式系统无法运行、无法追踪数据的变化的话，可以使用 Object.freeze() ：

```js
var data = { a: 1 }

Object.freeze(data)
new Vue({
    el: '#app',
    data: data
})
```

Vue 实例除了可以拿到 data 数据，还能拿到其他数据：

```js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch 是一个实例方法
vm.$watch('a', function (newValue, oldValue) {
  // 这个回调将在 `vm.a` 改变后调用
})
```

#### 生命周期

![](https://cn.vuejs.org/images/lifecycle.png)

```js
new Vue({
    data: {
        a: 1
    },
    created: function () {
        // 实例创建完成
    }
    mounted: function () {
        // 渲染完成
    }
})
```

注意：配置属性或者回调函数不能用箭头函数，比如生命周期函数、$watch 回调函数。

### 模板语法

```html
<div id="app">
    <p>{{ message }}</p>
    <!-- 固定展示第一次数据 -->
    <p v-once>{{ message }}</p>

    <p>Using mustaches: {{ rawHtml }}</p>
    <!-- 渲染 html 内容 -->
    <p>Using v-html directive: <span v-html="rawHtml"></span></p>

    <!-- 可传入表达式 -->
    <p>{{ 1 + 2 * 4 + 2 ** 10 }}</p>
    <p>{{ true ? 'true' : 'false' }}</p>
    <p :title="Math.random()">{{ message.split('').reverse().join('') }}</p>

    <!-- 属性绑定和简写方式 -->
    <button v-bind:disabled="disabled">Button</button>
    <button :disabled="disabled">Button</button>

    <!-- 事件绑定和简写方式 -->
    <button v-on:click="seen = !seen">{{ seen ? '隐藏' : '显示' }}</button>
    <button @click="toggle">{{ seen ? '隐藏' : '显示' }}</button>
    <!-- 条件语句 -->
    <p v-if="seen">现在你看到我了</p>

    <!-- 动态参数名字不能用大写和横杆，不能传表达式 -->
    <p :[my_attr]="message">动态参数</p>

    <!-- 修饰符，但键盘按下回车键才触发事件 -->
    <input v-model="text" @keyup.enter="query">
</div>

<script>
    var vm = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue.js!',
            rawHtml: '<span style="color: red">This should</span>',
            disabled: true,
            seen: true,
            my_attr: 'title',
            text: ''
        },
        methods: {
            toggle () {
                this.seen = !this.seen;
            },
            query (e) {
                console.log(e.target.value)
            }
        }
    })
</script>
```

### 计算属性和侦听器

```html
<div id="app">
    <p>{{ message }}</p>
    <p>{{ reversedMessage }}</p>
</div>

<script>
    var vm = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue.js!'
        },
        computed: {
            reversedMessage: function () {
                return this.message.split('').reverse().join('')
            }
        }
    })
</script>
```

计算属性都放在 computed 里，类似于 class 里面的 getter ，定义的时候是一个方法，使用的时候是写方法名。这边的计算属性 reversedMessage 依赖于 message ，message 改变了 reversedMessage 也会跟着变。其实用 methods 也能达到同样的效果，区别在于 methods 每次重新渲染都会去执行，而 computed 只执行一次，只有 依赖属性改变了才会再次执行。

computed 默认是 getter ，也可以设置 setter：

```html
<div id="app">
    <p>{{ message }}</p>
    <p>{{ reversedMessage }}</p>
</div>

<script>
    var vm = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue.js!'
        },
        computed: {
            reversedMessage: {
                get: function () {
                    return this.message.split('').reverse().join('')
                },
                set: function (newValue) {
                    this.message = newValue.split('').reverse().join('')
                }
            }
        }
    })
</script>
```

设置了 setter ，再去改变 reversedMessage 的值，message 就会反过来跟着改变。

侦听器就是设置 watch 属性：

```html
<div id="app">
    <p>{{ message }}</p>
    <p>{{ person.tom }}</p>
</div>

<script>
    var vm = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue.js!',
            person: {
                name: 'tom'
            }
        },
        watch: {
            message: function (newValue, oldValue) {
                console.log('watch message')
            },
            person: function (newValue, oldValue) {
                console.log('watch person')
                // 注意：这样写如果 person.name 改变了是无法侦听到的。
            },
            'person.name': function (newValue, oldValue) {
                console.log('watch person.name')
            }
        }
    })
</script>
```
