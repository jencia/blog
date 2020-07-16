const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')

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
        enforce: 'pre'
      }
    ]
  }
})
