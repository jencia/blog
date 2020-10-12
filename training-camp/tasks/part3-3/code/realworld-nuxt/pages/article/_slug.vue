<template>
    <div class="article-page">

        <div class="banner">
            <div class="container">
                <h1>{{ article.title }}</h1>
                <ArticleMeta :article="article" />
            </div>
        </div>

        <div class="container page">
            <div class="row article-content">
                <div class="col-md-12">
                    <div v-html="article.body" />
                    <ul class="tag-list">
                        <li
                            class="tag-default tag-pill tag-outline"
                            v-for="(tag, index) in article.tagList"
                            :key="index"
                        >
                            {{ tag }}
                        </li>
                    </ul>
                </div>
            </div>
            <hr />
            <div class="article-actions">
                <ArticleMeta :article="article" />
            </div>

            <div class="row">
                <div class="col-xs-12 col-md-8 offset-md-2">
                    <ArticleComments :article="article" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ArticleMeta from './components/ArticleMeta'
import ArticleComments from './components/ArticleComments'
import { getArticleDetail } from '@/api/article'
import MarkdownIt from 'markdown-it'

export default {
    name: 'Article',
    components: { ArticleMeta, ArticleComments },
    async asyncData ({ params, redirect }) {
        try {
            const { data: { article } } = await getArticleDetail(params.slug)
            const md = new MarkdownIt()

            article.body = md.render(article.body)
            return { article }
        } catch (e) {
            redirect('/')
        }
    },
    head () {
        return {
            title: `${this.article.title} - conduit`,
            media: [
                { hid: 'description', name: 'description', content: this.article.description }
            ]
        }
    }
}
</script>
