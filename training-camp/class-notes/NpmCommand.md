# npm 内置命令行整理

## 模块安装相关

- [npm init](https://docs.npmjs.com/cli/v6/commands/npm-init)：初始化 package.json 文件或初始化项目模板
- [npm install](https://docs.npmjs.com/cli/v6/commands/npm-install)：安装模块，别名：`i`、`add`
- [npm install-test](https://docs.npmjs.com/cli/v6/commands/npm-install-test)：执行 “npm install” + “npm test”
- [npm uninstall](https://docs.npmjs.com/cli/v6/commands/npm-uninstall)：卸载模块，别名：`remove`, `rm`, `r`, `un`, `unlink`
- [npm update](https://docs.npmjs.com/cli/v6/commands/npm-update)：根据 package.json 的依赖更新模块
- [npm dedupe](https://docs.npmjs.com/cli/v6/commands/npm-dedupe)：整理依赖树，减少重复依赖
- [npm prune](https://docs.npmjs.com/cli/v6/commands/npm-prune)：删除多余的模块
- [npm ls](https://docs.npmjs.com/cli/v6/commands/npm-ls)：获取已安装的模块列表信息
- [npm outdated](https://docs.npmjs.com/cli/v6/commands/npm-outdated)：检查过时的模块

## npm script 相关

- [npm run-script](https://docs.npmjs.com/cli/v6/commands/npm-run-script) 执行 package.json 定义的脚本，别名：`run`
- [npm start](https://docs.npmjs.com/cli/v6/commands/npm-start)：执行 npm scripts 里的 start
- [npm build](https://docs.npmjs.com/cli/v6/commands/npm-build)：执行 npm scripts 里的 build
- [npm stop](https://docs.npmjs.com/cli/v6/commands/npm-stop)：执行 npm scripts 里的 stop
- [npm rebuild](https://docs.npmjs.com/cli/v6/commands/npm-rebuild)：使用最新安装的 npm 重新执行一次 npm build
- [npm restart](https://docs.npmjs.com/cli/v6/commands/npm-restart)：分别执行了 npm scripts 里的 stop、restart、start
- [npm test](https://docs.npmjs.com/cli/v6/commands/npm-test)：执行 npm scripts 里的 test

## 文档快速访问

- [npm bugs](https://docs.npmjs.com/cli/v6/commands/npm-bugs)：浏览器打开模块 package.json 里 bugs 指向的地址
- [npm docs](https://docs.npmjs.com/cli/v6/commands/npm-docs)：浏览器打开模块 package.json 里 homepage 指向的地址
- [npm repo](https://docs.npmjs.com/cli/v6/commands/npm-repo)：浏览器打开模块 package.json 里 repository 指向的地址
- [npm fund](https://docs.npmjs.com/cli/v6/commands/npm-fund)：获取各个模块 package.json 里 funding 地址信息

## 用户相关

- [npm adduser](https://docs.npmjs.com/cli/v6/commands/npm-adduser)：注册或登录用户，别名：`login`、`add-user`
- [npm whoami](https://docs.npmjs.com/cli/v6/commands/npm-whoami)：打印当前用户名
- [npm logout](https://docs.npmjs.com/cli/v6/commands/npm-logout)：退出用户
- [npm org](https://docs.npmjs.com/cli/v6/commands/npm-org)：管理组织的用户
- [npm owner](https://docs.npmjs.com/cli/v6/commands/npm-owner)：管理我的所有模块
- [npm team](https://docs.npmjs.com/cli/v6/commands/npm-team)：管理组织团队和团队成员
- [npm token](https://docs.npmjs.com/cli/v6/commands/npm-token)：管理您的身份验证令牌

## 模块开发相关

- [npm publish](https://docs.npmjs.com/cli/v6/commands/npm-publish)：发布模块
- [npm unpublish](https://docs.npmjs.com/cli/v6/commands/npm-unpublish)：下架模块
- [npm deprecate](https://docs.npmjs.com/cli/v6/commands/npm-deprecate)：将一个模块标记为弃用
- [npm dist-tag](https://docs.npmjs.com/cli/v6/commands/npm-dist-tag)：模块标签管理
- [npm hook](https://docs.npmjs.com/cli/v6/commands/npm-hook)：注册钩子管理
- [npm pack](https://docs.npmjs.com/cli/v6/commands/npm-pack)：将当前模块打包到本地
- [npm prefix](https://docs.npmjs.com/cli/v6/commands/npm-prefix)：显示当前模块的前缀路径
- [npm version](https://docs.npmjs.com/cli/v6/commands/npm-version)：当前模块版本管理
- [npm shrinkwrap](https://docs.npmjs.com/cli/v6/commands/npm-shrinkwrap)：将 package-lock.json 转为 npm-shrinkwrap.json
- [npm access](https://docs.npmjs.com/cli/v6/commands/npm-access)：对模块设置权限

## 命令行模块相关

- [npm ci](https://docs.npmjs.com/cli/v6/commands/npm-ci)：功能与 npm install 相同，安装速度更高效
- [npm install-ci-test](https://docs.npmjs.com/cli/v6/commands/npm-install-ci-test)：执行 “npm ci + “npm test”
- [npm link](https://docs.npmjs.com/cli/v6/commands/npm-link)：以软连接的方式安装模块

## 配置相关

- [npm bin](https://docs.npmjs.com/cli/v6/commands/npm-bin)：打印 npm 安装可执行文件的文件夹
- [npm cache](https://docs.npmjs.com/cli/v6/commands/npm-cache)：管理 npm 缓存文件夹
- [npm completion](https://docs.npmjs.com/cli/v6/commands/npm-completion)：开启 tab 键补全 npm 命令行
- [npm config](https://docs.npmjs.com/cli/v6/commands/npm-config)：获取或设置环境变量
- [npm profile](https://docs.npmjs.com/cli/v6/commands/npm-profile)：更改注册表配置文件的设置

## 其他

- [npm help](https://docs.npmjs.com/cli/v6/commands/npm-help)：查看命令行文档
- [npm help-search](https://docs.npmjs.com/cli/v6/commands/npm-help-search)：搜索命令行文档
- [npm ping](https://docs.npmjs.com/cli/v6/commands/npm-ping)：检测是否能连接 registry 地址
- [npm search](https://docs.npmjs.com/cli/v6/commands/npm-search)：搜索模块
- [npm star](https://docs.npmjs.com/cli/v6/commands/npm-star)：收藏这个模块
- [npm stars](https://docs.npmjs.com/cli/v6/commands/npm-stars)：查看收藏夹
- [npm view](https://docs.npmjs.com/cli/v6/commands/npm-view)：查看指定模块的注册表信息
- [npm audit](https://docs.npmjs.com/cli/v6/commands/npm-audit)：扫描您的项目的漏洞
- [npm doctor](https://docs.npmjs.com/cli/v6/commands/npm-doctor)：环境诊断
- [npm edit](https://docs.npmjs.com/cli/v6/commands/npm-edit)：编辑 node_modules 里的模块代码
- [npm explore](https://docs.npmjs.com/cli/v6/commands/npm-explore)：在指定的安装包的目录中执行命令行
- [npm root](https://docs.npmjs.com/cli/v6/commands/npm-root)：获取 node_modules 的文件夹路径
