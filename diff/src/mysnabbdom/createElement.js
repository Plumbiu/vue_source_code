// 真正创建节点，将 vnode 创建为 DOM，插入到 pivot 这个元素之前
function createElement(vnode) {
  // 把虚拟节点 vnode 插入到标杆 pivot
  // 创建一个 DOM 节点，这个节点现在还是孤儿节点
  let domNode = document.createElement(vnode.sel)
  // 有子节点还是有文本
  if(vnode.text !== '' && (vnode.children === undefined || vnode.children.length === 0)) {
    // 内部是文本
    domNode.innerText = vnode.text
    // 将孤儿节点上树，让标杆节点的父元素调用 insertBefore 将新的孤儿节点插入到标签节点之前
  } else if(Array.isArray(vnode.children) && vnode.children.length > 0) {
    // ...
    for(let i = 0; i < vnode.children.length; i++) {
      let ch = vnode.children[i]
      // 创建出 DOM，一旦调用 createElment 意味着：创建出 DOM 了，并且它的 elm 属性指向了
      // 创建出的 DOM，但还没有上树，是一个孤儿节点
      let chDOM = createElement(ch)
      // 上树
      domNode.appendChild(chDOM)
    }
  }
  vnode.elm = domNode
  // 返回 elm，elm 属性是一个纯 DOM 对象
  return vnode.elm
}
export default createElement