// rollup 默认可以到处一个对象，作为打包的配置文件
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
export default {
  input: './src/index.js', // 入口
  output: {
    file: './dist/vue.js', // 出口
    // new Vue
    name: 'Vue', // global.Vue
    format: 'umd', // esm es6模块，commonJS模块 iife自执行函数 umd(commonjs、amd)
    sourceMap: true, // 希望可以调试源代码
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // 排除 node_modules 所有文件
    }),
    resolve()
  ]
}

// 为什么 vue2 只能支持 ie9 以上，Object.defineProperty 不支持低版本
// proxy 是 es6 的，也没有替代方案