# 脚手架工具

## Yeoman

用于创造现代化 web 应用的脚手架工具

### 基本使用

1. 全局安装 yo

```sh
$ yarn global add yo
```

2. 全局安装对应的 generator

```sh
$ yarn global add generator-node
```

3. 通过 yo 运行 generator

创建一个项目目录，进入项目目录后执行下面命令：

```sh
$ yo node
```

这时候出现一系列问答对话：

```
? Module Name my-module
? The name above already exists on npm, choose another? No
? Description 
? Project homepage url 
? Author's Name jencia
? Author's Email 1073956837@qq.com
? Author's Homepage 
? Package keywords (comma to split) 
? Send coverage reports to coveralls No
? Enter Node versions (comma separated) 
? GitHub username or organization jencia
? Which license do you want to use? MIT
```

最终生成以下目录结构：

```
└─my_module
   ├─ lib/
   │  ├─ __tests__/
   │  │  └─ myModule.test.js
   │  └─ index.js
   ├─ .editorconfig
   ├─ .eslintignore
   ├─ .gitattributes
   ├─ .gitignore
   ├─ .travis.yml
   ├─ .yo-rc.json
   ├─ LICENSE
   ├─ package.json
   ├─ package-lock.json
   └─ README.md
```

### Sub Generator

有些 generator 有提供一些子命令，例如 node:cli ，在之前的操作基础上再执行这个命令：

```sh
$ yo node:cli
```

这时候出现一条对话：

```
conflict package.json
? Overwrite package.json? overwrite
    force package.json
   create lib/cli.js
```

问你是否覆盖原来的 package.json，这里选择 Y ，这时候就会创建一个文件 lib/cli.js ，这文件提供了一些命令行基本结构代码，这文件用到了第三方模块，需要执行 `yarn` 装下新模块。

这个 cli.js 就是 my-module 向外暴露的命令行工具，本地想调试的话可以执行以下命令：

```sh
$ yarn link
# 或者
$ npm link
```

如果使用 yarn 可能会出现 link 成功了，但实际却不能使用，这时候你需要执行这这条命令：

```sh
$ yarn global bin
```

注册到全局 bin 上面，这时候再重新 link 就可以了。

**注意** ：link 属于全局操作，mac 系统要加 `sudo` 。

这时候就可以直接使用项目名作为命令行工具使用：

```sh
$ my-module --help
```

### 常规使用步骤

