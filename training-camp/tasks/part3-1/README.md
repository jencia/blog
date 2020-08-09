# 模块3-1：手写 Vue Router、手写响应式实现、虚拟 DOM 和 Diff 算法

## 一、简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。

```js
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```
 
答：不是响应式数据，如果想设置成响应式数据，应该这样改：

```js
this.dog = { name: 'Trump' }
```

Vue 只会对初始化的 data 数据设置响应式，对于新增的成员都不是响应式。这边只有 `o` 和 `dog` 是响应式数据，`dog` 是一个对象，所以只要 `dog` 的地址指向没有变，就不算变更。给 `dog` 增加属性不会导致 `dog` 变更，需要设置整个对象才行。

### 2、请简述 Diff 算法的执行过程
 
答：snabbdom 的 diff 算法是采用同级别节点依次比较的方式，运算过程依次是：

1.  对新老节点数组的开始和结尾节点设置标记索引，分别是：

    - 老节点开始索引：oldStartIdx
    - 老节点结束索引：oldEndIdx
    - 新节点开始索引：newStartIdx
    - 新节点结束索引：newEndIdx

2. 比较 oldStartIdx 和 newStartIdx 对应的节点是否是相同节点。相同节点的判定规则是 key 值和选择器是否都一样。如果是相同节点就直接进入下一轮比较。如果不同节点就对比两个节点的差异并更新节点，然后将 oldStartIdx 和 newStartIdx 加一再继续比较。直到遇到不同节点或没有可比较的节点时才进入下一轮比较，以下的比较的同理。

3. 比较 oldEndIdx 和 newEndIdx 对应的节点是否是相同节点。如果不相同就对比两个节点的差异并更新节点，然后两个索引各减一。

4. 比较 oldStartIdx 和 newEndIdx 对应的节点是否是相同节点。如果不相同就对比两个节点的差异并更新节点，然后将 oldStartIdx 加一，newEndIdx 减一。

5. 比较 oldEndIdx 和 newStartIdx 对应的节点是否是相同节点。如果不相同就对比两个节点的差异并更新节点，然后将 oldEndIdx 减一，newStartIdx 加一。

6. 如果老节点数组比较完了，新节点数组还有节点，就根据 newStartIdx 和 newEndIdx 的值插入到对应的位置。如果新节点数组先比较完，就把老数组剩余的全删掉。

## 二、编程题

### 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
 
答案请看 [code/my-vue-router](./code/my-vue-router/src/vue-router.js)

### 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
 
答案请看 [code/minivue](./code/minivue)

### 3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图：

![](https://jencia.github.io/images/blog/training-camp/tasks/part3-1_2-3.png)

答案请看 [code/todolist-snabbdom](./code/todolist-snabbdom)