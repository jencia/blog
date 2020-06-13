const inquirer = require('inquirer');
const choices = [
    require('./mpa'),
    require('./spa'),
    require('./model')
];

inquirer
    .prompt([
        {
            type: 'list',
            name: 'type',
            message: '请选择创建类型：',
            choices: choices.map(item => ({
                name: item.name,
                value: item.type
            }))
        },
        ...choices.reduce((rs, item) => rs.concat(
            item.prompt.map(v => ({
                when: ({ type }) => type === item.type,
                ...v
            }))
        ), [])
    ])
    .then(res => choices.find(item => res.type === item.type).then(res));
