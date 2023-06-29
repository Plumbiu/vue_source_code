import parseHTML from './parse'

function genProps(attrs) {
  let str = '' // { name, value }
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      // style:  { color: 'red' }
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function gen(node) {
  console.log(node)
  if (node.type === 1) {
    return codegen(node)
  } else {
    // 文本
    let text = node.text
    console.log('text', text)
    if(!defaultTagRE.test(text)) {
      console.log('匹配成功')
      return `_v(${JSON.stringify(text)})`
    } else {
      console.log('匹配成功')
      // _v(_s(name) + 'hello' + _(name))
      let tokens = []
      let match
      defaultTagRE.lastIndex = 0
      let lastIndex = 0
      while(match = defaultTagRE.exec(text)) {
        let index = match.index // 匹配的位置，{{name}} hello {{age}}
        if(index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }

        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if(lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }
    return 'xxx'
  }
}

function genChildren(children) {
  console.log('children', children)
  return children.map(child => {
    console.log('child', child)
    return gen(child)
  })
}

function codegen(ast) {
  let children = genChildren(ast.children)
  let code = `_c('${ast.tag}', ${ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'}${ast.children.length ? `,${children}` : ''})`
  return code
}

export default function complieToFunction(template) {
  // 1. 将 template 转换为 ast 语法树
  let ast = parseHTML(template)
  // console.log(ast)
  // 2. 生成 render 方法(render 方法返回的结果就是虚拟 DOM)
  let code = codegen(ast)
  console.log(code)
  code = `with(this){return ${code}}`
  let render = new Function(code) // 根据代码生成 render 函数
  return render
  // function render(h) {
  //   return _c('div', { id: 'app' }, _c('div', { style: { color: 'red' } }, _v(_s(name) + 'hello'), _c('span', undefined, _v(_s(age)))))
  // }
  // console.log(template)
}
