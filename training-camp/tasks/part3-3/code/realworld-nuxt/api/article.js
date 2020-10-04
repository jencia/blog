import { request } from '@/plugins/request'

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
        params
    })
}

// 添加点赞
export function addFavorite (slug) {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/favorite`
    })
}
// 取消点赞
export function deleteFavorite (slug) {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/favorite`
    })
}

// 获取文章详情
export function getArticleDetail (slug) {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}`
    })
}

// 发布文章
export function createArticle (article) {
    return request({
        method: 'POST',
        url: '/api/articles',
        data: { article }
    })
}

// 更新文章
export function updateArticle (article) {
    return request({
        method: 'PUT',
        url: `/api/articles/${article.slug}`,
        data: { article }
    })
}

// 删除文章
export function deleteArticle (slug) {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}`
    })
}

// 获取评论列表
export function getArticleComments (slug) {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}/comments`
    })
}

// 发表评论
export function publishComment (slug, content) {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/comments`,
        data: {
            comment: {
                body: content
            }
        }
    })
}
