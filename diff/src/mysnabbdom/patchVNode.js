import createElement from "./createElement"
import updateChildren from "./updateChildren"

export default function patchVNode(oldVnode, newVnode) {
  if (oldVnode === newVnode) return
  // 判断新 node 有没有 text 属性
  if (newVnode.text !== undefined && (newVnode.children == undefined || newVnode.children.length === 0)) {
    // newNode 有 text 属性
    if (newVnode.text !== oldVnode.text) {
      // 如果新的虚拟节点中的 text 和虚拟节点的 text 不同，那么直接让新的 text 写入老的 elm 中即可。如果老的 elm 是 children，那么会直接被覆盖
      oldVnode.elm.innerText = newVnode.text
    }
  } else {
    // newVnode 没有 text 属性，即有 children 属性
    // 判断老的有没有 children
    if (oldVnode.children != undefined && oldVnode.children.length > 0) {
      // 老的有 children，此时情况比较复杂，即新老节点均由 children
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
    } else {
      // 老的没有 children，新的具有 children
      // 清空老节点内容
      oldVnode.elm.innerHTML = ''
      // 遍历新的 vnode 的子节点，创建 DOM 上树
      for (let i = 0; i < newVnode.children.length; i++) {
        let dom = createElement(newVnode.children[i])
        oldVnode.elm.appendChild(dom)
      }
    }
  }
  newVnode.elm = oldVnode.elm
}