1. 明确你的需求；
2. 到 [yeoman官网](https://yeoman.io/generators/) 找到合适的Generator；
3. 全局安装找到的Generator；
4. 通过Yo运行对应的Generator；
5. 通过命令行交互填写选项；
6. 生成你所需要的项目结构；

比如我们需要开发 webapp ，那我们就可以到官网搜索 webapp 找到了名字叫 webapp ，对应的模块就是在前面加上 `generator-` , 也就是 `generator-webapp` ，然后安装流程就如下：

```sh
$ yarn global add generator-webapp
# 找个地方创建项目目录，然后进入该目录再进行下一步
$ yo webapp
```

### 自定义 Generator

#### 创建 Generator 模块

Generator 本质上就是一个 NPM 模块，只不过有特定的结构。

- Generator 基本结构：

```
├─ generators/          生成器目录
│  └─ app/              默认生成器目录
│     └─ index.js       默认生成器实现
└─ package.json         模块包配置文件
```

如果需要添加多个 Sub Generator ，结构就可以这样：

```
├─ generators/          生成器目录
│  ├─ app/              默认生成器目录
│  │  └─ index.js       默认生成器实现
│  └─ component/        其他生成器目录
│     └─ index.js       其他生成器实现
└─ package.json         模块包配置文件
```

- Generator 名称:

```
generator-<name>
```

`generator-` 加上你的名称，这样的格式名称才能被 yo 找到。

具体开发流程如下举了个例子：

1. 创建 generator-sample 文件夹，并进入文件夹

```sh
$ mkdir generator-sample
$ cd generator-sample
```

2. 初始化项目配置

```sh
$ yarn init --yes
```

3. 安装 yeoman-generator

这个模块是一个 generator 的基类，它提供了一些工具函数。

```sh
$ yarn add yeoman-generator
```

4. 创建入口文件

创建 generators/app/index.js 文件，形成以下的目录结构

```
├─ generators/
│ └─ app/
│    └─ index.js
└─ package.json 
```

文件内容如下：

```js
// 此文件作为 Generator 的核心入口
// 需要导出一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入

const Generator = require('yeoman-generator')

module.exports = class extends Generator {
    writing () {
        // Yeoman 自动在生成文件阶段调用此方法
        // 我们这里尝试往项目目录中写入文件
        this.fs.write(
            this.destinationPath('temp.text'),
            Math.random().toString()
        )
    }
}
```

5. 发布模块

在发布之前我们需要先在本地环境测下，可以借助 link 命令：

```sh
$ yarn link
```

如果确定没问题了就可以发布，发布模块就是跟发布普通模块没什么区别

```sh
$ yarn publish
```

发布前得先 `npm login` 登录，检查 package.json 配置是否正确，比如 version、author。还得先

**注意：** 如果是使用淘宝镜像，是不能发布成功的，需要切换回原生镜像。

6. 使用模块

首先需要把我们写的 generator 模块安装到全局上，如果是用 link 的就不用了。然后创建一个新的项目，执行以下命令：

```sh
$ yo sample
```

这时候这个项目下就会生成一个 temp.txt 文件，如果是这情况就代表成功了。

#### 根据模板创建文件

在 app 下创建 templates 文件夹专门用来存放模板文件，这里创建一个 foo.txt 文件，现在的结构如下：

```
├─ generators/
│  └─ app/
│     ├─ templates/
│     │   └─ foo.txt
│     └─ index.js
└─ package.json 
```

foo.txt 的内容如下：

```ejs
这是一个模板文件
内部使用 EJS 模板标记输出数据
例如：<%= title %>

其他的 EJS 语法也支持

<% if (success) { %>
哈哈哈
<% } %>
```

index.js 文件写法要改成这样：

```js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
    writing () {
        // 模板文件路径
        const tpl = this.templatePath('foo.txt')
        // 输出目标路径
        const output = this.destinationPath('foo.txt')
        // 模板数据上下文
        const context = { title: 'Hello yjc~', success: false}

        this.fs.copyTpl(tpl, output, context)
    }
}
```

最终生成的文件：

```
这是一个模板文件
内部使用 EJS 模板标记输出数据
例如：Hello yjc~

其他的 EJS 语法也支持
```

#### 接收用户输入

采用对话的方式接收用户的参数，可以在 prompting 方法里实现：

```js
prompting () {
    // Yeoman 在询问用户环节会自动调用此方法
    // 在此方法中科院调用父类的 prompt () 方法发出对用户的命令行询问
    return this.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Your project title :',
            default: this.appname   // 项目生成的目录名称
        },
        {
            type: 'confirm',
            name: 'success',
            message: 'Whether it runs successfully ?',
            default: false
        }
    ])
    .then(answers => {
        // answers 的数据结构 { title: string, success: boolean }
        this.answers = answers  // 后续生成文件的时候就可以根据这个对象数据生成
    })
}
```

## Plop

一个小而美的脚手架工具。

一般用于快速创建一些常用却相似文件，比如创建组件文件，一个组件可能会包含组件文件、样式文件、测试文件，有的还有一个 index.js文件，每次都要创建多个文件很麻烦，而且这些文件每次创建都要写一堆相似的代码。

### 基本使用

1. 将plop模块作为项目开发依赖安装

```sh
$ yarn add -D plop
```

2. 在项目根目录下创建一个 plopfile.js 文件

3. 在 plopfile.js 文件中定义脚手架任务

```js
module.exports = plop => {
    // 创建一个 component 任务，可以通过 yarn plop component 命令行访问到
    plop.setGenerator('component', {
        description: 'create a component',  // 任务描述
        prompts: [  // 接收用户输入
            {
                type: 'input',
                name: 'name',
                message: 'component name :'
            }
        ],
        actions: [  // 行为操作
            {
                type: 'add',    // add 代表添加文件
                path: 'src/components/{{name}}/{{name}}.js',    // 可以用 {{name}} 的方式插值，直接能拿到 name 值
                templateFile: 'plop-templates/component.hbs'    // 根据模板文件生成文件
            }
        ]
    })
}
```

4. 编写用于生成特定类型文件的模板

创建一个 plop-templates 文件夹专门存放模板文件，这边模板文件是 .hbs 后缀的文件，文件可以直接使用 {{name}} 的方式插值，例如：

```hbs
import './{{name}}.scss'
import React from 'react';

const {{name}} = () => {
    return (
        <div styles="{{name}}">

        </div>
    )
}

export default {{name}};
```

5. 通过 Plop 提供的 CLI 运行脚手架任务

yarn plop + 任务名称，这边 component 任务，所以命令行是：

```sh
$ yarn plop component
```

## 脚手架的工作原理

这边手写一个脚手架，不使用前面讲到的工具，通过脚手架的开发流程来了解脚手架的工作原理。

开发脚手架的主要有三步：

1. 搭建 cli 环境，使得能够通过命令行触发脚手架工作
2. 通过命令行交互询问用户问题，也就是接收用户输入
3. 根据用户回答的结果生成文件

### 搭建 cli 环境

1. 创建项目文件夹，这里以 my-cli 为例
2. 初始化项目配置

```sh
$ yarn init --yes
```

3. 设置 bin 入口文件

在 package.json 文件里加一个字段，值指向入口文件并创建 cli.js 文件.

```diff
{
    "name": "my-cli",
+   "bin": "cli.js",
    "version": "1.0.0",
    "main": "index.js",
    "license": "MIT",
    "dependencies": {
        "inquirer": "^7.3.0"
    },
    "devDependencies": {
        "ejs": "^3.1.3"
    }
}
```

4. 设置 cli.js 文件头

```js
#!/usr/bin/env node

console.log('cli working!')
```

Node CLI 应用入口文件必须要有这样的文件头。

如果是 Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755，修改命令是执行以下命令

```sh
$ chmod 755 cli.js
```

5. cli 测试

```sh
$ npm link
$ my-cli
```

如果这时候有打印出 `cli working!` 就环境搭建成功。

### 接收用户输入

这边需要用到 inquirer 工具

```sh
$ yarn add -D inquirer
```

给 cli.js 添加代码

```js
const inquirer = require('inquirer')

inquirer
    .prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Project name ?'
        }
    ])
    .then(answers => {
        console.log(answers);
    })
```

这时候执行 'my-cli' 运行脚手架的时候就会有交互询问：

```sh
Project name ?
```

这时候输入 test，应该会输出 `{ name: test }` 就代表拿到了用户输入的值。

### 生成文件

一般文件生成都是根据模板文件，所以会先读文件，再生成文件。

读文件可以使用模板引擎 ejs 。

```sh
$ yarn add -D ejs
```

而生成文件其实就是写文件，可以使用 Node API 的 fs 模块来实现。

```js
const fs = require('fs')

fs.writeFile()
fs.writeFileSync()
```

一般文件是批量生成的，所以我们需要创建一个 templates 文件夹专门用来存放模板文件，结合 Node API 里面的 path 模块做路径操作。

最终在 then 里面的代码改成这样：

```js
// 模板目录
const tplDir = path.join(__dirname, 'templates')
// 目标目录
const destDir = process.cwd()

// 将模板下的文件全部转换到目标目录
fs.readdir(tplDir, (err, files) => {
    if (err) throw err
    files.forEach(file => {
        // 通过模板引擎渲染文件
        ejs.renderFile(path.join(tplDir, file), answers, (err, result) => {
            if (err) throw err

            // 将结果写入目标文件路径
            fs.writeFileSync(path.join(destDir, file), result)
        })
    })
})
```

到这里一个简易的脚手架就开发完成了。
