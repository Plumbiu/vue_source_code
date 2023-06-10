export default class Compile {
  constructor(el, vue) {
    // vue 实例
    this.$vue = vue
    // 挂载点
    this.$el = document.querySelector(el)
    // 如果用户传入了挂载点
    if(this.$el) {
      // 调用函数，让节点变为 fragment，类似于 mustache 中的 tokens。实际上用的是 AST，这里就是轻量级的 fragment
      let $fragment = this.node2Fragment(this.$el)
      // 编译
      this.compile($fragment)
    }
  }
  node2Fragment(el) {
    const fragment = document.createDocumentFragment()
    let child
    // 让所有 DOM 节点，都进入 fragment
    while(child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }
  compile(el) {
    console.log('el', el)
    const childNodes = el.childNodes
    const self = this
    childNodes.forEach(node => {
      
      if(node.nodeType === 1) {
        self.compileElement(node)
      } else if(node.nodeType === 3) {
        let text = node.textContent
        console.log(text)
      }
    })
  }
  compileElement(node) {
    const nodeAttrs = node.attributes
    console.log(nodeAttrs)
    // 类数组对象变为数组
    Array.from(nodeAttrs).forEach(attr => {
      // 分析指令
      const attrName = attr.name
      const value = attr.value
      // 指令都是 v- 开头的
      const dir = attrName.substring(2)
      console.log(dir)
      // 看看是不是指令
      if(attrName.indexOf('v-') === 0) {
        // v- 开头的就是指令
        if(dir === 'model') {
          console.log('发现了 model 指令', value)
        } else if(dir == 'if') {
          console.log('发现了 for 指令', value)
        }
      }
    })
  }
  compileText() {

  }
}