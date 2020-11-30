// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Jencia的个人博客',
  icon: {
    favicon: './src/favicon.png'
  },
  pathPrefix: '/vblog-gridsome',
  templates: {
    gist: [
      {
        path: '/gist/:id',
        component: './src/templates/gist.vue'
      }
    ]
  }
}
