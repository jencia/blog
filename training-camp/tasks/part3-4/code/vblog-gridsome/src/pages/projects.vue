<template>
  <Layout>
    <div style="min-height: 600px">
      <!-- 搜索功能暂时不做
      <el-card shadow="never" style="margin-bottom: 20px">
        <el-input placeholder="请输入关键字" v-model="searchKey" clearable style="width: 300px"></el-input>
        <el-button @click="search" icon="el-icon-search" style="margin-left: 10px" circle plain></el-button>
        <el-button @click="$share()" icon="el-icon-share" type="warning" style="margin-left: 10px" plain circle></el-button>
      </el-card> -->

      <div v-if="$page.allProject.edges.length > 0">
        <el-card shadow="hover" v-for="item in $page.allProject.edges" :key="item.node.id" style="margin-bottom: 20px">
          <div slot="header">
            <el-row>
              <el-col :span="16">
                <span>
                  <g-link style="text-decoration:none;cursor:pointer" :to="`/project/${item.node.name}`">
                    <i class="el-icon-service"></i>&nbsp;&nbsp; {{item.node.name}}
                  </g-link>
                </span>
              </el-col>
              <el-col :span="8">
                <div style="text-align: right;">
                  <el-button @click="goGithub(item.node.url)" style="padding: 3px 0" type="text" icon="el-icon-back">前往GitHub</el-button>
                  <el-button @click="$share(`/project/${item.node.name}`)" style="padding: 3px 0" type="text" icon="el-icon-share"></el-button>
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
          <div style="font-size: 1.1rem;color: #303133;padding: 10px 0px 0px 0px">
            <el-row>
              <el-col :span="16" style="padding-top: 5px">
                <el-tooltip effect="dark" :content="'star '+item.node.stargazersCount" placement="bottom">
                  <i class="el-icon-star-off" style="margin: 0px 5px 0px 0px"></i>
                </el-tooltip>
                {{item.node.stargazersCount}}
                <el-tooltip effect="dark" :content="'watch '+item.node.watchersCount" placement="bottom">
                  <i class="el-icon-view" style="margin: 0px 5px 0px 15px"></i>
                </el-tooltip>
                {{item.node.watchersCount}}
                <el-tooltip effect="dark" :content="'fork '+item.node.forksCount" placement="bottom">
                  <i class="el-icon-bell" style="margin: 0px 5px 0px 15px"></i>
                </el-tooltip>
                {{item.node.forksCount}}
              </el-col>
              <el-col :span="8" style="text-align: right;">
                <el-tag size="small" type="danger" v-if="item.node.license" style="margin-left: 8px">{{item.node.license}}</el-tag>
                <el-tag size="small" type="success" v-if="item.node.language" style="margin-left: 8px">{{item.node.language}}</el-tag>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <div style="text-align: center">
          <el-pagination
            @current-change="$router.replace($event === 1 ? '/projects' : `/projects/${$event}`)"
            background
            layout="prev, pager, next"
            :current-page="$page.allProject.pageInfo.currentPage"
            :page-size="$page.allProject.pageInfo.perPage"
            :total="$page.allProject.pageInfo.totalItems"
          />
        </div>
      </div>

      <el-card shadow="never" style="margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-else>
        <font style="font-size: 30px;color:#dddddd ">
          <b>还没有开源项目 (╯°Д°)╯︵ ┻━┻</b>
        </font>
      </el-card>
    </div>
  </Layout>
</template>

<page-query>
query ($page: Int) {
  allProject (perPage: 5, page: $page, sortBy: "updateTime", order: DESC) @paginate {
    pageInfo {
      currentPage
      perPage
      totalItems
    }
    edges {
      node {
        id
        name
        url
        description
        stargazersCount
        watchersCount
        forksCount
        language
        license
        createTime
        updateTime
      }
    }
  }
}
</page-query>

<script>
export default {
  name: 'Projects',
  metaInfo: {
    title: '开源项目'
  },
  // data() {
  //   return {
  //     searchKey: ''
  //   }
  // },
  methods: {
    goGithub(url) {
        window.open(url)
    }
  }
}
</script>
