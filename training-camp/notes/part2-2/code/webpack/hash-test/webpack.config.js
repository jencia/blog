const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'none',
    entry: {
        page1: './src/page1.js',
        page2: './src/page2.js',
    },
    output: {
        filename: '[name]-[contenthash].bundle.js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 0
        }
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}