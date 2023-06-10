import { newArrayProto } from './array'

class Observer {
  constructor(data) {
    // data.__ob__ = this // 给数据加了一个标识，如果数据上有 __ob__，则说明这个属性被观测过，！！！此写法会死循环！！！
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    }) // 改成不可枚举
    // Object.definePropetry 只能劫持已经存在的属性，后增或者删除的不可以
    if(Array.isArray(data)) {
      // 重写数组中的方法，7个可以直接修改数组本身的方法
      data.__proto__ = newArrayProto // 保留数组原有的特性，并且可以重写部分方法
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  walk(data) {
    // 循环对象，对属性依次劫持
    // "重新定义"属性，性能比较差
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }
  observeArray(data) {
    data.forEach(item => observe(item))
  }
}

export function defineReactive(target, key, value) {
  observe(value) // 对所有的对象都进行属性劫持
  // 闭包
  Object.defineProperty(target, key, {
    get() {
      console.log('用户取值了')
      // 取值的时候，会执行get
      return value
    },
    set(newValue) {
      // 修改的时候，会执行set
      console.log('用户设置值了')
      if (newValue === value) return
      observe(newValue)
      value = newValue
    },
  })
}

export function observe(data) {
  if (typeof data !== 'object' || data == null) {
    return // 只对对象进行劫持
  }
  if(data.__ob__ instanceof Observer) { // 说明这个对象被代理过了
    return data.__ob__
  }
  // 如果一个对象被劫持，那就不需要再被劫持了(要判断一个对象是否被劫持过，可以增添实例，用实例判断是否被劫持过)
  return new Observer(data)
}
