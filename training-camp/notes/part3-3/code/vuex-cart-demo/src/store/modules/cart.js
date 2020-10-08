import axios from 'axios'

const amountFormat = (v = 0) => Math.round(v * 1e2) / 1e2

const state = {
  cartProducts: (() => {
    let data

    try {
      data = JSON.parse(window.localStorage.getItem('cart-products'))
    } catch (e) {}

    return Array.isArray(data) ? data : []
  })()
}
const getters = {
  totalCount: state => state.cartProducts.reduce((rs, v) => (rs + v.count), 0),
  totalPrice (state) {
    const result = state.cartProducts.reduce((rs, v) => (rs + v.total), 0)

    return amountFormat(result)
  },
  allChecked: state => state.cartProducts.every(v => v.checked),
  checkedTotalCount (state) {
    return state.cartProducts
      .filter(v => v.checked)
      .reduce((rs, v) => (rs + v.count), 0)
  },
  checkedTotalPrice (state) {
    const result = state.cartProducts
      .filter(v => v.checked)
      .reduce((rs, v) => (rs + v.total), 0)

    return amountFormat(result)
  }
}
const mutations = {
  clearCart: state => (state.cartProducts = []),
  addToCart (state, payload) {
    if (!payload || !payload.id) {
      return
    }
    const prod = state.cartProducts.find(v => v.id === payload.id)

    if (prod) {
      prod.count += 1
      prod.total = amountFormat(prod.price * prod.count)
      prod.checked = true
    } else {
      state.cartProducts.push({
        ...payload,
        count: 1,
        total: payload.price,
        checked: true
      })
    }
  },
  deleteFromCart (state, payload) {
    state.cartProducts = state.cartProducts.filter(v => v.id !== payload)
  },
  toggleChecked (state, payload) {
    const prod = state.cartProducts.find(v => v.id === payload)

    prod && (prod.checked = !prod.checked)
  },
  toggleAllChecked (state, payload) {
    state.cartProducts.forEach(v => (v.checked = payload))
  },
  updateCount (state, payload = {}) {
    const { id, count } = payload
    const prod = state.cartProducts.find(v => v.id === id)

    if (prod) {
      prod.count = count
      prod.total = amountFormat(count * prod.price)
    }
  }
}
const actions = {
  async pay (context) {
    const { data } = await axios({
      method: 'POST',
      url: 'http://localhost:3000/checkout'
    })

    if (data.success) {
      context.commit('clearCart')
      alert('支付成功')
    } else {
      alert('支付失败')
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
