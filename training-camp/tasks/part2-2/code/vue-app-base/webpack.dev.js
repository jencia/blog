const webpack = require('webpack')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const path = require('path')

module.exports = merge(commonConfig, {
  devServer: {
    hot: true
  },
  devtool: 'cheap-module-eval-source-map',
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
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
