const Generator = require('../model/Generator');

module.exports = {
    name: '多页应用',
    type: 'mpa',
    prompt: [
        {
            name: 'dirname',
            message: '请填写文件夹名称：',
            validate: value => {
                if (!value) return '不能为空';
                if (!/^[a-z0-9-]+$/.test(value)) {
                    return '命名不符合规范，请填写\'全小写中划线连接\'形式的名称';
                }
                return true;
            }
        },
        {
            name: 'title',
            message: '请填写多页模块的标题：'
        }
    ],
    then: ({ dirname, title }) => {
        const generator = new Generator(`src/pages/${dirname}`);

        generator
            .add('routes')
            .add('index.ejs',
                '<%= require(\'@/config/htmlEntryTpl.ejs\')({\r\n' +
                `    title: '${title}'\r\n` +
                '}) %>\r\n'
            )
            .add('index.js',
                'import \'@/config/global\';\r\n' +
                'import setRouter from \'@/config/router\';\r\n' +
                '\r\n' +
                'setRouter(module.id);\r\n'
            )
            .run();
    }
};
