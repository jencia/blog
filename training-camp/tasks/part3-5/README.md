# 模块3-5：Vue.js 3.0 Composition APIs 及 3.0 原理剖析

## 简答题

### Vue 3.0 性能提升主要是通过哪几方面体现的？

1. 响应式系统升级
2. 编译升级
3. 优化打包体积

### Vue 3.0 所采用的 Composition Api 与 Vue 2.x使用的Options Api 有什么区别？

- Options API: 开发复杂组件时，同一个功能逻辑的代码被拆分到不同选项，不易于维护
- Composition API: 是一组基于函数的 API ，可以更灵活的组织组件的逻辑

### Proxy 相对于 Object.defineProperty 有哪些优点？

- 可以监听动态新增的属性
- 可以监听删除的属性
- 可以监听数组的索引和 length 属性

### Vue 3.0 在编译方面有哪些优化？

- Fragments：不再要求组件要有一个唯一的根节点，需升级 vetur 插件
- 静态节点提升：模板编译的时候会将静态节点（没有绑定数据的节点）提升，diff 的时候只需要对比动态节点内容
- Patch flag：标记节点类型，提高 diff 算法比对速度
- 缓存事件处理函数：避免重新渲染时重复创建和绑定函数，避免不必要的操作

### Vue.js 3.0 响应式系统的实现原理？

#### reactive

接收一个对象参数，将对象放入 `Proxy` 处理，分别设置 `get`、`set`、`deleteProperty` 。

- `get`

  - 使用 `Reflect.get()` 获取值
  - 调用 `track` 收集依赖
  - 返回刚获取的值，如果值是一个对象，则递归 `reactive` 函数。

- `set`

  - 使用 `Reflect.get()` 获取旧值
  - 判断新值与旧值是否变化，没变化就直接返回 `true`，有变化就继续往下走
  - 使用 `Reflect.set()` 更新值
  - 调用 `trigger` 触发更新
  - 返回更新结果

- `deleteProperty`

  - 判断当前 `key` 存在于对象上，忽略原型链里的，不存在直接返回 `true` ，存在就往下走
  - 使用 `Reflect.deleteProperty` 删除对象属性
  - 如果删除成功就调用 `trigger` 触发更新
  - 返回删除结果

具体代码: [reactive.js](../../notes/part3-5/code/mock-reactivity/src/reactive.js)

#### effect、track、trigger

这三个都涉及到依赖收集和更新问题，首先了解下数据的存储结构：

1. 所有数据都存储在以 `WeakMap` 为数据结构的 `targetMap` 里，存储着响应式对象 ( `target` ) 和依赖映射表 ( `depsMap` ) 的映射关系
2. `depsMap` 是一个 `Map` ，存储着 `target` 属性值 ( `property` ) 和依赖集合 ( `deps` ) 的映射关系
3. `deps` 是一个 `Set` ，存储着一个个依赖
4. 依赖其实就是用于触发更新的函数

`effect` 用来监听数据更新， `track` 收集依赖，`trigger` 触发更新。

- `effect` 用来监听数据更新，也是用来定义依赖的函数

  - 将回调函数作为依赖存储起来
  - 首次渲染会执行一次，所以执行 `effect` 会立马执行一次回调函数

- `track` 用于收集依赖

  - 函数接收 `target` 和 `property` ，根据这两个值从 `targetMap` 里的找到对应的 `deps`
  - 将 `effect` 存储的依赖存进 `deps` 里
  - `track` 是在响应式对象的 `get` 方法中被执行

- `trigger` 用于触发更新

  - 函数接收 `target` 和 `property` ，根据这两个值从 `targetMap` 里的找到对应的 `deps`
  - 将 `deps` 里所有的依赖执行一遍
  - `trigger` 是在响应式对象的 `set` 方法和 `deleteProperty` 中被执行

具体代码: [effect.js](../../notes/part3-5/code/mock-reactivity/src/effect.js)

#### ref

接收一个任意数据类型的参数数据

- 判断参数数据是否是一个 `ref` 数据，是就直接返回该数据
- 如果数据是一个对象，将调用 `reactive` 转成响应式对象，否则不做处理
- 返回一个经过 getter 和 setter 处理的对象
  
  - `__v_isRef` 用于标识是否是 `ref` 数据
  - `get` 调用 `track` 收集依赖，返回数据
  - `set` 如果数据有变化，赋值新数据，调用 `trigger` 触发更新

具体代码: [ref.js](../../notes/part3-5/code/mock-reactivity/src/ref.js)

#### toRefs

接收一个响应式数据参数 `proxy`

- 如果参数不是响应式数据就报警告，直接返回 `undefined`
- 循环遍历 `proxy` 的第一层属性值分别转化为类似 `ref` 的对象,
- 与 `ref` 的差别在于，getter 和 setter 访问的数据和设置数据都是针对 `proxy` 对应的属性值进行操作，而且不需要收集依赖和触发更新

这边不需要收集依赖是因为 `proxy` 本身有 getter 和 setter，在那边会去收集依赖

具体代码: [toRefs.js](../../notes/part3-5/code/mock-reactivity/src/toRefs.js)

#### computed

接收一个 `getter` 函数

- 调用 `ref` 获取一个空数据的响应式对象
- 调用 `effect` 在回调函数里给刚创建的响应式对象赋值，值从 `getter` 里获取

具体代码: [computed.js](../../notes/part3-5/code/mock-reactivity/src/computed.js)

