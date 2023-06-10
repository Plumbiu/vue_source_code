import Compile from "./Compile.js"
import observer from "./Observer.js"


export default class Vue {
  constructor(options) {
    // 把参数 options 对象村委 $options
    this.$options = options || {}
    // 数据
    this._data = options.data || undefined

    observer(this._data)
    // 默认数据要变为响应式的，这里就是生命周期
    this._initData()
    this._initComputed()
    // 模板编译
    new Compile(options.el, this)
    options.created()
  }
  _initData() {
    const self = this
    Object.keys(this._data).forEach(key => {
      Object.defineProperties(self, key, {
        get() {
          return self._data[key]
        },
        set(newVal) {
          self_data[key] = newVal
        }
      })
    })
  }
  _initComputed() {

  }
}