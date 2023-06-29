import { initMixin } from './init'
import { initLifeCycle } from './lifecycle'

function Vue(options) {
  this._init(options)
}

initMixin(Vue) // 扩展了 init 方法
initLifeCycle(Vue)

export default Vue
