<template>
  <Layout>
    <div style="min-height: 600px">
      <el-card shadow="never" style="min-height: 400px">
        <div slot="header">
          <el-row>
            <el-col :span="12">
              <span>{{$page.gist.title}}</span>
            </el-col>
            <el-col :span="12">
              <div style="text-align: right;">
                <el-button @click="$share()" style="padding: 3px 0" type="text" icon="el-icon-share">分享</el-button>
                <el-button style=" padding: 3px 0" type="text" icon="el-icon-more-outline" @click="$router.push('/gists')">更多博客</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
          发布 {{$page.gist.createTime}}
          <br> 更新 {{$page.gist.updateTime}}
        </div>
        <div style="font-size: 1.1rem;line-height: 1.5;color: #303133;border-bottom: 1px solid #E4E7ED;padding: 5px 0px 5px 0px">
          <pre style="font-family: '微软雅黑'">{{$page.gist.description}}</pre>
        </div>
        <div v-html="$page.gist.content" class="markdown-body" style="padding-top: 20px"></div>
      </el-card>
    </div>
  </Layout>
</template>

<page-query>
query ($id: ID!) {
  gist (id: $id) {
    id
    title
    createTime
    updateTime
    description
    content
  }
}
</page-query>

<script>
export default {
  name: 'Gist',
  metaInfo: {
    title: '代码详情'
  }
}
</script>