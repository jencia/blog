let _Vue = null

export default class VueRouter {
  static install (Vue) {
    // 1. 判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true

    // 2. 把 Vue 构造函数记录到全局变量
    _Vue = Vue

    // 3. 把创建 Vue 实例时传入的 router 对象注入到 Vue 实例上
    // 设置混入是为了拿到 Vue 实例对象
    _Vue.mixin({
      beforeCreate () {
        // 有 router 值的就一定是根组件
        if (this.$options.router) {
          // 把 router 注入到 Vue 实例
          _Vue.prototype.$router = this.$options.router

          // router 是一个 VueRouter 实例，实例上就能访问到 init 方法
          this.$options.router.init()
        }
      }
    })
  }

  constructor (options) {
    this.options = options
    this.routeMap = {}
    // 数据设置为响应式
    this.data = _Vue.observable({
      current: '/'
    })
  }

  init () {
    this.createRouteMap()
    this.initComponent(_Vue)
    this.initEvent()
  }

  // 把路由规则解析成键值对的形式存储到 routeMap 中
  createRouteMap () {
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  // 创建 <router-link> 和 <router-view> 组件
  initComponent (Vue) {
    const self = this

    Vue.component('router-link', {
      props: {
        to: String
      },
      // template: '<a :href="to"><slot></slot></a>'
      render (h) {
        return h(
          'a',
          {
            attrs: {
              href: self.options.mode === 'history' ? '' : '#' + this.to
            },
            on: {
              click: this.clickHandler
            }
          },
          this.$slots.default
        )
      },
      methods: {
        clickHandler (e) {
          // history 模式
          if (self.options.mode === 'history') {
            // 改变地址变化
            history.pushState({}, '', this.to)
            // 改变 current ，因为是响应式的，所以视图也会跟着更新
            this.$router.data.current = this.to
            // 不使用默认的 href 行为，因为默认行为会刷新页面
            e.preventDefault()
          }
        }
      }
    })
    Vue.component('router-view', {
      render (h) {
        // 渲染当前路径对应的组件
        const component = self.routeMap[self.data.current]

        return h(component)
      }
    })
  }

  initEvent () {
    // 点击浏览器的前进后退触发的视图更新
    if (this.options.mode === 'history') {
      // history 模式
      window.addEventListener('popstate', () => {
        this.data.current = window.location.pathname
      })
    } else {
      // hash 模式
      window.addEventListener('hashchange', () => {
        this.data.current = window.location.hash.substr(1)
      })
    }
  }
}
