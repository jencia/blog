const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')

const PORT = 8080

module.exports = merge(commonConfig, {
  output: {
    filename: 'bundle.js'
  },
  devServer: {
    hot: true,
    port: PORT,
    contentBase: './public'
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(vue|js)$/,
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
