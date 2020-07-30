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

### Class 与 Style 绑定

#### Class 绑定

```html
<div id="app">
	<div
         class="static"
         v-bind:class="[{ active: isActive, 'text-danger': hasError }]"
    />
	<!-- <div v-bind:class="static active"></div> -->
    
    <div :class="classObject" />
    <div :class="['foo', 'bar', { active: isActive }, isActive ? 'active' : '']" />
</div>
<script>
	new Vue({
        el: '#app',
        data: {
            classObject: {
                active: true,
                'text-danger': false
            }
        },
        classObject: function () {
            return {
                active: this.isActive && !this.error,
                'text-danger': this.error && this.error.type === 'fatal'
            }
        }
    })
</script>
```

```html
<my-component class="baz boo"></my-component>
<!-- <p class="foo bar baz boo">Hi</p> -->

<script>
    Vue.component('my-component', {
      template: '<p class="foo bar">Hi</p>'
    })
</script>
```

#### Style 绑定

```html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

<div :style="[style1, style2]"></div>

<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

### 条件渲染

```html
<div v-if="status === '1'">
	<p>11111</p>
    <input placeholder="1111" key="1">
</div>
<div v-else-if="status === '2'">
	<p>22222</p>
    <input placeholder="2222" key="2">
</div>
<div v-else>
	<p>other</p>
</div>
```

各个条件语句切换时，相同元素会复用，只会改变属性值，而 value 值会保留。不想复用元素的话就给他们设置不同的 key 属性。

```html
<div v-show="visible">展示</div>
```

v-show 是切换 display 属性，而 v-if 是判断是否渲染

### 列表渲染

```html
<div id="app">
    <div v-if="status === '1'">
        <p>11111</p>
        <input placeholder="1111" key="1">
    </div>
    <div v-else-if="status === '2'">
        <p>22222</p>
        <input placeholder="2222" key="2">
    </div>
    <div v-else>
        <p>other</p>
    </div>

    <div v-show="status === '2'">v-show</div>

    <ul>
        <li v-for="item in items" :key="item.message">
            {{ item.message }}
        </li>
    </ul>
    <ul>
        <!-- 能接收 index -->
        <li v-for="(item, index) in items" :key="item.message">
            {{ item.message }}
        </li>
    </ul>
    <ul>
        <!-- 可传入 computed 值 -->
        <li v-for="msg in msgList" :key="msg">
            {{ msg }}
        </li>
    </ul>
    <ul>
        <!-- 可遍历对象 -->
        <li v-for="(value, key, index) in obj" :key="key">
            ({{ index }}) {{ key }} : {{ value }}
        </li>
    </ul>
    <p>
        <!-- 可遍历数字，返回 1 到 10 -->
        <span v-for="n in 10" :key="n">{{ n }}</span><br />

        <!-- v-for 和 v-if 同时时候时 v-for 优先级更高，v-if 能拿到 v-for 传过来的值 -->
        <span v-for="n in 10" v-if="n < 6" :key="n">{{ n }}</span>
    </p>
    <ul>
        <!-- 组件遍历无法自动将 msg 和 index 传进去，得明确指定那些传入哪些 -->
        <my-component
            v-for="(msg, index) in msgList"
            :item="msg"
            :index="index"
            :key="msg"
        />
    </ul>
    <ul>
        <!-- 组件可使用 is ，可避开一些潜在的浏览器解析错误 -->
        <li
            is="my-component"
            v-for="(msg, index) in msgList"
            :item="msg"
            :index="index"
            :key="msg"
        />
    </ul>
</div>
<script>
var example1 = new Vue({
    el: '#example-1',
    data: {
        items: [
            { message: 'Foo' },
            { message: 'Bar' }
        ],
        obj: {
            name: 'tom',
            age: 26
        }
    }
})
</script>
```

### 事件处理

```html
<div id="app">
    <!-- 可以直接写触发语句 -->
    <button @click="count += 1">+ 1</button>

    <!-- 也可以绑定函数，函数定义在 methods 里 -->
    <button @click="inc">+ 1</button>

    <!-- 也可以作为语句执行这个函数 -->
    <button @click="inc()">+ 1</button>

    <!-- 可传入事件对象 $event -->
    <button @click="inc(true, $event)">+ 2</button>

    <p>count: {{ count }} </p>
