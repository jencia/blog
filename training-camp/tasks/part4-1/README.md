# 模块4-1: React 设计原理解密及核心源码解读

## 简答题

### 1. 请简述 React 16 版本中初始渲染的流程

- 构建 FiberRoot 和 RootFiber
- render 阶段，构建 workInProgress Fiber 树和 Fiber 链表结构
- commit 阶段，根据 Fiber 链表渲染到真实 DOM 上

### 2. 为什么 React 16 版本中 render 阶段放弃了使用递归

由于递归使用 JavaScript 自身的执行栈，一旦开始就无法停止。如果 VirtualDOM 树的层级比较深，VirtualDOM 的比对就会长期占用 JavaScript 主线程，由于 JavaScript 又是单线程的无法同时执行其他任务，所以在比对的过程中无法响应用户操作，无法及时执行元素动画，造成了页面卡顿现象。


### 3. 请简述 React 16 版本中 commit 阶段的三个子阶段分别做了什么事情

1. 调用类组件的 getSnapshotBeforeUpdate
2. 根据 effectTag 执行 DOM 操作
3. 调用生命周期函数和钩子函数

### 4. 请简述 workInProgress Fiber 树存在的意义是什么

有时创建 DOM 元素的时候需要花费大量的时间，比如 canvas 绘制动画的时候，一帧画面的计算量如果比较大，就会花费比较长的时间，就导致上一帧已经清除了，下一帧还没绘制出来，就会出现白屏。

为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，这样的话在帧画面替换的过程中就会节约非常多的事件，就不会出现白屏问题。而 workInProgress Fiber 树就是负责在内存中绘制，绘制完成后替换掉画面中的 current Fiber 树，成为新的 current Fiber 树，下一帧再重新构建 workInProgress Fiber 树。这种在内存中构建并直接替换的技术叫做双缓存，可以更快的进行 DOM 更新。