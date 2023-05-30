import parse from "./parse"

const templateStr = `
  <div>
    <h3 class="aa bb cc" id="hello">你好</h3>
    <ul>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </ul>
  </div>
`

const ast = parse(templateStr)
console.log(JSON.stringify(ast))