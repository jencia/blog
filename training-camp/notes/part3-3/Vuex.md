# Vuex 状态管理

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