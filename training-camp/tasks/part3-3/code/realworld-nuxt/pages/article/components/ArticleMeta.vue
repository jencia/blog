<template>
    <div class="article-meta">
        <nuxt-link :to="`/profile/${article.author.username}`">
            <img :src="article.author.image" />
        </nuxt-link>
        <div class="info">
            <nuxt-link :to="`/profile/${article.author.username}`" class="author">
                {{ article.author.username }}
            </nuxt-link>
            <span class="date">{{ article.createAt | date }}</span>
        </div>

        <template v-if="article.author.username !== user.username">
            <button
                class="btn btn-sm btn-outline-secondary"
                :class="{ active: article.author.following }"
                :disabled="followingDisabled"
                @click="handleFollow"
            >
                <i class="ion-plus-round"></i>
                &nbsp;
                {{ article.author.following ? '取消' : '' }}关注
            </button>
            &nbsp;&nbsp;
            <button
                class="btn btn-sm btn-outline-primary"
                :class="{ active: article.favorited }"
                :disabled="favoriteDisabled"
                @click="handleFavorite"
            >
                <i class="ion-heart"></i>
                &nbsp;
                点赞 <span class="counter">({{ article.favoritesCount }})</span>
            </button>
        </template>
        

        <template v-else>
            <nuxt-link :to="`/editor/${article.slug}`" class="btn btn-outline-secondary btn-sm">
                <i class="ion-edit" /> 编辑文章
            </nuxt-link>
            <button
                class="btn btn-outline-danger btn-sm"
                :disabled="deleteDisabled"
                @click="handleDelete"
            >
                <i class="ion-trash-a" /> 删除文章
            </button>
        </template>

    </div>
</template>

<script>
import { mapState } from 'vuex'
import { addFollow, deleteFollow } from '@/api/profile'
import { addFavorite, deleteFavorite, deleteArticle } from '@/api/article'

export default {
    name: 'ArticleMeta',
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            followingDisabled: false,
            favoriteDisabled: false,
            deleteDisabled: false
        };
    },
    computed: mapState(['user']),
    methods: {
        async handleFollow () {
            const { author } = this.article

            this.followingDisabled = true
            const { data: { profile } } = author.following
                ? await deleteFollow(author.username)
                : await addFollow(author.username)

            author.following = profile.following
            this.followingDisabled = false
        },
        async handleFavorite () {
            this.favoriteDisabled = true
            const { data: { article: newArticle } } = this.article.favorited
                ? await deleteFavorite(this.article.slug)
                : await addFavorite(this.article.slug)

            this.article.favorited = newArticle.favorited
            this.article.favoritesCount = newArticle.favoritesCount
            this.favoriteDisabled = false
        },
        async handleDelete () {
            this.deleteDisabled = true
            await deleteArticle(this.article.slug)
            this.$router.push('/')
        }
    }
}
</script>

<style>

</style>