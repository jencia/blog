import request from '@/utils/request'

export function login (data) {
    return request({
        method: 'POST',
        url: '/api/users/login',
        data
    })
}

export function register (data) {
    return request({
        method: 'POST',
        url: '/api/users',
        data
    })
}

