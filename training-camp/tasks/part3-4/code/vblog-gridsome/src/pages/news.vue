<template>
  <Layout>
    <div style="min-height: 600px">
      <el-card shadow="never" style="min-height: 400px" v-if="gist.id">
        <div slot="header">
          <span>{{gist.title}}</span>
        </div>
        <div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
          发布 {{gist.createTime}}
          <br> 更新 {{gist.updateTime}}
        </div>
        <div style="font-size: 1.1rem;line-height: 1.5;color: #303133;border-bottom: 1px solid #E4E7ED;padding: 5px 0px 5px 0px">
          <pre style="font-family: '微软雅黑'">{{gist.description}}</pre>
        </div>
        <div v-html="gist.content" class="markdown-body" style="padding-top: 20px"></div>
      </el-card>
      <el-card shadow="never" style="margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-else>
        <font style="font-size: 30px;color:#dddddd ">
          <b>没有更新 ╮(๑•́ ₃•̀๑)╭</b>
        </font>
      </el-card>
    </div>
  </Layout>
</template>

<page-query>
query {
  allGist (perPage: 1, page: 1) {
    edges {
      node {
        id
        title
        content
        description
        createTime
        updateTime
      }
    }
  }
}
</page-query>

<script>
export default {
  name: 'News',
  metaInfo: {
    title: '最新动态'
  },
  computed: {
    gist () {
      const { edges } = this.$page.allGist
      
      if (edges.length === 0) {
        return {}
      }
      return edges[0].node
    }
  }
}
</script>
