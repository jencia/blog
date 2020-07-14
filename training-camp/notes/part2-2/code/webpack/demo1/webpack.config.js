const path = require('path')

module.exports = {
    entry: './src/main.js',
    mode: 'none',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.png$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10 * 1024
                    }
                }
            },
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attributes: {
                            list: [
                                {
                                    tag: 'img',
                                    attribute: 'src',
                                    type: 'src'
                                },
                                {
                                    tag: 'a',
                                    attribute: 'href',
                                    type: 'src'
                                }
                            ]
                        }
                    }
                }
            }
        ]
    }
}