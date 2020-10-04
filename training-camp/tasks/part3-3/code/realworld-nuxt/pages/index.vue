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
                                <a
                                    href="javascript:;"
                                    class="nav-link"
                                    :class="{ active: item.value === tab }"
                                    @click="tabChange(item.value)"
                                >
                                    {{ item.label }}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <!-- /Tabs -->

                    <ArticleList :tab="tab" :tag="tag" />
                </div>

                <div class="col-md-3">
                    <!-- 标签 -->
                    <div class="sidebar">
                        <p>热门标签</p>
                        <div class="tag-list" v-if="tags.length === 0">
                            <small>加载中...</small>
                        </div>
                        <div class="tag-list" v-else>
                            <a
                                href="javascript:;"
                                v-for="tag in tags"
                                :key="tag"
                                @click="tagChange(tag)"
                                class="tag-pill tag-default"
                            >
                                {{ tag }}
                            </a>
                        </div>
                    </div>
                    <!-- /标签 -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import ArticleList from '@/components/ArticleList'
import { getTags } from '@/api/tag'

export default {
    name: 'Home',
    components: { ArticleList },
    data () {
        const { tab, tag } = this.$route.query

        return {
            tab: tab || 'global_feed',
            tag: tag || undefined,
            tags: []
        }
    },
    async mounted () {
        const { data: { tags } } = await getTags()

        this.tags = tags
    },
    computed: {
        ...mapState(['user']),
        tabsOptions () {
            const options = [{ label: '推荐', value: 'global_feed' }]

            this.user && options.unshift({ label: '关注', value: 'you_feed' })
            this.tag && options.push({ label: `# ${this.tag}`, value: 'tag' })
            return options
        }
    },
    methods: {
        tabChange (tab) {
            this.tab = tab
            this.tag = tab === 'tag' ? this.tag : undefined
        },
        tagChange (tag) {
            this.tab = 'tag'
            this.tag = tag
        }
    }
}
</script>
