<template>
    <div>
       <form class="card comment-form">
            <div class="card-block">
                <textarea
                    class="form-control"
                    placeholder="请填写评论..."
                    rows="3"
                    v-model="content"
                ></textarea>
            </div>
            <div class="card-footer">
                <img :src="article.author.image" class="comment-author-img" />
                <button
                    class="btn btn-sm btn-primary"
                    :disabled="loading"
                    @click="handlePublish"
                >
                    {{ loading ? '发表中...' : '发表评论' }}
                </button>
            </div>
        </form>
        
        <div
            class="card"
            v-for="comment in comments"
            :key="comment.id"
        >
            <div class="card-block">
                <p class="card-text">{{ comment.body }}</p>
            </div>
            <div class="card-footer">
                <nuxt-link :to="`/profile/${comment.author.username}`" class="comment-author">
                    <img :src="comment.author.image" class="comment-author-img" />
                </nuxt-link>
                &nbsp;
                <nuxt-link :to="`/profile/${comment.author.username}`" class="comment-author">
                    {{ comment.author.username }}
                </nuxt-link>
                <span class="date-posted">{{ comment.createdAt | date }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { getArticleComments, publishComment } from '@/api/article'

export default {
    name: 'ArticleComments',
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            comments: [],
            content: '',
            loading: false
        }
    },
    async mounted () {
        const { data } = await getArticleComments(this.article.slug)

        this.comments = data.comments
    },
    methods: {
        async handlePublish () {
            this.loading = true
            const { data: { comment } } = await publishComment(this.article.slug, this.content)

            this.comments.unshift(comment)
            this.content = ''
            this.loading = false
        }
    }
}
</script>
