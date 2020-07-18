# 模块2-2：模块化开发与规范化标准

## 一、简答题

### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

1. 根据 entry 配置找到入口文件，顺着入口文件的代码往下走，根据代码中的 import 或 require 找到各个文件的依赖关系，形成依赖树；
2. 遍历依赖树找到各个节点的资源文件；
3. 根据 rules 配置给找到每个模块的 loader 加载器，然后分别解析每个模块；
4. 根据 output 配置创建打包文件，将各个模块的解析结果写入打包文件；
5. 在整个打包过程的每个环节都有钩子，根据 plugins 配置，对每个环节的钩子做相应处理。

### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

Loader 只是加载模块的环节工作，而 Plugin 涉及到 webpack 构建过程中的每一个环节

Loader 开发思路：

1. 定义一个函数，函数参数是源数据
2. 拿到源数据后做一系列处理，得出我们想要的数据
3. 将数据作为函数返回值返回出去，注意返回的值要求是 JS 能识别的语句字符串。

Plugin 开发思路：

1. 定义类，里面定义一个 apply 方法
2. 查找文档找到符合需求的钩子
3. apply 方法的第一个参数是 compiler ，这个对象包含所有配置信息通过 compiler 去注册钩子
4. 通过钩子函数拿到 compilation 对象，compilation 对象包含此次打包的上下文
5. 通过覆盖这个对象的属性值来达到修改数据的目的

## 二、编程题

### 1、使用 Webpack 实现 Vue 项目打包任务

作业请看 [code/vue-app-base](./code/vue-app-base)

> 具体任务及说明：
> 先下载任务的基础代码  百度网盘链接: https://pan.baidu.com/s/1pJl4k5KgyhD2xo8FZIms8Q 提取码: zrdd
> 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构，有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具），这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务，尽可能的使用上所有你了解到的功能和特性
