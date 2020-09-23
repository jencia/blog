import request from '@/utils/request'

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

