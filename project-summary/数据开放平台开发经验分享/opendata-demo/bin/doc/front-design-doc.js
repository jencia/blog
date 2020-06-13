const markdonParse = require('markmap/lib/parse.markdown');
const headingsTransform = require('markmap/lib/transform.headings');
const Generator = require('../model/Generator');

function toMarkdown (data) {
    return data.reduce((rs1, page) => rs1 + (
        `## ${page.title}\r\n` +
        (!page.spaList.length ?
            (
                `- 模块名称：${page.name}\r\n` +
                `- 模块路径：${page.path}\r\n` +
                `- 访问地址：[${page.url}](${page.url})\r\n`
            ) :
            (page.spaList.reduce((rs2, spa) => rs2 + (
                `### ${spa.title}\r\n` +
                (spa.designFile ? `![组件设计](../../${spa.designFile})\r\n` : '') +
                `- 组件名称：${spa.name}\r\n` +
                `- 组件路径：${spa.path}\r\n` +
                `- 访问路径：[${spa.url}](${spa.url})\r\n` +
                `- 原型地址：${spa.archetypes ? `[${spa.archetypes}](${spa.archetypes})\r\n` : '无\r\n'}`
            ), ''))
        ) + '\r\n'
    ), '[TOC]\r\n# 前端设计文档\r\n');
}

function toMindmap (mdContent) {
    const headings = markdonParse(mdContent);
    const markmapData = headingsTransform(headings);
    const indexJsContent = 
        `markmap('svg#mindmap', ${JSON.stringify(markmapData)}, {\r\n` +
        '    preset: \'colorful\',\r\n' +
        '    linkShape: \'diagonal\'\r\n' +
        '});\r\n';
    const dependFileList = [
        'css/view.mindmap.css -> node_modules/markmap/style/view.mindmap.css',
        'js/d3.min.js -> node_modules/d3/d3.min.js',
        'js/d3-flextree.js -> node_modules/markmap/lib/d3-flextree.js',
        'js/view.mindmap.js -> node_modules/markmap/lib/view.mindmap.js',
        ['js/index.js', indexJsContent]
    ]
    // 提取dependFileList的路径左边部分
    const dependPaths = dependFileList.map(item => (
        (Array.isArray(item) ? item[0] : item).split(/\s*->\s*/)[0]
    ));
    const htmlContent = 
        '<!DOCTYPE html>\r\n' +
        '<html>\r\n' +
        '<head>\r\n' +
        '    <meta charset="utf-8">\r\n' +
        '    <title>前端设计文档</title>\r\n' +
        `    <link rel="stylesheet" href="${dependPaths[0]}">\r\n` +
        '    <style>html,body,svg{width:100%;height:100%;margin:0}</style>\r\n' +
        '</head>\r\n' +
        '<body>\r\n' +
        '    <svg id="mindmap"></svg>\r\n' +
        `    <script src="${dependPaths[1]}"></script>\r\n` +
        `    <script src="${dependPaths[2]}"></script>\r\n` +
        `    <script src="${dependPaths[3]}"></script>\r\n` +
        `    <script src="${dependPaths[4]}"></script>\r\n` +
        '</body>\r\n' +
        '</html>\r\n';

    return [htmlContent, dependFileList];
}

function generate (data) {
    const mdContent = toMarkdown(data);
    const [htmlContent, dependFileList] = toMindmap(mdContent);
    const generator = new Generator('docs/前端设计文档');

    generator
        .add('页面设计文档.md', mdContent)
        .add(dependFileList)
        .add('路由设计思维导图.html', htmlContent)
        .run()
}

module.exports = {
    generate
};