</div>

<script>
    var vm = new Vue({
        el: '#app',
        data: {
            count: 0
        },
        methods: {
            inc: function (isCustom, e) {
                if (!isCustom) {
                    this.count += 1
                } else {
                    var text = e.target.innerText;
                    var num = text.match(/(\d+)/)[1];

                    this.count += +num;
                }
            }
        }
    })
</script>
```

事件修饰符

```html
<!-- 阻止单击事件继续传播 -->
<a @click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a @click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form @submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div @click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div @click.self="doThat">...</div>

<!-- 点击事件将只会触发一次，这个修饰符对组件也有效 -->
<a v-on:click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发，而不会等待 `onScroll` 完成 -->
<!-- 用于优化性能，会忽略 .prevent 和 event.preventDefault()  -->
<div v-on:scroll.passive="onScroll">...</div>
```

> 使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 v-on:click.prevent.self 会阻止所有的点击，而 v-on:click.self.prevent 只会阻止对元素自身的点击。

按键修饰符

```html
<!-- 按了回车键触发，key 值为 Enter 或者 keyCode 值为 13 -->
<input @keyup.enter="query">
<input @keyup.13="query">

<!-- key 值为 PageDown 匹配全小写横杆的 page-down -->
<input @keyup.page-down="query">
```

常用的别名：

- `.enter`
- `.tab`
- `.delete` (捕获“删除”和“退格”键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

可全局设置自定义别名

```js
// 可以使用 `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```

系统修饰键：

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

```html
<!-- Alt + C -->
<input v-on:keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div v-on:click.ctrl="doSomething">Do something</div>

<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button v-on:click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button v-on:click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button v-on:click.exact="onClick">A</button>
```

鼠标修饰符：

- `.left`
- `.right`
- `.middle`

### 表单输入绑定

使用 v-model 在表单上实现双向数据绑定，v-model 会忽略表单元素原本的初始值，使用绑定的数据。

v-model 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

- text 和 textarea 元素使用 value property 和 input 事件；
- checkbox 和 radio 使用 checked property 和 change 事件；
- select 字段将 value 作为 prop 并将 change 作为事件。

```html
<input v-model="searchText">
<!-- 等价于 -->
<input
    v-bind:value="searchText"
    v-on:input="searchText = $event.target.value"
>
```

各个表单的用法：

```html
<p>----------- input ------------</p>
<input v-model="msg">
<p>{{ msg }}</p>

<p>---------- textarea ----------</p>
<textarea v-model="text"></textarea>
<p style="white-space: pre-wrap">{{ text }}</p>

<p>---------- checkbox ----------</p>
<!-- 单个的值默认 true 和 false -->
<input type="checkbox" id="checkbox1" v-model="checked1">
<label for="checkbox1">{{ checked1 }}</label>
<br />

<!-- 值可改为 on 和 off -->
<input type="checkbox" id="checkbox2" v-model="checked2" true-value="on" false-value="off">
<label for="checkbox2">{{ checked2 }}</label>
<br />

<!-- 多个 checkbox 绑定同一个 v-model ，值为数组，选中了取 value 值 -->
<input type="checkbox" id="jack" value="Jack" v-model="multiChecked">
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model="multiChecked">
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model="multiChecked">
<label for="mike">Mike</label>
<br>
<span>Checked names: {{ multiChecked }}</span>

<p>---------- select ------------</p>
<div id="example-5">
    <select v-model="selected">
        <option value="">请选择</option>
        <option value="1">A</option>
        <option :value="'2'">B</option>
        <!-- 值可为对象 -->
        <option :value="{ name: 'tom' }">C</option>
    </select>
    <span>Selected: {{ selected }}</span>
</div>
```

修饰符：

- `.lazy`

    在默认情况下，v-model 在每次 input 事件触发后将输入框的值与数据进行同步 (除了上述输入法组合文字时)。你可以添加 lazy 修饰符，从而转为在 change 事件_之后_进行同步：

    ```html
    <!-- 在“change”时而非“input”时更新 -->
    <input v-model.lazy="msg">
    ```

