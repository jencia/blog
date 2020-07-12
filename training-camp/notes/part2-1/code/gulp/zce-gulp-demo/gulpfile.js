const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const bs = browserSync.create()

const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins();

const data = {
    menus: [
        {
            name: 'Home',
            icon: 'aperture',
            link: 'index.html'
        },
        {
            name: 'Features',
            link: 'features.html'
        },
        {
            name: 'About',
            link: 'about.html'
        },
        {
            name: 'Contact',
            link: '#',
            children: [
                {
                    name: 'Twitter',
                    link: 'https://twitter.com/w_zce'
                },
                {
                    name: 'About',
                    link: 'https://weibo.com/zceme'
                },
                {
                    name: 'divider'
                },
                {
                    name: 'About',
                    link: 'https://github.com/zce'
                }
            ]
        }
    ],
    pkg: require('./package.json'),
    date: new Date()
}

const clean = () => del(['dist', 'temp'])

// 样式编译
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}

// 脚本编译
const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}

const page = () => {
    return src('src/*.html', { base: 'src' })
        .pipe(plugins.swig({ data }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}

const asset = () => {
    return src('src/assets/{images,fonts}/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}

const serve = () => {
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', script)
    watch('src/*.html', page)

    watch([
        'src/assets/{images,fonts}/**',
        'public/**'
    ], bs.reload)

    bs.init({
        notify: false,
        server: {
            baseDir: ['temp', 'src', 'public'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}

const useref = () => {
    return src('temp/*.html', { base: 'temp' })
        .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({
            collapseWhitespace: true,   // 折叠空白字符
            minifyCSS: true,            // 压缩 css
            minifyJS: true              // 压缩 js
        })))
        .pipe(dest('dist'))
}

const compile = parallel(style, script, page)

const develop = parallel(compile, serve)
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
    develop
}
