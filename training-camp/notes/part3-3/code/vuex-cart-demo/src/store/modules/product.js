import axios from 'axios'

const state = {
  products: []
}
const mutations = {
  setProducts: (state, payload) => (state.products = payload)
}
const actions = {
  getProducts: async ({ commit }) => {
    const { data } = await axios({
      method: 'GET',
      url: 'http://localhost:3000/products'
    })

    commit('setProducts', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
