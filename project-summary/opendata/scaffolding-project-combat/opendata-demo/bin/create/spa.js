const fs = require('fs');
const pathTools = require('path');
const os = require('os');
const Generator = require('../model/Generator');
const { publicPath = '', port = '4000' } = require('../../webpack.config');
const moment = require('moment');
const username = os.hostname().toLowerCase().split('-').slice(-1)[0];

module.exports = {
    name: '页面',
    type: 'spa',
    prompt: [
        {
            name: 'module',
            type: 'list',
            message: '请选择所属多页模块：',
            choices: () => fs.readdirSync('src/pages')
                .filter(dir => fs.existsSync(`src/pages/${dir}/routes`))
        },
        {
            name: 'filename',
            message: '请填写页面组件名称：',
            validate: value => {
                if (!value) return '不能为空';
                if (!/^[A-Z][a-zA-Z0-9]+$/.test(value)) {
                    return '命名不符合规范，请填写\'大驼峰\'形式的名称';
                }
                return true;
            }
        },
        {
            name: 'title',
            message: '请填写页面标题：'
        },
        {
            name: 'archetypes',
            message: '请填写页面原型地址：'
        }
    ],
    then: ({ module, filename, title, archetypes }) => {
        const generator = new Generator(`src/pages/${module}/routes/${filename}`);
        const pathName = filename
            .split('')
            .map((v, i) => {
                if (i === 0) return v.toLowerCase();
                if (v.charCodeAt(0) < 97) return `_${v.toLowerCase()}`;
                return v;
            })
            .join('');
        const visitUrl =
            `http://localhost:${port}${pathTools.join(publicPath, module)}/#/${pathName}`
                .replace(/\\/g, '/');
        const compClassName = filename[0].toLowerCase() + filename.substr(1);

        generator
            .add(`${filename}.scss`,
                '/*!\r\n' +
                ` * @(#) ${filename}.scss\r\n` +
                ' * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究\r\n' +
                ' *\r\n' +
                ` * Copyright:  Copyright (c) ${moment().format('YYYY')}\r\n` +
                ' * Company:厦门畅享信息技术有限公司\r\n' +
                ` * @author ${username}\r\n` +
                ` * ${moment().format('YYYY-MM-DD HH:mm:SS')}\r\n` +
                ' */\r\n' +
                '\r\n' +
                `.${compClassName} {\r\n` +
                '    \r\n' +
                '}\r\n'
            )
            .add(`${filename}.js`,
                '/*\r\n' +
                ` * @(#) ${filename}.js\r\n` +
                ' * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究\r\n' +
                ' *\r\n' +
                ` * Copyright:  Copyright (c) ${moment().format('YYYY')}\r\n` +
                ' * Company:厦门畅享信息技术有限公司\r\n' +
                ` * @author ${username}\r\n` +
                ` * ${moment().format('YYYY-MM-DD HH:mm:SS')}\r\n` +
                ' */\r\n' +
                '\r\n' +
                `import styles from './${filename}.scss';\r\n` +
                'import React from \'react\';\r\n' +
                '\r\n' +
                `const ${filename} = () => {\r\n` +
                '    return (\r\n' +
                `        <div className={styles.${compClassName}}>\r\n` +
                '            \r\n' +
                '        </div>\r\n' +
                '    );\r\n' +
                '};\r\n' +
                '\r\n' +
                `export default ${filename};\r\n`
            )
            .add('index.js',
                '/*\r\n' +
                ` * @(#) index.js\r\n` +
                ' * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究\r\n' +
                ' *\r\n' +
                ` * Copyright:  Copyright (c) ${moment().format('YYYY')}\r\n` +
                ' * Company:厦门畅享信息技术有限公司\r\n' +
                ` * @author ${username}\r\n` +
                ` * ${moment().format('YYYY-MM-DD HH:mm:SS')}\r\n` +
                ' */\r\n' +
                '\r\n' +
                `export default from './${filename}.js';\r\n`
            )
            .add('README.md',
                `## ${title}\r\n` +
                '\r\n' +
                '### 访问地址\r\n' +
                '\r\n' +
                `${visitUrl}\r\n` +
                '\r\n' +
                '### 原型地址\r\n' +
                '\r\n' +
                `${archetypes}\r\n`
            )
            .run();
    }
};
