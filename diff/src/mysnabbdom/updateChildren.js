import createElement from "./createElement"
import patchVNode from "./patchVNode"

function checkSameVnode(a, b) {
  return a.sel === b.sel && a.key === b.key
}
export default function updateChildren(parentElm, oldCh, newCh) {
  // 旧前
  let oldStartIdx = 0
  // 新前
  let newStartIdx = 0
  // 旧后
  let oldEndIdx = oldCh.length - 1
  // 新后
  let newEndIdx = newCh.length - 1
  // 旧前节点
  let oldStartVnode = oldCh[0]
  // 旧后节点
  let oldEndVnode = oldCh[oldEndIdx]
  // 新前节点
  let newStartVnode = newCh[0]
  // 新后节点
  let newEndVnode = newCh[newEndIdx]
  let keyMap = null
  // 开始 while 循环
  while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if(oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if(oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if(newStartVnode == null) {
      newStartVnode = oldCh[++newStartIdx]
    } else if(oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if(checkSameVnode(oldStartVnode, newStartVnode)) {
      // 新前和旧前
      console.log('1.1 新前旧后命中')
      patchVNode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if(checkSameVnode(newEndVnode, oldEndVnode)) {
      // 新后和旧后
      console.log('1.2 新后旧后命中')
      patchVNode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if(checkSameVnode(newEndVnode, oldStartVnode)) {
      // 新后和旧前
      console.log('1.3 新后旧前命中')
      patchVNode(oldStartVnode, newEndVnode)
      // 当 新后与旧前 命中的时候，此时要移动节点，移动新前指向的这个节点到老节点的旧后的后面
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if(checkSameVnode(newStartVnode, oldEndVnode)) {
      // 新前和旧后
      console.log('1.4 新前旧后命中')
      patchVNode(oldEndVnode, newStartVnode)
      // 当 新后与旧前 命中的时候，此时要移动节点，移动新前指向的这个节点到老节点的旧后的后面
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 四种都没有命中
      // 寻找 key 的 map，
      if(!keyMap) {
        keyMap = {}
        // 从 oldStartIdx 开始，到 oldEndIdx 结束，创建 keyMap 映射对象
        for(let i = oldStartIdx; i <= oldEndIdx; i++) {
          const key = oldCh[i].key
          if(key !== undefined) {
            keyMap[key] = i
          }
        }
      }
      console.log(keyMap)
      // 寻找当前 newStartIdx 这项在 keyMap 中的映射的位置序号
      const idxInOld = keyMap[newStartVnode.key]
      console.log(idxInOld, 'idxInOld')
      if(idxInOld === undefined) {
        // 如果 idxInOld 是 undefined，表明它是全新的项
        // 被加入的项(就是 newStartvNode 这项)
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      } else {
        // 如果 idxInOld 不是 undefined，表明不是全新的项，要进行移动
        const elmToMove = oldCh[idxInOld]
        patchVNode(elmToMove, newStartVnode)
        // 把这项设置为 undefined，表示已经处理完这项了
        oldCh[idxInOld] = undefined
        // 移动，调用 insertBefore 也可以实现移动
        parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  // 继续观望有没有剩余的，循环结束了 start 还是比 oldEndIdx 小
  if(newStartIdx <= newEndIdx) {
    console.log('new 还有剩余')
    const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
    for(let i = newStartIdx; i <= newEndIdx; i++) {
      parentElm.insertBefore(createElement(newCh[i]), before)
    }
  } else if(oldStartIdx <= oldEndIdx) {
    console.log(oldStartIdx, oldEndIdx)
    console.log('old 还有节点剩余')
    // 批量删除 oldStart 和 oldEnd 指针之间的项
    for(let i = oldStartIdx; i <= oldEndIdx; i++) {
      if(oldCh[i]) {
        parentElm.removeChild(oldCh[i].elm)
      }
    }
  }
}