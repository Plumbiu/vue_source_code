import createElement from './createElement'
import patchVNode from './patchVNode'
import vnode from './vnode'

export default function (oldVnode, newVnode) {
  // 判断传入的第一个参数，是 DOM 节点还是虚拟节点？
  if (oldVnode.sel === '' || oldVnode.sel === undefined) {
    // DOM 节点，要包装为虚拟节点
    oldVnode = vnode(
      oldVnode.tagName.toLowerCase(),
      {},
      [],
      undefined,
      oldVnode
    )
  }
  // 判断 oldVnode 和 newVnode 是不是同一个节点
  if (oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
    // 是同一个节点
    patchVNode( oldVnode, newVnode)
  } else {
    // 拆掉旧的，插入新的
    let newVnodeElm = createElement(newVnode, oldVnode.elm)
    if (oldVnode.elm !== undefined && newVnodeElm) {
      // 插入到老节点之前
      oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
    }
    // 删除节点
    oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  }
}
