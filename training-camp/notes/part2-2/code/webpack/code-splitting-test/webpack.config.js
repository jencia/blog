const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'none',
    entry: {
        page1: './src/page1.js',
        page2: './src/page2.js',
    },
    output: {
        filename: '[name].bundle.js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 0
        }
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
            filename: 'page1.html',
            chunks: ['page1']
        }),
        new HTMLWebpackPlugin({
            template: './src/index.html',
            filename: 'page2.html',
            chunks: ['page2']
        }),
    ]
}