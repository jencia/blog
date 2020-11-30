<template>
  <Layout>
    <div>
      <el-card shadow="never" style="min-height: 400px;margin-bottom: 20px;padding: 0px 0px 20px 0px">
        <el-tabs v-model="activeTab" type="card" @tab-click="handleTabChange">
            <el-tab-pane :label="`粉丝${$page.allFollowers.pageInfo.totalItems}`" name="followers" style="padding: 5px">
              <div v-if="$page.allFollowers.edges.length">
                <el-row style="min-height: 200px; ">
                  <el-col :span="8" v-for="item in $page.allFollowers.edges" :key="item.node.id" style="padding: 10px">
                    <el-card shadow="hover" style="font-size: 13px;color: #606266;line-height: 20px">
                      <i class="el-icon-star-off"></i>&emsp;
                      <a @click="$router.push(`/user/${item.node.name}`)" style="text-decoration:none;cursor:pointer">{{item.node.name}}</a>
                      <br />
                      <i class="el-icon-message"></i>&emsp;
                      <a :href="item.node.htmlUrl" target="_blank" style=" text-decoration:none;cursor:pointer">TA的主页</a>
                      <br />
                      <img :src="item.node.avatarUrl" style="width: 100%;border-radius:5px;margin-top: 5px">
                    </el-card>
                  </el-col>
                </el-row>
                <div style="text-align: center;margin-top: 10px">
                  <el-pagination
                    @current-change="$router.replace($event === 1 ? '/social' : `/social/${$event}`)"
                    background
                    layout="prev, pager, next"
                    :current-page="$page.allFollowers.pageInfo.currentPage"
                    :page-size="$page.allFollowers.pageInfo.perPage"
                    :total="$page.allFollowers.pageInfo.totalItems"
                  />
                </div>
              </div>
              <div style="min-height: 300px;margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-else>
                <font style="font-size: 30px;color:#dddddd ">
                  <b>(￢_￢) 没有一个粉丝</b>
                </font>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="`关注${$page.allFollowing.pageInfo.totalItems}`" name="following" style="padding: 5px">
              <div v-if="$page.allFollowing.edges.length">
                <el-row style="min-height: 200px; ">
                  <el-col :span="8" v-for="item in $page.allFollowing.edges" :key="item.node.id" style="padding: 10px">
                    <el-card shadow="hover" style="font-size: 13px;color: #606266;line-height: 20px">
                      <i class="el-icon-star-off"></i>&emsp;
                      <a @click="$router.push(`/user/${item.node.name}`)" style=" text-decoration:none;cursor:pointer">{{item.node.name}}</a>
                      <br />
                      <i class="el-icon-message"></i>&emsp;
                      <a :href="item.node.htmlUrl" target="_blank" style=" text-decoration:none;cursor:pointer">TA的主页</a>
                      <br />
                      <img :src="item.node.avatarUrl" style="width: 100%;border-radius:5px;margin-top: 5px">
                    </el-card>
                  </el-col>
                </el-row>
                <div style="text-align: center;margin-top: 10px">
                    <el-pagination
                      @current-change="$router.replace($event === 1 ? '/social' : `/social/${$event}`)"
                      background
                      layout="prev, pager, next"
                      :current-page="$page.allFollowing.pageInfo.currentPage"
                      :page-size="$page.allFollowing.pageInfo.perPage"
                      :total="$page.allFollowing.pageInfo.totalItems"
                    />
                </div>
              </div>
              <div style="min-height: 300px;margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-else>
                <font style="font-size: 30px;color:#dddddd ">
                  <b>(￢_￢) 还没有关注一个人</b>
                </font>
              </div>
            </el-tab-pane>
          </el-tabs>
      </el-card>
    </div>
  </Layout>
</template>

<page-query>
query ($page: Int) {
  allFollowers (perPage: 9, page: $page) @paginate {
    pageInfo {
      currentPage
      perPage
      totalItems
    }
    edges {
      node {
        id
        name
        avatarUrl
        htmlUrl
      }
    }
  }
  allFollowing (perPage: 9, page: $page) @paginate {
    pageInfo {
      currentPage
      perPage
      totalItems
    }
    edges {
      node {
        id
        name
        avatarUrl
        htmlUrl
      }
    }
  }
}
</page-query>

<script>
export default {
  name: 'Social',
  metaInfo: {
    title: '社交圈'
  },
  data () {
    return {
      activeTab: 'followers'
    }
  },
  methods: {
    handleTabChange () {
      if (this.$route.path !== '/social') {
        this.$router.replace('/social')
      }
    }
  }
}
</script>
