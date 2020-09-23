<template>
  <div class="home-page">

    <div class="banner">
        <div class="container">
            <h1 class="logo-font">conduit</h1>
            <p>一个分享知识的地方</p>
        </div>
    </div>

    <div class="container page">
        <div class="row">
            <div class="col-md-9">
                <!-- Tabs -->
                <div class="feed-toggle">
                    <ul class="nav nav-pills outline-active">
                        <li class="nav-item" v-for="item in tabsOptions" :key="item.value">
                            <template v-if="item.value === 'you_feed' ? user : true">
                                <nuxt-link
                                    class="nav-link"
                                    :class="{ active: item.value === tab }"
                                    :to="{
                                        path: '/',
                                        query: {
                                            tab: item.value,
                                            tag: item.value === 'tag' ? tag : undefined
                                        }
                                    }"
                                >
                                    {{ item.label }}
                                </nuxt-link>                                
                            </template>
                        </li>
                    </ul>
                </div>
                <!-- /Tabs -->

                <!-- 文章列表 -->
                <div class="article-preview" v-if="!articles.length">暂无数据</div>

                <div class="article-preview" v-for="article in articles" :key="article.slug">
                    <div class="article-meta">
                        <nuxt-link :to="`/profile/${article.author.username}`">
                            <img :src="article.author.image" />
                        </nuxt-link>
                        <div class="info">
                            <nuxt-link :to="`/profile/${article.author.username}`">
                                {{ article.author.username }}
                            </nuxt-link>
                            <span class="date">{{ article.updatedAt | dateFormat }}</span>
                        </div>
                        <button
                            class="btn btn-sm pull-xs-right btn-outline-primary"
                            :class="{
                                'active': article.favorited
                            }"
                        >
                            <i class="ion-heart"></i> {{ article.favoritesCount }}
                        </button>
                    </div>
                    <nuxt-link :to="`/article/${article.slug}`" class="preview-link">
                        <h1>{{ article.title }}</h1>
                        <p>{{ article.description }}</p>
                        <span>查看详情>></span>
                    </nuxt-link>
                </div>
                <!-- /文章列表 -->

                <!-- 分页 -->
                <nav>
                    <ul class="pagination">
                        <li
                            v-for="num in totalPage"
                            :key="num"
                            class="page-item"
                            :class="{ active: num === page }"
                        >
                            <nuxt-link
                                class="page-link"
                                :to="{
                                    path: '/',
                                    query: {
                                        page: num,
                                        tag,
                                        tab
                                    }
                                }"
                            >
                                {{ num }}
                            </nuxt-link>
                        </li>
                    </ul>
                </nav>
                <!-- /分页 -->
            </div>

            <div class="col-md-3">
                <!-- 标签 -->
                <div class="sidebar">
                    <p>热门标签</p>
                    <div class="tag-list">
                        <nuxt-link
                            v-for="tag in tags"
                            :key="tag"
                            :to="{
                                path: '/',
                                query: {
                                    tab: 'tag',
                                    tag
                                }
                            }"
                            class="tag-pill tag-default"
                        >
                            {{ tag }}
                        </nuxt-link>
                    </div>
                </div>
                <!-- /标签 -->
            </div>

            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import { getArticles, getArticlesFeed } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'

export default {
    name: 'Home',
    async asyncData (context) {
        const limit = 10
        const { tag, tab = 'global_feed', page: _page } = context.query
        const page = +(_page || 1)
        const loaderArticls = tab === 'you_feed' ? getArticlesFeed : getArticles

        const [articleRes, tagData] = await Promise.all([
            loaderArticls({ tag, limit, offset: (page - 1) * limit }),
            getTags()
        ])
        const { articles, articlesCount } = articleRes.data
        const { tags } = tagData.data

        return {
            limit, page, tab, tag,
            tags, articles, articlesCount,
        }
    },
    watchQuery: ['page', 'tag', 'tab'],
    computed: {
        ...mapState(['user']),
        totalPage () {
            return Math.floor(this.articlesCount / this.limit)
        },
        tabsOptions () {
            const options = [
                { label: '我的资源', value: 'you_feed' },
                { label: '全部资源', value: 'global_feed' },
            ]

            this.tag && options.push({ label: `# ${this.tag}`, value: 'tag' })
            return options
        },
    },
    filters: {
        dateFormat: value => dayjs(value).format('YYYY-MM-DD')
    }
}
</script>
