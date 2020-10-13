import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

function findPosts () {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                data: [
                    { "content": "aaaaa" },
                    { "content": "bbbbb" },
                    { "content": "ccccc" }
                ]
            })
        }, 1000)
    })
}

export function createStore () {
    return new Vuex.Store({
        state: () => ({
            posts: []
        }),
        mutations: {
            setPosts: (state, payload) => (state.posts = payload)
        },
        actions: {
            async getPosts ({ commit }) {
                const { data } = await findPosts()

                commit('setPosts', data)
            }
        }
    })
}