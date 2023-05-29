import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
} from 'snabbdom'

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
])

const myVnode1 = h(
  'a',
  { props: { href: 'http://blog.plumbiu.club' } },
  'Plumbiuの小屋'
)
const myVnode3 = h('ul', [
  h('li', '苹果'),
  h('li', '西瓜'),
  h('li', '火龙果'),
  h('li', [
    h('div', [
      h('p', 'hello'),
      h('p', 'world')
    ])
  ]),
])

console.log(myVnode1)

// 让虚拟节点上树
const container = document.getElementById('container')
patch(container, myVnode3)
