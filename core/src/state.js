import { observe } from './observe/index'

export function initState(vm) {
  const opts = vm.$options // 获取所有的选项
  if (opts.data) {
    initData(vm)
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, { // vm.name
    get() {
      return vm[target][key] // vm._data.name
    },
    set(newValue) {
      vm[target][key] = newValue
    }
  })
}

function initData(vm) {
  let data = vm.$options.data // data 可能是对象或者函数
  data = typeof data === 'function' ? data.call(vm) : data
  console.log(data)
  vm._data = data
  // 对数据进行劫持
  observe(data)
  // 将 vm._data 用 vm 来代理就可以了
  for(let key in data) {
    proxy(vm, '_data', key)
  }
}
