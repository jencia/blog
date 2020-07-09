const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const bs = browserSync.create()

const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins();

let config = {
    build: {
        src: 'src',
        dist: 'dist',
        temp: 'temp',
        public: 'public',
        paths: {
            styles: 'assets/styles/*.scss',
            scripts: 'assets/scripts/*.js',
            pages: '*.html',
            assets: 'assets/{images,fonts}/**'
        }
    }
}
try {
    const extraConfig = require(`${process.cwd()}/pages.config.js`)

    config = {
        ...(extraConfig || {}),
        build: {
            ...config.build,
            ...((extraConfig || {}).build || {}),
            paths: {
                ...config.build.paths,
                ...(((extraConfig || {}).build || {}).paths || {}),
            }
        }
    }
} catch (e) {
    console.log(e);
}

const srcSrcOptions = { base: config.build.src, cwd: config.build.src }

// 清除任务
const clean = () => del([config.build.dist, config.build.temp])

// 样式编译
const style = () => {
    return src(config.build.paths.styles, srcSrcOptions)
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest(config.build.temp))
        .pipe(bs.reload({ stream: true }))
}

// 脚本编译
const script = () => {
    return src(config.build.paths.scripts, srcSrcOptions)
        .pipe(plugins.babel({ presets: [require('@babel/preset-env')] }))
        .pipe(dest(config.build.temp))
        .pipe(bs.reload({ stream: true }))
}

const page = () => {
    return src(config.build.paths.pages, srcSrcOptions)
        .pipe(plugins.swig({ data: config.data, defaults: { cache: false } }))
        .pipe(dest(config.build.temp))
        .pipe(bs.reload({ stream: true }))
}

const asset = () => {
    return src(config.build.paths.assets, srcSrcOptions)
        .pipe(plugins.imagemin())
        .pipe(dest(config.build.dist))
}

const extra = () => {
    return src('**', { base: config.build.public, cwd: config.build.public })
        .pipe(dest(config.build.dist))
}

const serve = () => {
    watch(config.build.paths.styles, { cwd: config.build.src }, style)
    watch(config.build.paths.scripts, { cwd: config.build.src }, script)
    watch(config.build.paths.pages, { cwd: config.build.src }, page)

    watch(config.build.paths.assets, { cwd: config.build.src }, bs.reload)
    watch('**', { cwd: config.build.public }, bs.reload)

    bs.init({
        notify: false,
        server: {
            baseDir: [config.build.temp, config.build.src, config.build.public],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}

const useref = () => {
    return src(config.build.paths.pages, { base: config.build.temp, cwd: config.build.temp })
        .pipe(plugins.useref({ searchPath: [config.build.temp, '.'] }))
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({
            collapseWhitespace: true,   // 折叠空白字符
            minifyCSS: true,            // 压缩 css
            minifyJS: true              // 压缩 js
        })))
        .pipe(dest(config.build.dist))
}

const compile = parallel(style, script, page)

const start = parallel(compile, serve)
const build = series(
    clean,
    parallel(
        series(compile, useref),
        asset,
        extra
    )
)

module.exports = {
    clean,
    build,
    start
}
