import { request } from '@/plugins/request'

// 获取简介信息
export function getProfile (username) {
    return request({
        method: 'GET',
        url: `/api/profiles/${username}`
    })
}

// 添加关注
export function addFollow (username) {
    return request({
        method: 'POST',
        url: `/api/profiles/${username}/follow`
    })
}

// 取消关注
export function deleteFollow (username) {
    return request({
        method: 'DELETE',
        url: `/api/profiles/${username}/follow`
    })
}
