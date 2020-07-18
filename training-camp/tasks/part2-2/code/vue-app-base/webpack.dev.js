const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const path = require('path')

module.exports = merge(commonConfig, {
  mode: 'development',
  devServer: {
    hot: true
  },
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        use: 'eslint-loader',
        include: path.join(__dirname, 'src'),
        enforce: 'pre'
      }
    ]
  }
})