- `.number`

    如果想自动将用户的输入值转为数值类型，可以给 v-model 添加 number 修饰符：

    ```html
    <input v-model.number="age" type="number">
    ```
    这通常很有用，因为即使在 type="number" 时，HTML 输入元素的值也总会返回字符串。如果这个值无法被 parseFloat() 解析，则会返回原始的值。

- `.trim`

    如果要自动过滤用户输入的首尾空白字符，可以给 v-model 添加 trim 修饰符：

    ```html
    <input v-model.trim="msg">
    ```

### 组件基础

```html
<div id="app">
    <my-comp
        v-for="(title, index) in ['foo', 'bar', 'baz']"
        :key="title"
        :title="title"
        @update="setTotal"
    >
        {{ index }}
    </my-comp>
    <p>total: {{ total }}</p>
    <p>最新动态：{{ log }}</p>
</div>

<script>
    Vue.component('my-comp', {
        // 接收父类传来的属性
        props: ['title'],
        // data 必须要是函数
        data: function () {
            return {
                count: 0
            }
        },
        // 插槽 slot 即子元素存放的位置
        template: `
            <p>
                <slot></slot>
                <span>{{ title ? (title + '：') : '' }} </span>
                <button @click="inc">+ 1</button>
                <span>{{ count }} </span>
            </p>
        `,
        methods: {
            inc: function () {
                this.count += 1
                // 用 $emit 去执行父类想组件绑定的事件，第一个参数是事件名称，第二个是 传入事件参数
                this.$emit('update', this.title)
            }
        }
    })
    var vm = new Vue({
        el: '#app',
        data: {
            total: 0,
            log: ''
        },
        methods: {
            setTotal: function (title) {
                this.total += 1
                this.log = title + ' + 1'
            }
        }
    })
</script>
```

动态切换组件

```html
<component :is="currentTabComponent"></component>
```

有些 html 元素有严格的限制，比如 ul 下一定要是 li，table 下一定要放表格元素，select 下一定要放 option ，如果不是就可能出现解析问题，所以这种情况最好用 is 属性使用组件

```html
<ul>
    <li is="my-comp"></li>
</ul>
```

## 深入了解组件

### 组件注册

#### 全局注册

可以用 kebab-case (短横线分割命名) 的命名风格

```js
Vue.component('my-component-name', { /* ... */ })
```

也可以用 PascalCase (大驼峰) 命名风格

```js
Vue.component('MyComponentName', { /* ... */ }) 
```

不管用拿着命名风格，在 DOM 模板里面都是用 kebab-case 还是 PascalCase 风格命名，都是转为 kebab-case 风格使用。

```html
<my-component-name></my-component-name>
```

只要在 Vue 实例化之前注册就可以访问到：

```html
<div id="#app">
    <my-component-name></my-component-name>
</div>
<script>
    Vue.component('MyComponentName', { /* ... */ })

    new Vue({
        el: '#app'
    })
</script>
```

#### 局部注册

局部注册就是将原本应该放在 Vue.component 第二个参数的组件配置，赋值给一个变量，然后通过 components 去配置所用的组件

```js
var CompA = { /* ... */ }
var CompB = { /* ... */ }
// 局部注册能注册其他局部组件
var CompC = {
    components: {
        'comp-b': CompB
    }
}

// 根组件注册局部组件
new Vue({
    el: '#app',
    components: {
        'comp-a': CompA,
        'comp-c': CompC
    }
})
```

ES Module 写法：

```js
import CompA from './CompA'

export default {
    components: {
        ComA
    }
}
```

### Prop

#### Prop 的大小写

在 html 中属性名大小写不敏感，所以所有的大写都会解析成小写字符，所以在 DOM 模板中只能使用 kebab-case (短横线分隔命名) 命名

```html
<!-- 在 HTML 中是 kebab-case 的 -->
<blog-post post-title="hello!"></blog-post>
```

但在组件定义的时候要使用 camelCase (驼峰命名法)，属性名要转成对应的 camelCase 写法

```js
Vue.component('blog-post', {
  // 在 JavaScript 中是 camelCase 的
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```

#### Prop 类型

写 props 的时候最好指定具体的数据类型

```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}
```

