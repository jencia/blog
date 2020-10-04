import axios from 'axios'

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io'
    // baseURL: 'http://realworld.api.fed.lagounews.com'
})

export default ({ store }) => {
    request.interceptors.request.use(config => {
        const { user } = store.state

        if (user && user.token) {
            config.headers.Authorization = `Token ${user.token}`
        }
        return config
    })
}
