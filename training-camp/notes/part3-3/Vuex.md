# Vuex

在学习 Vuex 之前，先来了解下 Vue 如何管理状态的。

## 组件内的状态管理流程

Vue 最核心的两个功能：数据驱动和组件化

组件化开发给我们带来了：

- 更快的开发效率
- 更好的可维护性

每个组件都有自己的状态、视图、行为等组成部分

```js
new Vue({
    // state
    data () {
        return {
            count: 0
        }
    },
    // view
    template: `<div>{{ count }}</div>`,
    // actions
    methods: {
        increment () {
            this.count++
        }
    }
})
```

状态管理包括以下几部分：

- `state`: 驱动应用的数据源
- `view`: 以声明方式将 state 映射到视图
- `actions`: 响应在 view 上的用户输入导致的状态变化

我们来通过一张图了解他们之间的关系图

![](https://jencia.github.io/images/blog/training-camp/notes/Vuex-1.png)

这边的箭头代表数据流向，`state` 表示数据，数据绑定在视图 `view` 上，用户通过视图操作，比如点击按钮触发一个事件，这就是一个行为 `action` ，通过行为改变 `state` ，`state` 改变后 `view` 就会跟着改变。

这就是一个单向循环的数据流向，单个组件的数据流向特别清晰，但多个组件共享数据的时候就会破坏这个结构，下面我们来回顾下 Vue 中组件之间的通讯方式。

## 组件间的通讯方式

组件间的通讯分为三种情况：

1. 父组件给子组件传值（父子之间传值）
2. 子组件给父组件传值（兄弟之间传值）
3. 不相关组件之间传值

![](https://jencia.github.io/images/blog/training-camp/notes/Vuex-2.png)

### 父传子

```html
<!-- 父组件使用子组件，并传 title 属性值 -->
<child-comp title="My journey with Vue"></child-comp>
```

```js
// 子组件使用 props 接收父组件传来的值
Vue.component('child-comp', {
    props: ['title'],
    template: '<h3>{{ title }}</h3>'
})
```

具体使用看 [这里](https://cn.vuejs.org/v2/guide/components.html#%E9%80%9A%E8%BF%87-Prop-%E5%90%91%E5%AD%90%E7%BB%84%E4%BB%B6%E4%BC%A0%E9%80%92%E6%95%B0%E6%8D%AE)

### 子传父

```html
<!-- 父组件使用子组件，绑定自定义事件，$event 为子组件传来的值 -->
<child-comp @inc="count += $event">add</child-comp>
```

```html
<!-- 子组件点击按钮时，触发自定义事件，并传值过去 -->
<button @click="$emit('inc', 1)">加一</button>
```

具体使用看 [这里](https://cn.vuejs.org/v2/guide/components.html#%E7%9B%91%E5%90%AC%E5%AD%90%E7%BB%84%E4%BB%B6%E4%BA%8B%E4%BB%B6)

### 非父子之间传值

用于兄弟组件和不相关组件之间的传值。

> 如果是兄弟组件传值，最好把数据状态提升到共同的父组件，再由父组件往子组件传值。

采用 Event Bus 来进行通讯，首先创建一个文件 `eventBus.js` :

```js
export default new Vue()
```

A 组件向 B 组件传值：

```js
// A 组件
import bus from './eventBus'

// 触发自定义事件
bus.$emit('自定义事件名称', '数据')
```

```js
// B 组件
import bus from './eventBus'

// 监听自定义事件
bus.$on('自定义事件名称', data => {
    // 执行操作
})
```

具体使用看 [这里](https://cn.vuejs.org/v2/guide/migration.html#dispatch-%E5%92%8C-broadcast-%E6%9B%BF%E6%8D%A2)

### 其他通讯方式

Vue 给我们提供了这样一些属性：

- `$root` 获取根组件实例对象
- `$parent` 获取父组件实例对象
- `$children` 获取子组件实例对象
- `$refs` 获取 `ref` 数据 ( DOM 元素对象或组件实例对象 )

可以看出这些属性都是直接获取实例对象，通过实例对象来取自己需要的属性和方法。这方式太过于简单粗暴，性能较低，也不利于数据跟踪和维护。所以以上这些属性尽量别去使用，实在没办法才去是使用。

实际开发过程中 `$refs` 可能会用的多一些。`$refs` 是当前组件的所有 `ref` 的集合，通过 `ref` 的属性值来区分不同的 `ref` 。`ref` 有两个用处：

- 如果用在 DOM 元素上，获取到的值是 DOM 对象
- 如果用在组件上，获取到的值是组件实例对象。

例如：

```js
Vue.component('base-input', {
    template: '<input ref="refName">',
    methods: {
        focus () {
            this.$refs.refName.focus()
        }
    }
})
```

`base-input` 组件里，使用 ref 绑定在 DOM 元素上，`this.$refs` 根据 ref 的名称就能拿到 input 的 DOM 元素对象，从而调用聚焦方法 `focus()` 。

```html
<base-input ref="usernameInput"></base-input>
```

```js
this.$refs.usernameInput.focus()
```

父组件使用 ref 绑定在 `base-input` 组件上，这时 `this.$ref` 取到的是 `base-input` 组件的实例对象，由于 `base-input` 组件里定义了 `focus` 方法，因此可以被访问到。

## 简易的状态管理方案

如果多个组件之间要共享状态(数据)，使用上面的方式虽然可以实现，但是比较麻烦，而且多个组件之间互相传值很难跟踪数据的变化，如果出现问题很难定位问题。

当遇到多个组件需要共享状态的时候，典型的场景：购物车。我们如果使用上述的方案都不合适，我们会遇到以下的问题：

- 多个视图依赖于同一状态。
- 来自不同视图的行为需要变更同一状态。

对于问题一，传参的方法对于多层嵌套的组件将会非常繁琐，并且对于兄弟组件间的状态传递无能为力。

对于问题二，我们经常会采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。以上的这些模式非常脆弱，通常会导致无法维护的代码。

因此，我们为什么不把组件的共享状态抽取出来，以一个全局单例模式管理呢？在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为！

我们可以把多个组件的状态，或者整个程序的状态放到一个集中的位置存储，并且可以检测到数据的更改。你可能已经想到了 Vuex。

这里我们先以一种简单的方式来实现

- 首先创建一个共享的仓库 `store` 对象

```js
export default {
    debug: true,
    state: {
        user: {
            name: 'xiaomao',
            age: 18,
            sex: '男'
        }
    }
    setUserNameAction (name) {
        if (this.debug) {
            console.log('setUserNameAction triggered：', name)
        }
        this.state.user.name = name
    }
}
```
- 把共享的仓库 `store` 对象，存储到需要共享状态的组件的 `data` 中

```js
import store from './store'

export default {
    methods: {
        // 点击按钮的时候通过 action 修改状态
        change () {
            store.setUserNameAction('componentB')
        }
    },
    data () {
        return {
            privateState: {},
            sharedState: store.state
        }
    }
}
```

接着我们继续延伸约定，组件不允许直接变更属于 `store` 对象的 `state`，而应执行 `action` 来分发 (`dispatch`) 事件通知 `store` 去改变，这样最终的样子跟 Vuex 的结构就类似了。这样约定的好处是，我们能够记录所有 `store` 中发生的 `state` 变更，同时实现能做到记录变更、保存状态快照、历史回滚/时光旅行的先进的调试工具。

## Vuex 是什么

> Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 devtools extension，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

- Vuex 是专门为 Vue.js 设计的状态管理库
- 它采用集中式的方式存储需要共享的数据
- 从使用角度，它就是一个 JavaScript 库
- 它的作用是进行状态管理，解决复杂组件通信，数据共享

什么情况下使用 Vuex ?

> 官方文档：
>
> Vuex 可以帮助我们管理共享状态，并附带了更多的概念和框架。这需要对短期和长期效益进行权衡。
>
> 如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此——如果您的应用够简单，您最好不要使用 Vuex。一个简单的 store 模式就足够您所需了。但是，如果您需要构建一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。引用 Redux 的作者 Dan Abramov 的话说就是：Flux 架构就像眼镜：您自会知道什么时候需要它。

当你的应用中具有以下需求场景的时候：

- 多个视图依赖于同一状态
- 来自不同视图的行为需要变更同一状态

建议符合这种场景的业务使用 Vuex 来进行数据管理，例如非常典型的场景：购物车。

**注意：Vuex 不要滥用，不符合以上需求的业务不要使用，反而会让你的应用变得更麻烦。**

## Vuex 核心概念

![](https://jencia.github.io/images/blog/training-camp/notes/Vuex-3.png)

以上是 Vuex 的整个运作流程，Vuex 主要由 `state` 、`mutation`、`action` 三部分组成。箭头代表数据的流向，整个过程是一个单向数据流，具体过程如下：

1. `State` 用于存储数据，将数据绑定在组件，渲染 `Render` 在视图上
2. 用户在视图上操作，触发事件函数，组件派发 `Dispatch` 一个或多个行为 `Actions` 
3. 这个行为可能是异步操作，比如调用后端接口 `Backend API` 
4. 接口响应后将结果提交 `Commit` 数据改变 `Mutations` 
5. 改变的结果会被 `Devtools` 检测到，帮助开发者调试
6. `Mutations` 将最终改变 `Mutate` 后的值交给 `State`
7. 检测到 `State` 数据改变后，将最新的数据渲染到视图上

Vuex 的内容除了上面那三部分，还有其他的，下面简单描述下各个部分的作用：

- `Store` ：真正的数据是存在这里面，一个单页应用只能有一个，不能直接操作里面的数据
- `State` ：数据状态，类似 Vue 的 `data` ，里面的数据都是响应式的
- `Getter` ：类似 Vue 的 `computed` ，对 `State` 数据的处理
- `Mutation` : 用于改变 `State` 数据的方法
- `Action` ：用于处理异步操作的行为，处理完之后还是得借助 `Mutation` 来改变 `State` 数据
- `Module` ：可将单一状态树拆分为多个状态树，避免数据过大，用于性能优化

下面详细讲解每一块的用法。

## 基本代码结构

```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

// 1. 使用 Vuex
Vue.use(Vuex)

// 2. 创建 Store
export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

```

```js
// main.js
import Vue from 'vue'
import store from './store'

new Vue({
  store,    // 3. 将 Store 传进去
  render: h => h(App)
}).$mount('#app')
```

## State

定义：

```js
export default new Vuex.Store({
    state: {
        msg: 'Hello Vuex!'
    }
})
```

使用：

```html
<!-- 可以直接从 $store.state 取值 -->
<div>{{ $store.state.msg }}</div>

<!-- 也可在 computed 处理完再使用 -->
<div>{{ msg }}</div>
<div>{{ myMsg }}</div>
```

```js
import { mapState } from 'vuex'

export default {
    computed: {
        // 方式1：自己写 computed 取值
        msg () {
            return this.$store.state.msg
        },
        // 方式2：利用 Vuex 提供的 mapState 取值
        // 支持传数组，传想要提取的数据
        ...mapState(['msg']),

        // 也可传对象，对数据重命名
        ...mapState({
            myMsg: 'msg',

            // 属性值传字符串等价于以下写法
            myMsg: state => state.msg
        })
    }
}
```

## Getter

定义：

```js
export default new Vuex.Store({
    state: {
        msg: 'Hello Vuex!'
    },
    getters: {
        // 接收两个参数，getters 用于引用其他 getter 值
        reverseMsg: (state, getters) => {
            return state.msg.split('').reverse().join('')
        },
        // 这边支持返回函数
        getMsgById: state => id => {
            return `${state.msg}-${id}`
        }
    }
})
```

使用：

```html
<!-- 可以直接从 $store.getters 取值 -->
<div>{{ $store.getters.reverseMsg }}</div>

<!-- 也可在 computed 处理完再使用 -->
<div>{{ reverseMsg }}</div>
<div>{{ getMsgById('abcd') }}</div>
<div>{{ myMsg }}</div>
```

```js
import { mapGetters } from 'vuex'

export default {
    computed: {
        // 支持传数组，传想要提取的数据
        ...mapGetters(['reverseMsg', 'getMsgById']),

        // 也可传对象，对数据重命名
        ...mapGetters({
            myMsg: 'reverseMsg' // 这里属性值不能传函数
        })
    }
}
```

## Mutation

定义：

```js
export default new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        // payload 为调用者传过来的数据
        inc: (state, payload) => (state.count += payload)
    }
})
```

使用：

```html
<!--
    可以直接通过调用 $store.commit 触发 mutation，
    第一个参数是 mutation 的方法名称，第二个是参数值
-->
<button @click="$store.commit('inc', 1)">+1</button>

<!-- 也可在 method 映射方法出来 -->
<button @click="inc(1)">+1</button>
```

```js
import { mapMutations } from 'vuex'

export default {
    methods: {
        ...mapMutations(['inc'])
        ...mapMutations({
            add: 'inc'
        })
    }
}
```

**注意：mutations 的方法一定要是同步代码，如果需要异步处理，请使用 actions**

## Action

定义：

```js
export default new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        inc: (state, payload) => (state.count += payload)
    },
    actions: {
        // context 可以拿到 state、getters、commit、dispatch
        asyncAdd: (context, payload) => {
            // context.state
            // context.getters

            setTimeout(() => {
                context.commit('inc', 1)
            }, 2000)

            context.dispatch('other')
        }
    }
})
```

使用：

```html
<!-- 可以直接通过调用 $store.dispatch 触发 action -->
<button @click="$store.dispatch('asyncInc', {})">+1</button>

<!-- $store.dispatch 支持第一个参数传对象 -->
<button
    @click="$store.dispatch({
        type: 'asyncInc',
        data: {}
    })"
>
    +1
</button>

<!-- 也可在 method 映射方法出来 -->
<button @click="asyncInc">+1</button>
```

```js
import { mapActions } from 'vuex'

export default {
    methods: {
        ...mapActions(['asyncInc'])
        ...mapActions({
            add: 'asyncInc'
        })
    }
}
```

## Module

定义：

```js
const moduleA = {
    namespaced: true,
    state: {
        name: 'a'
    },
    getters: {
        // 增加了第 3 、4 参数用于访问根状态和根 getters
        reverseName: (state, getters, rootState, rootGetters) => {}
    },
    mutations: {
        setName: (state, payload) => (state.name = payload)
    },
    actions: {
        // context 属性同样增加了 rootState 和 rootGetters
        asyncSetName: context => {
            // 增加第三个参数，设置 root 为 true 可以调用根 mutations 和 actions
            context.commit('someOtherAction', {}, { root: true })
            context.dispatch('someOtherAction', {}, { root: true })
        },
        // 值可传对象
        setRootName: {
            // 设置 root 为 true 用来在模块内定义全局的 action
            root: true,
            // action 的函数转放在 handler 属性上
            handler: context => {}
        }
    }
}
const moduleB = {
    namespaced: true,
    state: { name: 'b' },
    mutations: {},
    actions: {}
}

export default new Vuex.Store({
    state: {
        name: 'root'
    },
    mutations: {},
    modules: { moduleA, moduleB }
})
```

使用：

```html
<div>{{ $store.state.moduleA.name }}</div>
<div>{{ $store.getters.moduleA.reverseName }}</div>
<button @click="$store.commit('moduleA/setName', 'tom')" />
<button @click="$store.dispatch('moduleA/asyncSetName', 'tom')" />
```

```js
import { mapActions, createNamespacedHelpers } from 'vuex'

const { mapActions: mapActionsA } = createNamespacedHelpers('modulaA')

export default {
    methods: {
        // 模块取值有三种方式，mapState、mapGetters、mapMutations 也都支持
        ...mapActions(['moduleA/asyncSetName'])
        ...mapActions('moduleA', ['asyncSetName'])
        ...mapActionsA(['asyncSetName'])
    }
}
```

## 严格模式

在 Vuex 中，Store 里 `State` 的数据是不允许直接修改的，最好通过 `Mutation` 去更新 `State` 数据。如果你直接修改 `State` 的数据是能生效的，因为它也是响应式数据，可这样一来就无法检测到数据的变化，造成难以维护的代码。

默认情况下直接去修改 `State` 数据并不会报错，还能成功生效，为了避免犯这样的错误，Vuex 加入了严格模式的选项：

```diff
export default new Vuex.Store({
+   strict: true,
    state: {},
    mutations: {},
    actions: {}
})
```

设置 `strict` 为 `true` 后，再去直接修改 `State` 的数据，这时候就会抛出异常。

不过开启严格模式会造成性能问题，所以最好是开发环境下开启，生产环境下关闭：

```diff
export default new Vuex.Store({
-   strict: true,
+   strict: process.env.NODE_ENV !== 'production',
    state: {},
    mutations: {},
    actions: {}
})
```

## 案例练习

- 购物车案例：[项目模板地址](http://github.com/goddlts/vuex-cart-demo-template.git)、[案例代码](./code/vuex-cart-demo)
- 模拟 Vuex：[代码](./code/my-vuex/src/my-vuex.js)
