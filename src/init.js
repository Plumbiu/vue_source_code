import { initState } from "./state"

export function initMixin(Vue) { // 就是给 Vue 增加 init 方法
  Vue.prototype._init = function(options) { // 用于初始化操作
    // vue vm.$options 就是获取用户的配置

    // 使用 vue 的时候，$nextTick, $data, $attr ...，均是 vue 的属性
    const vm = this
    this.$options = options // 将用户的选项挂载到实例上
    // 初始化状态
    initState(vm)
    // TODO....
  }
}
