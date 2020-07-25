const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

class MyPlugin {
    apply (compiler) {
        compiler.hooks.emit.tap('MyPlugin', compilation => {
            for (const name in compilation.assets) {
                if (/\.js$/.test(name)) {
                    const content = compilation.assets[name].source();
                    const result = content.replace(/\/\*\*+\*\//g, '')

                    compilation.assets[name] = {
                        source: () => result,
                        size: () => result.length
                    }
                }
            }
        })
    }
}

module.exports = {
    entry: './src/main.js',
    mode: 'none',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
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
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            title: '标题',
            meta: {
                viewport: 'width=device-width'
            },
            template: './src/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public' }
            ]
        }),
        new MyPlugin()
    ]
}