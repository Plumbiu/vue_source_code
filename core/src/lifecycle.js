import { createElementVNode, createTextVNode } from "./vdom"

function createElm(vnode) {
  let { tag, data, children, text } = vnode
  if(typeof tag === 'string') { // 标签
    vnode.el = document.createElement(tag) // 这里将真实节点和虚拟节点对应起来，后续如果修改属性了

    patchProps(vnode.el, data)

    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function patchProps(el, props) {
  for(let key in props) {
    if(key === 'style') { // style { color: 'red' }
      for(let styleName in props['style']) {
        el.style[styleName] = props.style[styleName]
      }
    } else {
      el.setAttribute(key, props[key])
    }
  }
}

function patch(oldVNode, vnode) {
  // 写的是初渲染流程
  console.log(oldVNode)
  const isRealElement = oldVNode.nodeType
  if(isRealElement) {
    const elm = oldVNode // 获取真实元素
    const parentElm = elm.parentNode // 获取父元素
    let newElm = createElm(vnode)
    console.log('newElm', newElm)
    parentElm.insertBefore(newElm, elm.nextSibling)
    parentElm.removeChild(elm) // 删除老节点
    return newElm
  } else {
    // diff 算法
  }
}


export function initLifeCycle(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    const el = vm.$el
    // patch 既有初始化功能，又有更新的功能
    // 将 vnode 转换为真实 DOM
    console.log(vnode, el)
    vm.$el = patch(el, vnode)
  }
  // _c('div', {}, ...children)
  Vue.prototype._c = function() {
    return createElementVNode(this, ...arguments)
  }
  // _v(text)
  Vue.prototype._v = function() {
    return createTextVNode(this, ...arguments)
  }
  Vue.prototype._s = function(value) {
    if(typeof value !== 'object') return value
    return JSON.stringify(value)
  }
  Vue.prototype._render = function() {
    console.log('render', this)
    // 让 with 中的 this 指向 vm
    return this.$options.render.call(this) // 通过 ast 语法转义后生成的 render 方法
  }
}

export function mountComponent(vm, el) { // 这里的 el，是通过 querySelector 处理过的
  vm.$el = el
  // 1. 调用 render 犯法产生虚拟节点(虚拟 DOM)
  vm._update(vm._render()) // vm.$options.render -> 返回虚拟节点
  // 2. 根据虚拟 DOM 产生真实 DOM
  // 3. 插入到 el 元素中

}

// Vue 核心流程 
//  1. 创建响应式数据
//  2. 模板转换成 ast 语法树
//  3. 将 ast 语法树转换成 render 函数
//  4. 后续每次数据更新可以只调用 render 函数，无需再次执行 ast 转换的过程

// render 函数会产生虚拟节点(使用响应式数据)
// 根据生成的虚拟节点创造真实的 DOM