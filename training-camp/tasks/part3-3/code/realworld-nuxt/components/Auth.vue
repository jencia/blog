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

                    <ul class="error-messages">
                        <li>That email is already taken</li>
                    </ul>

                    <form @submit.prevent="isLogin ? login() : register()">
                        <fieldset class="form-group" v-if="!isLogin">
                            <input
                                class="form-control form-control-lg"
                                type="text"
                                placeholder="请输入你的名称"
                                v-model="username"
                            >
                        </fieldset>
                        <fieldset class="form-group">
                            <input
                                class="form-control form-control-lg" type="text"
                                placeholder="请输入邮件地址"
                                v-model="email"
                            >
                        </fieldset>
                        <fieldset class="form-group">
                            <input
                                class="form-control form-control-lg"
                                type="password"
                                placeholder="请输入密码"
                                v-model="password"
                            >
                        </fieldset>
                        <button class="btn btn-lg btn-primary pull-xs-right">
                            {{ isLogin ? '登录' : '注册' }}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>
 
<script>
import { register } from '@/api/user';

export default {
    name: 'Auth',
    data () {
        return {
            username: '',
            email: '',
            password: ''
        };
    },
    computed: {
        isLogin () {
            return this.$route.name === 'login'
        }
    },
    methods: {
        login () {},
        async register () {
            const res = await register({ user: this.$data })

            console.log(res)
        }
    }
}
</script>
 