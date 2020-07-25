module.exports = {
    mode: 'none',
    module: {
        rules: [
            {
                test: /\.md$/,
                use: ['html-loader', './markdown-loader']
            }
        ]
    }
}