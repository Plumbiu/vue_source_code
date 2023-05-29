import h from './mysnabbdom/h'
import patch from './mysnabbdom/patch'

const container = document.getElementById('container')

const vnode1 = h('ul', {key: 'ul'}, [
  h('li', {key: 'A'}, 'A'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'D'}, 'D'),

]) 
const btn = document.getElementById('btn')
patch(container, vnode1)

const vnode2 = h('ul', {key: 'ul'}, [
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'A'}, 'A'),
])

btn.onclick = function() {
  patch(vnode1, vnode2)
}