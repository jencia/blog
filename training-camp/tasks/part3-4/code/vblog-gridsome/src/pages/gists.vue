<template>
  <Layout>
    <div style="min-height: 600px">
      <!-- 搜索功能暂时不做
      <el-card shadow="never" style="margin-bottom: 20px">
        <el-input placeholder="请输入关键字" v-model="searchKey" clearable style="width: 300px"></el-input>
        <el-button @click="search" icon="el-icon-search" style="margin-left: 10px" circle plain></el-button>
        <el-button @click="$share()" style="margin-left: 10px" icon="el-icon-share" type="warning" plain circle></el-button>
      </el-card> -->

      <div v-if="$page.allGist.edges.length > 0">
        <el-card shadow="hover" v-for="item in $page.allGist.edges" :key="item.node.id" style="margin-bottom: 20px">
          <div slot="header">
            <el-row>
              <el-col :span="16">
                <span>
                  <g-link style="text-decoration:none;cursor:pointer" :to="`/gist/${item.node.id}`">
                    <i class="el-icon-edit-outline"></i>&nbsp;&nbsp; {{item.node.title}}
                  </g-link>
                </span>
              </el-col>
              <el-col :span="8">
                <div style="text-align: right;">
                  <el-button @click="$share(`/gist/${item.node.id}`)" style="padding: 3px 0" type="text" icon="el-icon-share" />
                </div>
              </el-col>
            </el-row>
          </div>
          <div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
            最近更新 {{item.node.updateTime}}
          </div>
          <div style="font-size: 1.1rem;line-height: 1.5;color: #303133;padding: 10px 0px 0px 0px">
            {{item.node.description}}
          </div>
        </el-card>
        <div style="text-align: center">
          <el-pagination
            @current-change="$router.replace($event === 1 ? '/gists' : `/gists/${$event}`)"
            background
            layout="prev, pager, next"
            :current-page="$page.allGist.pageInfo.currentPage"
            :page-size="$page.allGist.pageInfo.perPage"
            :total="$page.allGist.pageInfo.totalItems"
          />
        </div>
      </div>
        
      <el-card
        shadow="never"
        style="margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center"
        v-else
      >
        <font style="font-size: 30px;color:#dddddd ">
          <b>还没有文章 (╯°Д°)╯︵ ┻━┻</b>
        </font>
      </el-card>
    </div>
  </Layout>
</template>

<page-query>
query ($page: Int) {
  allGist (perPage: 5, page: $page) @paginate {
    pageInfo {
      currentPage
      perPage
      totalItems
    }
    edges {
      node {
        id
        title
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
  name: 'Gists',
  metaInfo: {
    title: '代码分享'
  },
  // data () {
  //   return {
  //     searchKey: ''
  //   }
  // }
}
</script>
