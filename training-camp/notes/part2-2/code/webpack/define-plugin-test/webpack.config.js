const webpack = require('webpack')

module.exports = {
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            BASE_URL: JSON.stringify('http://localhost:8080/api')
        })
    ]    
}