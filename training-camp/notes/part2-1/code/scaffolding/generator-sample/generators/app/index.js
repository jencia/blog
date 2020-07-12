// 此文件作为 Generator 的核心入口
// 需要导出一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入

const Generator = require('yeoman-generator')

module.exports = class extends Generator {
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
            this.answers = answers
        })
    }
    writing () {
        // Yeoman 自动在生成文件阶段调用此方法
        // 我们这里尝试往项目目录中写入文件
        // this.fs.write(
        //     this.destinationPath('temp.txt'),
        //     Math.random().toString()
        // )

        // 通过模板方式写入文件到目标目录

        // 模板文件路径
        const tpl = this.templatePath('foo.txt')
        // 输出目标路径
        const output = this.destinationPath('foo.txt')
        // 模板数据上下文
        const context = this.answers

        this.fs.copyTpl(tpl, output, context)
    }
}