// h() _c()

export function createElementVNode(vm, tag, data, ...children) {
  if(data == null) {
    data = {}
  }
  let key = data.key
  if(key) {
    delete data.key
  }
  return vnode(vm, tag, key, data, children)

}

// _v()
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

// ast 做的是语法层面的转换，他描述的是语法本身(可以描述 js css html)
// 虚拟 DOM 是描述的 DOM 元素，可以增加一些自定义属性(描述 DOM)
function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
    // ...
  }
}