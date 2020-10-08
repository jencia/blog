import Vue from 'vue'
import Vuex from 'vuex'
import product from './modules/product'
import cart from './modules/cart'

Vue.use(Vuex)

const persistencePlugin = store => {
  // 每个 Mutation 执行完成后执行这里的回调函数
  store.subscribe((mutation, state) => {
    // 所执行的 mutation 是在 cart 命名空间下的
    if (mutation.type.startsWith('cart/')) {
      const data = state.cart.cartProducts

      window.localStorage.setItem('cart-products', JSON.stringify(data))
    }
  })
}

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { product, cart },
  plugins: [persistencePlugin]
})
