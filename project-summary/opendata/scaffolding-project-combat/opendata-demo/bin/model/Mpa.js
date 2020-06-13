const fs = require('fs');
const pathTools = require('path');
const { publicPath = '', port = '4000' } = require('../../webpack.config');
const Spa = require('./Spa');

class Mpa {
    constructor (path) {
        this.path = `./${path}`.replace(/\\/g, '/');
        this.name = pathTools.parse(path).name;
        this.url = this.getUrl();
        this.title = this.getTitle();
        this.spaList = this.getSpaList();
    }
    // 获得当前多页应用下所含有的单页应用列表
    getUrl () {
        return `http://localhost:${port + pathTools.join(publicPath, this.name)}/`.replace(/\\/g, '/');
    }
    // 获取多页模块标题
    getTitle () {
        const ejsPath = pathTools.join(this.path, 'index.ejs');

        try {
            const ejsContent = fs.readFileSync(ejsPath, 'utf-8');
            const title = ejsContent.match(/title:\s*'(.*)'/)[1];

            return title || (this.name === 'index' ? '首页' : '');
        } catch {
            return '';
        }
    }
    // 获得当前多页应用下所含有的单页应用列表
    getSpaList () {
        const routesPath = pathTools.join(this.path, 'routes');

        try {
            const spaNames = fs.readdirSync(routesPath);

            return spaNames.filter(v => v[0] !== '.')
                .map(name => new Spa(this, name));
        } catch (e) {
            return [];
        }
    }
}

module.exports = Mpa;
