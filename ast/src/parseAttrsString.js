// 将 attrsString 装换为数组
export default function(attrsString) {
  if(!attrsString) return []
  console.log(attrsString)
  // 是否在引号内
  let isInQuote = false
  // 端点
  let point = 0
  // 结果数组
  let result = []
  // 遍历 attrsString
  for(let i = 0; i < attrsString.length; i++) {
    let char = attrsString[i]
    if(char === '"') {
      isInQuote = !isInQuote
    } else if(char === ' ' && !isInQuote) {
      if(!/^\s*$/.test(attrsString.substring(point, i))) {
        result.push(attrsString.substring(point, i).trim())
        console.log('result', result)
        point = i
      }
    }
  }
  // 循环结束之后，最后还剩一个
  result.push(attrsString.substring(point).trim())
  // 将结果数组转换为对应格式
  result = result.map(item => {
    // 根据等号拆分
    const o = item.match(/^(.+)="(.+)"$/)
    return {
      name: o[1],
      value: o[2]
    }
  })
  return result
}