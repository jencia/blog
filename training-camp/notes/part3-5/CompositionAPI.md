# Composition API

这是 Vue 3.0 新出的一组 API

## createApp

```js
// API 都是从 vue 模块里解构出来的
import { createApp } from 'vue'

// 创建应用，即根节点组件
const app = createApp({
    // Composition API 只能在这函数里写，函数接收两个参数
    setup (props, context) {
        // props 是父类传进来的响应式属性，注意不能解构
        // context 含有三个成员：attrs、emit、slot

        // 函数执行时机：props 被解析完成之后，组件被创建之前，因此拿不到 this 对象
        
        // 返回数据和参数，将被挂载到 this 里供其他地方访问
        return { }
    }
})

// 调用这函数渲染
app.mount('#app')
```

## 生命周期函数

```js
createApp({
    setup () {
        onBeforeMount(() => console.log('渲染前'))
        onMounted(() => console.log('渲染后'))

        onBeforeUpdate(() => console.log('更新前'))
        onUpdated(() => console.log('更新后'))

        onBeforeUnmount(() => console.log('卸载前'))
        onUnounted(() => console.log('卸载后'))

        onErrorCaptured(() => console.log('出现异常时'))
    }
}).mount('#app')
```

## reactive

将对象转化为响应式数据

```js
createApp({
    setup () {
        const position = reactive({
            x: 0,
            y: 0
        })

        return {
            position,
            setX: x => (position.x = x)
        }
    }
}).mount('#app')
```

```html
<div id="app">
    <p>x: {{ position.x }}</p>
    <p>y: {{ position.y }}</p>
</div>
```

**注意：position 不可被解构，否则将变成非响应式对象**

## ref

如果数据不是对象，而是原始类型，就使用 ref 转成响应式数据

```js
createApp({
    setup () {
        const count = ref(0)
        
        // count 是一个对象，真正的值是放在 value 里
        console.log(count.value)    // 0

        return {
            count,
            inc: () => (count.value += 1)
        }
    }
}).mount('#app')
```

```html
<div id="app">
    <!-- 在模板里不需要写 .value -->
    count: {{ count }}
</div>
```

## toRefs

将对象里的成员都转为 ref 对象

```js
const position = reactive({
    x: 0,
    y: 0
})
const { x, y } = toRefs(position)

x.value // 0
y.value // 0
```

## computed

计算属性

```js
const count = ref(0)
const text = computed(() => {
    return `【${count.value}】`
})
```

自动检测 `computed` 里依赖的数据，比如这边依赖了 `count` ，当 `count` 变化值自动触发 `computed` 函数更新 `text` 数据。

## watch

数据监听

```js
const count = ref(0)

// 监听 count 的变化，返回停止监听的方法
const stopWatch = watch(count, (newValue, oldValue) => {
    // 监听处理函数
})
```

## watchEffect

与 `watch` 的区别是不用传监听对象，会像 `computed` 一样自动检测依赖数据。还有个区别是第一次进来会执行一次

```js
const count = ref(0)

const stopWatch = watchEffect(() => {
    // 监听处理函数
})
```