属性校验部分请查看下列的 [类型检查](#Prop\ 验证)

#### 传递静态 Prop

```html
<!-- 数字 -->
<my-comp :num="30"></my-comp>

<!-- 布尔值 -->
<my-comp bool></my-comp>
<my-comp :bool="false"></my-comp>

<!-- 数组 -->
<my-comp :arr="[1, 2, 3]"></my-comp>

<!-- 对象 -->
<my-comp
    :obj="{
        name: 'Veronica',
        company: 'Veridian Dynamics'
    }"
></my-comp>

<!-- 传入多个数据 -->
<my-comp v-bind="{ id: 1, title: 'Hello Vue.js' }"></my-comp>
<!-- 等价于 -->
<my-comp :id="1" :title="'Hello Vue.js'"></my-comp>
```

#### 单项数据流

所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。

不允许修改 props 的值，如果想改，有两种方式：

第一种是在组件内里再定义一份数据，将父组件传来的 props 值作为初始值，后续就改变组件里的这份数据就好。不过仅仅是这样会导致父类这个值改变了，子类无法感知到。还需要结合 watch 去监听父组件变化做出改变。

```js
const CounterView = {
    props: ['initCount'],
    data () {
        return {
            count: this.initCount
        }
    },
    watch: {
        initCount (next, prev) {
            next !== prev && (this.count = next)
        }
    }
}
```

第二种是使用计算属性对父组件的值做转化

```js
const CounterView = {
    props: ['size'],
    computed: {
        normalizedSize: function () {
            return this.size.trim().toLowerCase()
        }
    }
}
```

具体用哪种根据实际业务情况选择。

#### Prop 验证

对 props 做类型校验，让使用者如果没按照指定的类型传值，在控制台就会报警告。

```js
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

`type` 可以是下列原生构造函数中的一个：

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`

额外的，type 还可以是一个自定义的构造函数，并且通过 instanceof 来进行检查确认。例如，给定下列现成的构造函数：

```js
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
```

你可以使用：

```js
Vue.component('blog-post', {
  props: {
    author: Person
  }
})
```

来验证 author prop 的值是否是通过 new Person 创建的。

### 自定义事件

#### 组件名

自定义一个 my-event 事件，传入事件处理函数 doSomething

```html
<my-component @my-event="doSomething"></my-component>
```

组件内部用 `$emit` 去执行事件函数

```js
this.$emit('my-event')
```

注意：事件名称不像组件名和 prop 一样又大小写转化，事件名称都要用 kebab-case 命名风格。

#### 组件上使用 v-model

```js
Vue.component('base-checkbox', {
    // 定义触发机制，v-model 改变的值是 checked 属性，由 change 事件触发
    model: {
        prop: 'checked',
        event: 'change'
    },
    // 这边还是要定义属性名
    props: {
        checked: Boolean
    },
    // 使用 v-model 绑定的值和对应 change 事件处理函数
    template: `
        <input
            type="checkbox"
            :checked="checked"
            @change="$emit('change', $event.target.checked)"
        >
    `
})
```

```html
<base-checkbox v-model="lovingVue"></base-checkbox>
```

#### 将原生事件绑定到组件

有时候会需要直接监听原生的事件，比如 click 事件，组件并没有捕捉 click 事件，直接去监听 click 无法生效，这时候就需要监听原生事件。

```html
<base-input v-on:click.native="onClick"></base-input>
```

原生事件会绑定在组件内的根元素，如果根元素不存在这个原生事件就无法生效。比如你绑定了 focus 的元素事件，但是根元素是一个 label 就无法生效，例如：

```html
<label>
    {{ label }}
    <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
    >
</label>
```

解决这种问题的方案是使用 `$listeners`

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```

#### `.sync` 修饰符

有时候子组件想要改变父组件传来的属性值，又嫌双向绑定太麻烦，自己内部再维护个状态再 watch 下也很麻烦。这种情况通过自定义事件是最方便的

```js
this.$emit('update:title', newTitle)
```

通过触发下这样的函数就能实现想要的效果，对应的组件用法：

```html
<text-document
  :title="doc.title"
  @update:title="doc.title = $event"
></text-document>
```

`.sync` 就是为了这种情况而存在的，提供了简写的方式，可以改成这样：

```html
<text-document :title.sync="doc.title"></text-document>
```

注意：使用了 .sync 就不能传表达式和字面量，只能传变量。
