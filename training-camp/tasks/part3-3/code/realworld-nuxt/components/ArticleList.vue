<template>
    <div>
        <!-- 文章列表 -->
        <div class="article-preview" v-if="loading">加载中...</div>
        <div class="article-preview" v-else-if="!articles.length">暂无数据</div>

        <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
                <nuxt-link :to="`/profile/${article.author.username}`">
                    <img :src="article.author.image" />
                </nuxt-link>
                <div class="info">
                    <nuxt-link :to="`/profile/${article.author.username}`">
                        {{ article.author.username }}
                    </nuxt-link>
                    <span class="date">{{ article.updatedAt | date }}</span>
                </div>
                <button
                    class="btn btn-sm pull-xs-right btn-outline-primary"
                    :class="{ 'active': article.favorited }"
                    :disabled="article.favoriteDisabled"
                    @click="handleFavorite(article)"
                >
                    <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
            </div>
            <nuxt-link :to="`/article/${article.slug}`" class="preview-link">
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>查看详情>></span>
                <ul class="tag-list">
                    <li
                        class="tag-default tag-pill tag-outline"
                        v-for="(tag, index) in article.tagList"
                        :key="index"
                    >
                        {{ tag }}
                    </li>
                </ul>
            </nuxt-link>
        </div>
        <!-- /文章列表 -->

        <!-- 分页 -->
        <nav v-if="totalPage > 1">
            <ul class="pagination">
                <li
                    v-for="num in totalPage"
                    :key="num"
                    class="page-item"
                    :class="{ active: num === page }"
                >
                    <a
                        href="javascript:;"
                        class="page-link"
                        @click="pageChange(num)"
                    >
                        {{ num }}
                    </a>
                </li>
            </ul>
        </nav>
        <!-- /分页 -->
    </div>
</template>

<script>
import { getArticles, getArticlesFeed, addFavorite, deleteFavorite } from '@/api/article'

export default {
    name: 'ArticleList',
    props: {
        tab: String,
        tag: String,
        author: String,
        favorited: String
    },
    data () {
        const limit = 10
        const { page: _page } = this.$route.query
        const page = +(_page || 1)

        return {
            limit, page,
            loading: false,
            articles: [],
            articlesCount: 0
        }
    },
    computed: {
        totalPage () {
            return Math.ceil(this.articlesCount / this.limit)
        }
    },
    async mounted () {
        this.query()
    },
    watch: {
        tab (newValue, oldValue) {
            if (newValue !== oldValue) {
                this.page = 1
                this.query({ tab: newValue })
            }
        },
        tag (newValue, oldValue) {
            if (newValue !== oldValue) {
                this.page = 1
                this.query({ tag: newValue })
            }
        },
        author (newValue, oldValue) {
            if (newValue !== oldValue && !!newValue) {
                this.page = 1
                this.query({ author: newValue, favorited: undefined })
            }
        },
        favorited (newValue, oldValue) {
            if (newValue !== oldValue && !!newValue) {
                this.page = 1
                this.query({ favorited: newValue, author: undefined })
            }
        }
    },
    methods: {
        async query (param) {
            const {
                tab = this.tab,
                tag = this.tag,
                page = this.page,
                author = this.author,
                favorited = this.favorited
            } = param || {};
            // 加载中，文章列表清空
            this.loading = true
            this.articles = []
            this.articlesCount = 0
            
            // 将当前状态记录到地址上  
            this.$router.push({
                path: this.$route.path,
                query: { tab, tag, page, author, favorited }
            })

            // 我关注的 tab 下接口不一样
            const loaderArticls = tab === 'you_feed' ? getArticlesFeed : getArticles
            const { data: { articles, articlesCount } } = await loaderArticls({
                tag: tag,
                author: author,
                favorited: favorited,
                limit: this.limit,
                offset: (page - 1) * this.limit
            })

            articles.forEach(v => (v.favoriteDisabled = false))
            this.articles = articles
            this.articlesCount = articlesCount
            this.loading = false
        },
        pageChange (page) {
            if (page !== this.page) {
                this.page = page
                this.query()
            }
        },
        async handleFavorite (article) {
            article.favoriteDisabled = true
            const { data: { article: newArticle } } = article.favorited
                ? await deleteFavorite(article.slug)
                : await addFavorite(article.slug)

            article.favorited = newArticle.favorited
            article.favoritesCount = newArticle.favoritesCount
            article.favoriteDisabled = false
        }
    }
}
</script>
