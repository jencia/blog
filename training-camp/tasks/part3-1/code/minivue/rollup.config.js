import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input: './src/vue',
    output: {
        format: 'umd',
        name: 'Vue',
        file: './dist/vue.js',
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: /node_modules/
        }),
        serve({
            port: 3000,
            contentBase: '',
            openPage: './index.html'
        })
    ]
}