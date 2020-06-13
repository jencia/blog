const fs = require('fs');
const pathTools = require('path');

// 这个常量是给后面的eval用的
const GRADE = {
    VISITOR: '0',       // 游客
    PERSONAL: '10',     // 个人账户
    ENTERPRISE: '20',   // 企业账户
    PARTNER: '30'       // 生态合作伙伴账户
};

class Spa {
    constructor (mpa, name) {
        this.mpa = mpa;
        this.name = name;
        this.path = this.getPath();
        this._readme = this.getReadme();
        this.url = this.getUrl();
        this.title = this.getTitle();
        this.archetypes = this.getArchetypes();
        this.designFile = this.getDesignFile();
    }
    // 获得单页路径，比如./src/page/partner/routes/DemandList
    getPath () {
        return `./${pathTools.join(this.mpa.path, 'routes', this.name)}`.replace(/\\/g, '/');
    }
    // 获取页面根组件的文件内容
    getPageFile () {
        let file;
        try {
            const filePath = pathTools.join(this.path, `${this.name}.js`);

            file = fs.readFileSync(filePath, 'utf-8');
        } catch (e) {
            return null;
        }
        return file;
    }
    // 获取README.md文件内容
    getReadme () {
        const mdPath = pathTools.join(this.path, 'README.md');

        try {
            return fs.readFileSync(mdPath, 'utf-8');
        } catch {
            return '';
        }
    }
    // 获取访问地址
    getUrl () {
        const url = (this._readme.match(/###[ ]*访问地址\s+([^\s]*)(\n|\r|$)/) || [])[1] || '';

        // 如果README.md文件有写访问地址就直接使用README.md的
        if (url) return url;
        // 否则根据页面信息算出来
        const pathName = this.name
            .split('')
            .map((v, i) => {
                if (i === 0) return v.toLowerCase();
                if (v.charCodeAt(0) < 97) return `_${v.toLowerCase()}`;
                return v;
            })
            .join('');

        return `${this.mpa.url}#/${pathName}`;
    }
    // 获取页面标题，根据README.md文件提取
    getTitle () {
        return (this._readme.match(/##[ ]*([^\s]*)(\n|\r|$)/) || [])[1] || '';
    }
    // 获取原型信息，根据README.md文件提取
    getArchetypes () {
        return (this._readme.match(/###[ ]*原型地址\s+([^\s]*)(\n|\r|$)/) || [])[1] || '';
    }
    // 获取组件设计文件
    getDesignFile () {
        const fileJpgPath = pathTools.join(this.path, `${this.name}.jpg`).replace(/\\/g, '/');
        const filePngPath = pathTools.join(this.path, `${this.name}.png`).replace(/\\/g, '/');

        if (fs.existsSync(fileJpgPath)) return fileJpgPath;
        if (fs.existsSync(filePngPath)) return filePngPath;
        return '';
    }
    // 获取页面数据，由文件信息算出的路由所需数据
    getPageData () {
        const pageFile = this.getPageFile();

        if (!pageFile) return null;

        // 获取各个页面组件的布局属性
        const re = `${this.name}\\.([^\\s]+)\\s*=\\s*((.|\\s)+?)(?=(;|${this.name}|export))`;
        const pageData = (pageFile.match(new RegExp(re, 'mg')) || []).reduce((rs, str) => {
            try {
                eval(str.replace(this.name, 'rs'));
            } catch (e) {}

            return rs;
        }, {});

        // 大驼峰命名转成全小写下划线连接，如CatalogDetail => catalog_detail
        const pathKey = this.name
            .split('')
            .map((v, i) => {
                if (i === 0) return v.toLowerCase();
                if (v.charCodeAt(0) < 97) return `_${v.toLowerCase()}`;
                return v;
            })
            .join('');

        return {
            path: pathKey === 'home' ? '/' : `/${pathKey}`,
            component: `@/pages/${this.mpa.name}/routes/${this.name}`,
            exact: true,
            ...pageData
        };
    }
}

module.exports = Spa;
