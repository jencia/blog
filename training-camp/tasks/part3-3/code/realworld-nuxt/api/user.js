import { request } from '@/plugins/request'

// 登录
export function login (data) {
    return request({
        method: 'POST',
        url: '/api/users/login',
        data
    })
}

// 注册
export function register (data) {
    return request({
        method: 'POST',
        url: '/api/users',
        data
    })
}

// 获取当前用户信息
export function getUser () {
    return request({
        method: 'GET',
        url: '/api/user'
    })
}

// 更新用户信息
export function updateUser (user) {
    return request({
        method: 'PUT',
        url: '/api/user',
        data: { user }
    })
}
