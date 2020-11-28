<template>
    <div>
        <h3>{{ $page.article.title }}</h3>
        <p>{{ $page.article.body }}</p>
    </div>
</template>

<page-query>
query ($id: ID!) {
    article (id: $id) {
        title
        body
    }
}
</page-query>

<script>
export default {
    name: 'ArticleDetail'
}
</script>
