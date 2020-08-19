# 模块3-2：Vue.js 源码分析（响应式、虚拟 DOM、模板编译和组件化）

## 一、简答题

### 1、请简述 Vue 首次渲染的过程。

答： 

- 在首次渲染之前先进行 Vue 初始化实例成员、静态成员
- 完成初始化后执行 Vue 的构造函数 `new Vue()`
- `new Vue()` 中调用 `this._init()` 方法，是整个vue的入口
- 在 `this._init()` 中调用 `entry-runtime-compiler.js` 中的 `vm.$mount()` 方法，这个方法的作用是帮我们把模板编译成 render 函数，首先会判断是否传入了 `render` 函数，如果没有传入的话会获取 `template` 选项，如果 `template` 也没有的话，就会把 `el` 中的内容作为模板，然后使用 `compileToFunctions()` 把模板编译成 `render` 渲染函数，保存在 `options.render` 中。
- 调用 `index.js` 中的 `vm.$mount()` 方法，这个方法中会重新获取 `el` (因为在运行时版本是不会进这个入口)
- 调用 `mountComponent(this,el)` 首先判断是否有 `render` 选项，如果没有但是传入了模板并且当前是开发环境的话会发送警告，运行时不支持编译器，然后触发 `beforeMount` 生命周期钩子函数，定义了`updateComponent` 方法。创建 `Watcher` 对象，在创建 `watcher` 完成后会调用一次 get 方法，在 get 中会调用 `updateComponent()` 函数，在此 `updateComponent()` 方法中调用了 `vm._update()` 和 `vm._render()` 方法，`vm._render()` 中调用实例化时 Vue 传入的 `render()` 或者编译 `template` 生成的 `render()` 生成 VNode，`vm._update()` 中调用了 `vm.patch()` 方法将虚拟 DOM 转换成真实 DOM 并且挂载到页面，他会把生成的真实 DOM 设置到 `vm.$el` 中，触发 `mounted` 生命周期钩子函数，最终返回 vue 实例。

### 2、请简述 Vue 响应式原理。

答：

- data的属性被转换成 getter 和 setter ，并且记录相应的依赖。当它被改动时，会通知相应的依赖。
- 所有的组件实例都有相应的 watcher 实例，而 watcher 实例会依赖相应的 setter 。
3- 当数据变化的时候，会调用 setter ，而 setter 会通知 watcher 实例， watcher 会更新相应的视图

### 3、请简述虚拟 DOM 中 Key 的作用和好处。

答：

- 可以跟踪每个节点的身份，从而重用和重新排序现有元素
- DOM 操作会少很多
- 在 vue-cli 创建的项目中，如果在使用 v-for 时不设置 key 会有警告

### 4、请简述 Vue 中模板编译的过程。

答：

- 在 `compileToFunctions(template, ...)` 先从缓存中加载编译好的 render 函数，如果缓存中没有调用 `compile(template, options)` 开始编译
- 在 `compile(template, options)` 中，首先合并选项，再调用 `baseCompile(template,.trim(), finalOptions)` 编译模板。
- 把模板和合并后的选项传递给 `baseCompile(template,.trim(), finalOptions)` ，内部完成了模板编译核心的三件事：
    1. 调用 `parse()` 把模板转换成 `AST tree`
    2. 调用 `optimize()` 对语法树进行优化，标记语法树中的静态根节点，静态根节点不需要每次都重绘，patch 的过程中会跳过静态更节点，
    3. 调用 `generate()` 将语法树生成js形式的字符串代码
- `compile` 执行完成后又会回到编译的入口函数 `compileToFunctions()` ，内部继续把字符串形式的代码转换成函数，通过调用 `createFunction()`，当 render 和 `staticRenderFns` 初始化完毕，最终他们会被挂载到 Vue 实例的options 对应的属性中。到此，模板编译的过程就结束。