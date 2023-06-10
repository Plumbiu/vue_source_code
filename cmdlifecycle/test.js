// stack2 栈
[
  { children: [] }
]
// 遇到 <div>
[
  { children: [] },
  { tag: 'div', children: [] }
]
// 遇到 <h3>
[
  { children: [] },
  { tag: 'div', children: [] },
  { tag: 'h3', children: [] }
]
// 遇到 "你好"
[
  { children: [] },
  { tag: 'div', children: [] },
  { tag: 'h3', children: [{
    text: '你好',
    type: 3
  }] }
]
// 遇到 </h3>
[
  { children: [] },
  { tag: 'div', children: [{
    tag: 'h3', children: [{
      text: '你好',
      type: 3
    }]
  }] }
]
// ...