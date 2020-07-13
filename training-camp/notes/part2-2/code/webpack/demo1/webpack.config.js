const path = require('path')

module.exports = {
    entry: './src/main.js',
    mode: 'none',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'output')
    }
}