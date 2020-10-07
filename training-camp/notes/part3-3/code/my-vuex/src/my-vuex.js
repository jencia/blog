// 简单版的 vuex

let Vue

class Store {
  constructor (options = {}) {
    const { state = {}, getters = {}, mutations = {}, actions = {} } = options

    this.state = Vue.observable(state)

    this.getters = Object.create(null)
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get (value) {
          return getters[key](state, getters)
        }
      })
    })

    this._mutations = mutations
    this._actions = actions
  }

  commit = (type, payload) => {
    this._mutations[type] && this._mutations[type](this.state, payload)
  }

  dispatch = (type, payload) => {
    this._actions[type] && this._actions[type](this)
  }
}

function install (_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate () {
      const { store, parent } = this.$options

      // 有 store 代表顶级组件
      if (store) {
        this.$store = store
      } else if (parent && parent.$store) {
        // 后续的组件找父组件拿 $store
        this.$store = parent.$store
      }
    }
  })
}

export default { Store, install }
