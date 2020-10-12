<template>
    <div class="editor-page">
        <div class="container page">
            <div class="row">

            <div class="col-md-10 offset-md-1 col-xs-12">
                <form ref="form">
                    <fieldset>
                        <fieldset class="form-group">
                            <input
                                type="text"
                                class="form-control form-control-lg"
                                placeholder="文章标题"
                                required
                                v-model="article.title"
                                :disabled="loading"
                            >
                        </fieldset>
                        <fieldset class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="这篇文章是关于什么的？"
                                required
                                v-model="article.description"
                                :disabled="loading"
                            >
                        </fieldset>
                        <fieldset class="form-group">
                            <textarea
                                class="form-control"
                                rows="8"
                                placeholder="写文章（支持 Markdown 语法）"
                                required
                                v-model="article.body"
                                :disabled="loading"
                            />
                        </fieldset>
                        <fieldset class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="输入标签名按回车键"
                                v-model="tag"
                                :disabled="loading"
                                @keypress.enter="addTag"
                            >
                            <ul class="tag-list">
                                <li
                                    class="tag tag-default"
                                    v-for="(tag, index) in article.tagList"
                                    :key="index"
                                >
                                    <i class="ion-close-round" @click="removeTag(index)"/>
                                    {{ tag }}
                                </li>
                            </ul>
                        </fieldset>
                        <button
                            class="btn btn-lg pull-xs-right btn-primary"
                            type="button"
                            :disabled="loading"
                            @click="handlePublish"
                        >
                            {{ loading ? '发布中...' : '发布文章' }}
                        </button>
                    </fieldset>
                </form>
            </div>

            </div>
        </div>
    </div>
</template>

<script>
import { createArticle, getArticleDetail, updateArticle } from '@/api/article'

export default {
    name: 'Editor',
    middleware: 'authenticated',
    async asyncData ({ params: { slug }, redirect }) {
        try {
            let article = {
                title: '',
                description: '',
                body: '',
                tagList: []
            }

            if (slug) {
                const { data } = await getArticleDetail(slug)

                article = data.article
            }

            return {
                article,
                loading: false,
                tag: ''
            }
        } catch (e) {
            redirect('/')
        }
    },
    methods: {
        addTag () {
            const tag = this.tag.trim()
            const { tagList } = this.article

            if (tag && tagList.indexOf(tag) === -1) {
                tagList.push(tag)
                this.tag = ''
            }
        },
        removeTag (index) {
            this.article.tagList.splice(index, 1)
        },
        async handlePublish () {
            if (!this.$refs.form.reportValidity()) {
                return
            }
            
            this.loading = true
            const requestFn = this.article.slug ? updateArticle : createArticle
            const { data: { article: newArticle } } = await requestFn(this.article)
                
            this.$router.push(`/article/${newArticle.slug}`)
        }
    }
}
</script>

<style>

</style>