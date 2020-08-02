const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

/** @type {import('webpack').Configuration} */
module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.json']
  },
  devServer: {
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        resourceQuery: /blockType=docs/,
        loader: require.resolve('./docs-loader.js')
      },
      {
        test: /\.(js|vue)$/,
        use: 'eslint',
        enforce: 'pre',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[local]_[hash:base64:5]'
                  }
                }
              }
            ]
          },
          // 这里匹配普通的 `<style>` 或 `<style scoped>`
          {
            use: ['vue-style-loader', 'css-loader']
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HTMLWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
