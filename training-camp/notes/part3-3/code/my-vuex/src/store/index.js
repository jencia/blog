import Vue from 'vue'
import Vuex from '../my-vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    msg: 'Hello Vuex!',
    count: 0
  },
  getters: {
    reverseMsg: state => state.msg.split('').reverse().join('')
  },
  mutations: {
    inc: (state, payload) => (state.count += payload)
  },
  actions: {
    asyncAdd: ({ commit }) => setTimeout(() => commit('inc', 2), 1000)
  }
})
