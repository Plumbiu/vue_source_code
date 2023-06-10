import complieToFunction from './compiler/'
import { initState } from './state'

// 给 Vue 增加 init 方法
export function initMixin(Vue) {
  // 用于初始化操作
  Vue.prototype._init = function (options) {
    // vue vm $options 就是获取用户的配置
    const vm = this
    vm.$options = options // 将用户的选项挂载到实例上
    // 初始化状态
    initState(vm)
    // TODO 其他操作
    if (options.el) {
      vm.$mount(options.el) // 实现数据的挂载
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    el = document.querySelector(el)
    let ops = vm.$options
    if (!ops.render) {
      // 先进行查找有没有 render 函数
      let template // 没有 render 开一下是否写了 template，没写 template 采用外部的 template
      if (!ops.template && el) {
        // 没有写模板，但是有 el
        template = el.outerHTML
      } else {
        // 写了 template 就有，写了的 template
        if (el) {
          template = ops.template
        }
      }
      // 写了 template 就用写了的 template
      if(template) {
        // 需要对模板进行编译
        const render = complieToFunction(template)
        ops.render = render
      }
    }
    ops.render // 最终就可以获取 render 方法
    // script 标签引用的 vue.global.js 这个编译过程是在浏览器运行的
    // runtime 不包含模板编译，整个编译是打包的时候通过 loader 来转义 .vue 文件的，用 runtime 的时候不能使用模板 template(.vue 中的模板，因为.vue 中的模板是靠 loader 运行的)
  }
}
