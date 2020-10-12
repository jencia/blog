<template>
    <div class="profile-page">
        <div class="user-info">
            <div class="container">
            <div class="row">

                <div class="col-xs-12 col-md-10 offset-md-1">
                    <img :src="profile.image" class="user-img" />
                    <h4>{{ profile.username }}</h4>
                    <p>{{ profile.bio }}</p>
                    <button
                        v-if="!isMe"
                        class="btn btn-sm btn-outline-secondary action-btn"
                        :class="{ active: profile.following }"
                        :disabled="followingDisabled"
                        @click="handleFollowing"
                    >
                        <i class="ion-plus-round"></i>
                        &nbsp;
                        {{ profile.following ? '取消关注' : '关注' }}
                    </button>
                    <nuxt-link
                        v-else
                        class="btn btn-sm btn-outline-secondary action-btn"
                        to="/settings"
                    >
                        <i class="ion-gear-a" /> 编辑个人信息
                    </nuxt-link>
                </div>

            </div>
            </div>
        </div>

        <div class="container">
            <div class="row">

                <div class="col-xs-12 col-md-10 offset-md-1">
                    <div class="articles-toggle">
                    <ul class="nav nav-pills outline-active">
                        <li
                            class="nav-item"
                            v-for="item in tabOptions"
                            :key="item.value"
                        >
                            <a
                                class="nav-link"
                                :class="{ active: item.value === active }"
                                href="javascript:;"
                                @click="active = item.value"
                            >
                                {{ item.label }}
                            </a>
                        </li>
                    </ul>
                    </div>

                    <ArticleList
                        :author="active === 0 ? profile.username : undefined"
                        :favorited="active === 1 ? profile.username : undefined"
                    />
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import ArticleList from '@/components/ArticleList';
import { getProfile, addFollow, deleteFollow } from '@/api/profile'

export default {
    name: 'FavoritesArticle',
    middleware: 'authenticated',
    components: { ArticleList },
    async asyncData ({ params, redirect }) {
        try {
            const { data: { profile } } = await getProfile(params.username)

            return {
                profile,
                active: 0,
                followingDisabled: false
            }
        } catch (e) {
            redirect('/')
        }
    },
    computed: {
        ...mapState(['user']),
        isMe () {
            return this.profile.username === this.user.username
        },
        tabOptions () {
            return [
                { label: `${this.isMe ? '我' : '他'}的文章`, value: 0 },
                { label: '点赞文章', value: 1 },
            ]
        }
    },
    methods: {
        async handleFollowing () {
            const { following, username } = this.profile

            this.followingDisabled = true
            const requestFn = following ? deleteFollow : addFollow
            const { data: { profile: newProfile } } = await requestFn(username)

            this.profile = newProfile    
            this.followingDisabled = false
        }
    }
}
</script>
