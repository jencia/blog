const fs = require('fs');
const pathTools = require('path');
const Mpa = require('./Mpa');

class Router {
    constructor (pageRoot, outputPath) {
        this.pageRoot = pageRoot;
        this.outputPath = outputPath;
        this.config = this.getConfig();
    }
    // 获取所有多页应用，排除没有单页应用的多页
    getMpaList () {
        return fs.readdirSync(this.pageRoot)
            .map(name => new Mpa(pathTools.join(this.pageRoot, name)))
            .filter(mpa => mpa.title);
    }
    // 获取当前时刻的路由配置数据
    getConfig () {
        const mpaList = this.getMpaList();

        return mpaList.reduce((rs, mpa) => {
            // 获取所有页面数据，过滤数据生成失败的页面
            const mpaData = mpa.spaList
                .map(spa => spa.getPageData())
                .filter(v => v);

            // 过滤没有页面数据的多页应用
            if (mpaData && mpaData.length) {
                rs[`--${mpa.name}--`] = mpaData;
            }
            return rs;
        }, {});
    }
    //  生成mapRoutes.js文件
    generateMapRoutes () {
        const configStr = JSON.stringify(this.config, null, 4)
            // 以下三个操作是为了将代码转为符合eslint规范的代码
            .replace(/"/g, '\'')                // 双引号都改为单引号
            .replace(/\n/g, '\r\n')             // \n改成\r\n，为了将文件转为CRLF模式的文件
            .replace(/'(.+)':/g, ($0, $1) => {  // 对象key值如果是\w的字符，则去除引号
                if (/^\w+$/.test($1)) {
                    return `${$1}:`;
                }
                return $0;
            })
            // 多页目录名转为对应的模块id
            .replace(/'--(.+)--'/g, '[require.resolve(\'../pages/$1/index.js\')]')
            // 将组件地址转为动态组件
            .replace(/component:\s*'(.+)',/g, 'component: () => import(\'$1\'),');
        const fsContent = `export default ${configStr};\r\n`;

        fs.writeFileSync(this.outputPath, fsContent);
    }
    // 获取配置更新日志
    getChangeLogs (oldConfig, newConfig) {
        const changeLogs = [];

        if (!oldConfig || !newConfig) {
            return changeLogs;
        }
        const diffConfig = reverse => {
            const diffPrefix = !reverse ? '新增' : '删除';

            for (const [key, mpa] of Object.entries(!reverse ? newConfig : oldConfig)) {
                const oldMpa = (!reverse ? oldConfig : newConfig)[key];
                const mpaName = key.match(/--(.+)--/)[1];

                if (!oldMpa) {
                    changeLogs.push(`> ${diffPrefix}一个多页应用：${mpaName}`);
                    continue;
                }
                mpa.forEach(spa => {
                    const oldSpa = oldMpa.find(v => v.path === spa.path);

                    if (!oldSpa) {
                        changeLogs.push(`> [${mpaName}]${diffPrefix}一个单页应用：${spa.path}`);
                        return;
                    }
                    Object.entries(spa)
                        .filter(([key]) => !['path', 'component'].includes(key))
                        .forEach(([key, value]) => {
                            const newValue = JSON.stringify(value);
                            let oldValue = oldSpa[key];

                            if (!oldValue) {
                                changeLogs.push(`> [${mpaName}][${spa.path}]${diffPrefix}布局属性：${key}=${newValue}`);
                                return;
                            }
                            oldValue = JSON.stringify(oldValue);

                            // 布局属性更新，只有reverse为false才判断
                            if (!reverse && oldValue !== newValue) {
                                changeLogs.push(`> [${mpaName}][${spa.path}]布局属性${key}变更：由${oldValue}改为${newValue}`);
                            }
                        });
                })
            }
        };
        // 正向比较时多出的属于新增，反向比较时多出的属于删除
        diffConfig();
        diffConfig(true);

        if (changeLogs.length) {
            changeLogs.unshift(`路由配置更新时间：${new Date().toLocaleString()}`);
        }
        return changeLogs;
    }
    watch () {
        const updateConfigFile = (oldConfig, newConfig) => {
            const changeLogs = this.getChangeLogs(oldConfig, newConfig);

            if (newConfig) {
                this.config = newConfig;
            }
            changeLogs.forEach(str => console.log(str));
            this.generateMapRoutes();
            console.log('路由监听中...');
        };

        updateConfigFile();
        fs.watch(this.pageRoot, { recursive: true }, () => {
            const newConfig = this.getConfig();

            if (JSON.stringify(newConfig) !== JSON.stringify(this.config)) {
                updateConfigFile(this.config, newConfig);
            }
        });
    }
}

module.exports = Router;
