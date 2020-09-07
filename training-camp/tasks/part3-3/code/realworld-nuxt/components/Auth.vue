<template>
    <div class="auth-page">
        <div class="container page">
            <div class="row">

                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">{{ isLogin ? '登录' : '注册' }}</h1>
                    <p class="text-xs-center">
                        <nuxt-link to="register" v-if="isLogin">还没有账号？</nuxt-link>
                        <nuxt-link to="/login" v-else>已经有账号了？</nuxt-link>
                    </p>
                    
                    <ul class="error-messages" v-if="errors">
                        <template v-for="field in Object.keys(errors)">
                            <li v-for="msg in errors[field]" :key="field + msg">{{ field + msg }}</li>
                        </template>
                    </ul>

                    <form @submit.prevent="handleSubmit">
                        <fieldset class="form-group" v-if="!isLogin">
                            <input
                                class="form-control form-control-lg"
                                type="text"
                                placeholder="请输入你的名称"
                                v-model="user.username"
                                required
                            >
                        </fieldset>
                        <fieldset class="form-group">
                            <input
                                class="form-control form-control-lg" type="text"
                                placeholder="请输入邮件地址"
                                v-model="user.email"
                                required
                            >
                        </fieldset>
                        <fieldset class="form-group">
                            <input
                                class="form-control form-control-lg"
                                type="password"
                                placeholder="请输入密码"
                                v-model="user.password"
                                required
                                minlength="8"
                            >
                        </fieldset>
                        <button class="btn btn-lg btn-primary pull-xs-right" :disabled="loading">
                            {{ isLogin ? '登录' : '注册' }}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>
 
<script>
import { register, login } from '@/api/user'

export default {
    name: 'Auth',
    data () {
        return {
            user: {
                username: '',
                email: '',
                password: ''
            },
            loading: false,
            errors: null
        };
    },
    computed: {
        isLogin () {
            return this.$route.name === 'login'
        }
    },
    methods: {
        async handleSubmit () {
            try {
                this.loading = true
                const res = await (this.isLogin ? login : register)({ user: this.user })
                const { user } = res.data || {}
                
                this.errors = null
                this.$store.commit('setUser', user)
                this.$router.push('/')
            } catch (e) {
                this.errors = e?.response?.data?.errors
            } finally {
                this.loading = false
            }
        }
    }
}
</script>
 