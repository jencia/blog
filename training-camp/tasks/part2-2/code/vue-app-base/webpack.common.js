const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024,
              esModule: false
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: process.env.NODE_ENV !== 'production'
            }
          }
        ]
      },
      {
        test: /.(html|ejs)$/,
        use: {
          loader: 'ejs-loader',
          options: {
            esModule: false
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      BASE_URL: JSON.stringify('')
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'Vue 项目打包作业',
      template: 'public/index.html'
    })
  ]
}
