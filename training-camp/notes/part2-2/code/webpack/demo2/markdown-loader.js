const marked = require('marked');

module.exports = source => {
    const html = marked(source)
    
    return html
}