// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const config = require('./src/config')
const request = require('./src/utils/request')
const moment = require('moment')
const MarkdownIt = require('markdown-it');

module.exports = api => {
  
  // 加载 gist
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('gist')
    const md = new MarkdownIt();

    const { data } = await request(`/users/${config.USERNAME}/gists`)
    const gistDetails = await Promise.all(data.map(v => request(`/gists/${v.id}`)))

    for (let i = 0; i < data.length; i++) {
      const item = data[i]

      for (let key in item.files) {
        collection.addNode({
          title: key,
          url: item.files[key],
          content: md.render(gistDetails[i].data.files[key].content),
          description: item.description,
          createTime: moment(item.created_at).format('YYYY-MM-DD HH:mm:SS'),
          updateTime: moment(item.updated_at).format('YYYY-MM-DD HH:mm:SS'),
        })
        break
      }
    }
  })

  // 加载 project
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('project')
    const { data } = await request(`users/${config.USERNAME}/repos`)

    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      
      collection.addNode({
        id: item['id'],
        name: item['name'],
        url: item['html_url'],
        description: item['description'],
        stargazersCount: item['stargazers_count'],
        watchersCount: item['watchers_count'],
        forksCount: item['forks_count'],
        language: item['language'],
        license: item['license'] ? item['license']['spdx_id'] : '',
        createTime: moment(item['created_at']).format('YYYY-MM-DD HH:mm:SS'),
        updateTime: moment(item['updated_at']).format('YYYY-MM-DD HH:mm:SS'),
      })
    }
  })

  // 加载 followers
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('followers')
    const { data } = await request(`/users/${config.USERNAME}/followers`)

    data.forEach(item => {
      collection.addNode({
        name: item.login,
        avatarUrl: item.avatar_url,
        htmlUrl: item.html_url,
      })
    })
  })

  // 加载 following
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('following')
    const { data } = await request(`/users/${config.USERNAME}/following`)

    data.forEach(item => {
      collection.addNode({
        name: item.login,
        avatarUrl: item.avatar_url,
        htmlUrl: item.html_url,
      })
    })
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
    createPage({
      path: '/',
      component: './src/pages/news.vue'
    })
  })
}
