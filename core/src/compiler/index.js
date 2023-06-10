const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 匹配到的是分组是一个标签名， <xxx 匹配到的是开始标签的名字
const startTagOpen = new RegExp(`^<${qnameCapture}`)
console.log(startTagOpen)
// 匹配的是 </xxx> 最终匹配到的分组就是结束标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
console.log(endTag)
// 第一个分组就是属性的 key value，就是分组 3/4/5
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
console.log(attribute)
// <div> <br />
const startTagclose = /^\s*(\/?)>/
console.log(startTagclose)
// 匹配到的内容是 {{}} 中的变量
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
console.log(defaultTagRE)

// vue3 采用的不是正则
// 对模板进行编译处理

/*
  {
    tag: 'div,
    type: 1,
    attrs: [{name, age. address}],
    parent: null,
    children: []
  }


*/


function parseHTML(html) {
  // 最终需要转换为一棵抽象语法树
  function start(tag, attrs) {
    console.log('开始', tag, attrs)
  }
  function chars(text) {
    console.log('文本', text)

  }
  function end(tag) {
    console.log('结束', tag)

  }
  // html 第一个肯定是一个 <
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    console.log(start)
    if (start) {
      const match = {
        tagName: start[1], // 标签名
        attrs: [],
      }
      advance(start[0].length)
      // 如果不是开始标签的结束，就一直匹配下去
      let attr, end
      while (!(end = html.match(startTagclose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] || true })
      }
      if (end) {
        advance(end[0].length)
      }
      // console.log(match)
      return match
    }

    console.log(html)
    return false // 不是开始标签
  }
  while (html) {
    // 如果 textEnd 为 0，说明是一个开始标签的或结束标签
    // 如果 textEnd > 0，则说明是文本的结束位置
    let textEnd = html.indexOf('<') // 如果 indexOf 中的索引是 0，则说明是一个标签
    if (textEnd === 0) {
      const startTagMatch = parseStartTag() // 开始标签的匹配
      if (startTagMatch) { // 解析到的开始标签
        // console.log(html)
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch = html.match(endTag)
      if(endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd) // 文本内容
      if (text) {
        chars(text)
        advance(text.length) // 解析到的文本
      }
    }
  }
  console.log(html)
}

export default function complieToFunction(template) {
  // 1. 将 template 转换为 ast 语法树
  let ast = parseHTML(template)
  // 2. 生成 render 方法(render 方法返回的结果就是虚拟 DOM)

  // console.log(template)
}
