
// 对数组重写数组中的部分方法（能够修改数组本身）
let oldArrayProto = Array.prototype // 获取数组的原型

// newArrayProto.__proto__ = oldArrayProto
export let newArrayProto = Object.create(oldArrayProto)

let methods = [ // 找到所有可以修改数组本身的方法
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
] // concat、slice 等方法都不会改变原数组

methods.forEach(method => {
  newArrayProto[method] = function(...args) { // 重写了数组的方法
    // push()
    const result = oldArrayProto[method].call(this, ...args) // 内部调用原来的方法
    console.log('method', method)
    // 我们需要对新增的数据再次进行劫持
    let inserted
    let ob = this.__ob__
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      defualt:
        break
    }
    console.log(inserted) // 新增的内容
    if(inserted) {
      ob.observeArray(inserted)
    }
    // 我们需要对新增的数据再次进行劫持
    return result
  }
})


