import { newArrayProto } from "./array"

class Observer {
  constructor(data) {
    // Object.defineProperty 只能劫持已经存在的属性，新增删除数据不可以
    // vue 里面会为此单独写一些 api $set $delete
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })
    // 有 bug，会无限循环，使用以上的方法
    // data.__ob__ = this // 给数据加了一个标示，如果数据上有 __ob__，则说明这个属性被观测到了
    if(Array.isArray(data)) {
      // 这里我们可以重写数组中的方法: 7个编译方法，可以修改数组本身
      this.observeArrray(data) // 如果数组中放的是对象，可以监控到对象的变化
      data.__proto__ = newArrayProto // 需要保留数组原有的特性，并且可以重写部分方法 
    } else {
      this.walk(data)
    }
  }
  walk(data) { // 循环对象，对属性依次劫持
    // 重新定义属性，性能差
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }
  observeArrray(data) {
    data.forEach(item => observe(item))
  }
}

export function defineReactive(target, key, value) { // 闭包，属性劫持
  observe(value) // 对所有的对象都进行属性劫持
  Object.defineProperty(target, key, {
    get() { // 取值的时候，会执行 get
      console.log('key', key)
      return value
    },
    set(newValue) { // 修改的时候，会执行 set
      console.log('用户设置值了了')
      if(newValue === value) return
      value = newValue
    }
  })
}

export function observe(data) {
  // 对这个对象进行劫持
  if(typeof data !== 'object' || data === null) {
    return // 只对对象进行劫持
  }
  if(data.__ob__ instanceof Observer) { // 说明这个对象被代理过了
    return data.__ob__
  }
  // 如果一个对象被劫持过了，那就不需要再被劫持了
  // 要判断一个对象是否被劫持，可以增添一个实例，用实例来判断是否被劫持过
  return new Observer(data)
}