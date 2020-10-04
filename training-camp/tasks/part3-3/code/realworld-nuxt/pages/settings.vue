<template>
    <div class="settings-page">
        <div class="container page">
            <div class="row">

                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">你的设置</h1>

                    <form @submit.prevent="handleUpdate">
                        <fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control"
                                    type="text"
                                    placeholder="头像 URL 地址"
                                    v-model="user.image"
                                    :disabled="loading"
                                >
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control form-control-lg"
                                    type="text"
                                    placeholder="用户名"
                                    v-model="user.username"
                                    :disabled="loading"
                                >
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea 
                                    class="form-control form-control-lg"
                                    rows="8"
                                    placeholder="关于你的个人简介"
                                    v-model="user.bio"
                                    :disabled="loading"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control form-control-lg"
                                    type="text"
                                    placeholder="电子邮箱"
                                    v-model="user.email"
                                    :disabled="loading"
                                >
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    class="form-control form-control-lg"
                                    type="password"
                                    placeholder="密码"
                                    v-model="user.password"
                                    :disabled="loading"
                                    minlength="8"
                                >
                            </fieldset>
                            <button class="btn btn-lg btn-primary pull-xs-right">
                                {{ loading ? '更新中...' : '更新个人信息' }}
                            </button>
                        </fieldset>
                    </form>
                    <hr>
                    <button class="btn btn-outline-danger" @click="handleLogout">
                        注销
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { getUser, updateUser } from '@/api/user'

export default {
    name: 'Settings',
    middleware: 'authenticated',
    data () {
        return {
            loading: false,
            user: {
                image: '',
                username: '',
                bio: '',
                email: '',
                password: ''
            }
        }
    },
    async mounted () {
        const { data: { user } } = await getUser()

        this.user = user
    },
    methods: {
        async handleUpdate () {
            this.loading = true
            const { data: { user } } = await updateUser(this.user)
            this.$store.commit('setUser', user)
            this.$router.push(`/profile/${user.username}`)
        },
        handleLogout () {
            this.$store.commit('setUser', null)
            this.$router.push('/login')
        }
    }
}
</script>
