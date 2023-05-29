
let strs = 'hello'
let count = 2
console.log(strs.substring(0, 0))
function digui(n) {
  console.log(n)
  if(!count) return
  else {
    count--
    // console.log(count)
    digui(count)
  }
  return
}
digui(2)