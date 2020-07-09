const loadGruntTasks = require('load-grunt-tasks')
const sass = require('sass')
const fs = require('fs')
const useref = require('useref')
const browserSync = require('browser-sync')
const bs = browserSync.create()

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

module.exports = grunt => {
  grunt.initConfig({
    clean: ['dist/**'],

    sass: {
      options: {
        implementation: sass
      },
      main: {
        files: {
          'dist/assets/styles/main.css': 'src/assets/styles/main.scss'
        }
      }
    },

    babel: {
      options: {
        presets: ['@babel/preset-env']
      },
      main: {
        files: {
          'dist/assets/scripts/main.js': 'src/assets/scripts/main.js'
        }
      }
    },
    web_swig: {
      options: {
        swigOptions: {
          cache: false
        },
        getData: () => data
      },
      main: {
        expand: true,
        cwd: 'src/',
        src: "**/*.html",
        dest: "dist/"
      },
    },

    uglify: {
      production: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['assets/scripts/*.js'],
          dest: 'dist/',
        }]
      }
    },
    cssmin: {
      production: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['assets/styles/*.css'],
          dest: 'dist/',
        }]
      },
      dev: {}
    },
    htmlmin: {
      production: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**/*.html'],
          dest: 'dist/'
        }]
      },
      dev: {}
    },
    image: {
      production: {
        options: {
          optipng: false,
          pngquant: true,
          zopflipng: true,
          jpegRecompress: false,
          mozjpeg: true,
          gifsicle: true,
          svgo: true
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['assets/fonts/*', 'assets/images/*'],
          dest: 'dist/'
        }]
      },
      dev: {}
    },
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'public/',
          src: ['**'],
          dest: 'dist/'
        },
        {
          expand: true,
          cwd: 'src',
          src: ['assets/fonts/*'],
          dest: 'dist/'
        },
        {
          expand: true,
          cwd: 'src',
          src: ['assets/images/*'],
          dest: 'dist/'
        }
      ]}
    },
    watch: {
      js: {
        files: ['src/assets/scripts/*.js'],
        tasks: ['babel', 'bs-reload']
      },
      css: {
        files: ['src/assets/styles/*.scss'],
        tasks: ['sass', 'bs-reload']
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['web_swig', 'bs-reload']
      }
    }
  })

  grunt.registerTask("jal-useref", function () {
    const done = this.async()
    const cwd = 'dist/'
    const pages = ['index.html', 'about.html']
    pages.forEach((html, index) => {
      const inputHtml = fs.readFileSync(cwd + html, "utf8")
      const [code, result] = useref(inputHtml)

      for (let type in result) {
        Object.keys(result[type]).forEach(dest => {
          const src = result[type][dest].assets
          let read
          const files = src.map(file => {
            read = cwd + file
            if(file[0] === '/') {
              read = file.substr(1)
            }
            return fs.readFileSync(read)
          })
          fs.writeFile(cwd + dest, files.join(''), err => {
            if (err) {
              console.log(err);
            }
          })
        })
      }
      fs.writeFile(cwd + html, code, err => {
        if (!err && index === pages.length - 1) {
          done()
        }
      })
    })
  })

  grunt.registerTask("bs", function () {
    const done = this.async()
    bs.init({
      notify: false,
      port: grunt.option('port') || 2080,
      open: grunt.option('open'),
      server: {
        baseDir: ['dist', 'src', 'public'],
        routes: {
          '/node_modules': 'node_modules'
        }
      }
    }, done)
  })
  grunt.registerTask("bs-reload", () => bs.reload())

  loadGruntTasks(grunt)

  grunt.registerTask('mini', ['image', 'uglify', 'cssmin', 'htmlmin'])
  grunt.registerTask('compile', ['sass', 'babel', 'web_swig'])
  grunt.registerTask('build', ['clean', 'compile', 'copy', 'jal-useref', 'mini'])
  grunt.registerTask('start', ['clean', 'compile', 'copy', 'jal-useref', 'bs', 'watch'])
}
