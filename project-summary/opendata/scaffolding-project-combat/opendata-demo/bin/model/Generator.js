const fs = require('fs');
const pathTools = require('path');

// 为了兼容低版本node，不使用fs.mkdirSync的第二个参数
const mkdirSync = path => !fs.existsSync(path) && fs.mkdirSync(path);
// 'a/b/c' => ['a', 'a/b', 'a/b/c']
const pathSplit = path => path.split('/')
    .filter(dir => dir && dir !== '.')
    .reduce((rs, dir, i) => rs.concat(i === 0 ? dir : [rs[i - 1], dir].join('/')), []);

class Generator {
    constructor (root) {
        this.root = root;

        pathSplit(root).forEach(mkdirSync); // 遍历创建目录
        this.init();
    }
    init () {
        this.progress = 0;
        this.errorLogs = [];
        this.files = [];
    }
    // 每次文件操作完后的回调函数
    getOpeationCallback (path, type = 'file') {
        return err => {
            if (err) {
                this.errorLogs.push(err);
            }
            const typeText = type === 'dir' ? '目录' : '文件';

            this.progress += 1;
            console.log(
                `[${this.root}]生成${typeText}(${this.progress}/${this.files.length}): ${path}`
            );
            if (this.progress === this.files.length) {
                if (this.errorLogs.length > 0) {
                    this.errorLogs.forEach(log => console.error(log));
                    console.log(`${typeText}生成出现异常`);
                } else {
                    console.log(`[${this.root}]全部生成完毕`);
                }
                this.init();
            }
        }
    }
    /**
     * 添加一项文件操作，先记录，执行run()再一次性操作
     * @param {string|string[]} path 相对root目录下的文件生成路径，没有后缀名代表创建目录，路径中间带'->'符号的表示左边复制右边的文件内容
     * @param {string} [content]     文件内容，有传则表示写入文件
     */ 
    add (path, content) {
        if (Array.isArray(path)) {
            path.forEach(item => {
                const [p, c] = Array.isArray(item) ? item : [item];

                this.files.push({ path: p, content: c })
            })
        } else {
            this.files.push({ path, content });
        }
        return this;
    }
    // 开始创建文件
    run () {
        if (!fs.copyFile) {
            throw new Error('请升级您的node版本至v8.5或以上');
        }
        console.log(`[${this.root}]创建生成器`);
        this.files.forEach(({ path, content }) => {
            const [targetPath, copyOriginPath] = path.split(/\s*->\s*/);
            const actualPath = pathTools.join(this.root, targetPath);
            const dirs = pathSplit(targetPath);
            
            // 带文件夹的路径则先创建文件夹，如果已存在则跳过这步操作
            if (dirs.length > 1) {
                dirs.pop();
                dirs.forEach(dir => {
                    const actualDir = pathTools.join(this.root, dir);
                    mkdirSync(actualDir);
                })
            }
            copyOriginPath ?
                fs.copyFile(copyOriginPath, actualPath, this.getOpeationCallback(targetPath)) :
                targetPath.indexOf('.') > -1 ?  // 存在点号就判定为有后缀名，即文件路径
                    fs.writeFile(actualPath, content, this.getOpeationCallback(targetPath)) :
                    fs.mkdir(actualPath, this.getOpeationCallback(targetPath, 'dir'));
        })
        return this;
    }
}

module.exports = Generator;
