import request from '@/utils/request'

// 获取全部资源文章列表
export function getArticles (params) {
    return request({
        method: 'GET',
        url: '/api/articles',
        params
    })
}

// 获取我的资源文章列表
export function getArticlesFeed (params) {
    return request({
        method: 'GET',
        url: '/api/articles/feed',
        params,
        headers: {
            Authorization: 'Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTEzMDE2LCJ1c2VybmFtZSI6InRlc3QwOTA2IiwiZXhwIjoxNjA2MDYyMzMzfQ.zJuVEFE8QYu5Xptj5Jc1xaNqE03FxbvQ7TxljPwdPNQ'
        }
    })
}
