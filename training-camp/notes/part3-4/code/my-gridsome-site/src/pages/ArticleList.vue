<template>
    <Layout>
        <ul>
            <li v-for="article in $page.articleList.edges" :key="article.node.id">
                <g-link :to="`/article-detail/${article.node.id}`">{{ article.node.title }}</g-link>
            </li>
        </ul>
        <Pager :info="$page.articleList.pageInfo" />
    </Layout>
</template>

<page-query>
  query ($page: Int) {
    articleList: allArticle (perPage: 10, page: $page) @paginate {
        pageInfo {
            currentPage
            totalPages
        }
        edges {
            node {
                id
                title
                body
            }
        }
    }
  }
</page-query>

<script>
import { Pager } from 'gridsome'

export default {
    name: 'ArticleList',
    components: { Pager }
}
</script>
