import cookie from 'js-cookie'
import cookieParser from 'cookieparser'

export const state = () => ({
    user: null
})

export const mutations = {
    setUser (state, payload) {
        cookie.set('user', payload)
        state.user = payload
    }
}

export const actions = {
    nuxtServerInit ({ commit }, { req }) {
        let user = null

        if (req.headers.cookie) {
            const parsed = cookieParser.parse(req.headers.cookie || '')

            try {
                user = JSON.parse(parsed.user)
            } catch (e) {}
        }

        commit('setUser', user)
    }
}