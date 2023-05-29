import vnode from './vnode'

// 编写一个低配版本的 h 函数，只接受三个参数，重载能力较弱
// 也就是说必须是下面三种之一
/*
  1. h('div', {}, '文字')
  2. h('div', {}, [])
  3. h('div', {}, h())
*/
export default function(sel, data, c) {
  if(arguments.length !== 3) throw new Error('必须传入三个参数，我们是低配版 h 函数')
  // 检查参数 c 的类型
  if(typeof c === 'string' || typeof c === 'number') {
    // h 函数是第 1 种情况
    return vnode(sel, data, undefined, c, undefined)
  } else if(Array.isArray(c)) {
    // h 函数是第 2 种情况
    let children = []
    for(let i = 0; i < c.length; i++) {
      // 检查 c[i] 必须是一个对象
      if(!typeof c[i] === 'object' && Reflect.has(c[i], 'sel'))
        throw new Error('传入的数组参数不是 h 函数')
      // 不用执行 c[i]，因为 c[i] 已经执行了，我们只需要收集好就可以
      children.push(c[i])
    }
    // 循环结束，children 收集完毕，可以返回
    return vnode(sel, data, children, undefined, undefined)
  } else if(typeof c === 'object' && Reflect.has(c, 'sel')) {
    // h 函数是第 3 种情况
    // 传入的 c 是唯一的一个 children，不用执行 c，因为测试语句中已经执行了 c
    let children = [c]
    return vnode(sel, data, children, undefined, undefined)
  } else {
    throw new Error('传入的第 3 个参数类型错误')
  }
}

