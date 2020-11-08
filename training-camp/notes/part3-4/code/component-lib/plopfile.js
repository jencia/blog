

/** @param {import('plop').NodePlopAPI} plop */
module.exports = plop => {
  plop.setGenerator('component', {
    description: '创建一个自定义组件',
    prompts: [
      {
        type: 'input',
        name: 'name',
        default: 'MyComponent',
        message: 'component name'
      }
    ],
    actions: [
      {
        type: 'add',
        path: './packages/{{ name }}/src/{{ name }}.vue',
        templateFile: './plop-template/src/component.hbs'
      },
      {
        type: 'add',
        path: './packages/{{ name }}/stories/{{ name }}.stories.js',
        templateFile: './plop-template/stories/component.stories.hbs'
      },
      {
        type: 'add',
        path: './packages/{{ name }}/index.js',
        templateFile: './plop-template/index.hbs'
      },
      {
        type: 'add',
        path: './packages/{{ name }}/LICENSE',
        templateFile: './plop-template/LICENSE'
      },
      {
        type: 'add',
        path: './packages/{{ name }}/package.json',
        templateFile: './plop-template/package.hbs'
      },
      {
        type: 'add',
        path: './packages/{{ name }}/README.md',
        templateFile: './plop-template/README.hbs'
      },
    ]
  })
}