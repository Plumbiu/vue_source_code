import parseAttrsString from "./parseAttrsString"

/**
 *
 * @param {string} templateStr
 */
export default function (templateStr) {
  // 指针
  let index = 0
  // 剩余部分
  let rest = ''
  // 开始标记
  const startRegExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/
  const endRegExp = /^\<\/([a-z]+[1-6]?)\>/
  // 抓取结束标记前的文字
  const wordRegExp = /^([^\<]+)\<\/([a-z]+[1-6]?)\>/
  // 准备两个栈(vue源码一个栈，但是不好理解)
  const stack1 = []
  const stack2 = [{ children: [] }]
  while (index < templateStr.length - 1) {
    rest = templateStr.substring(index)
    // 识别遍历到的这个字符，是不是一个开始标签
    if (startRegExp.test(rest)) {
      let tag = rest.match(startRegExp)[1]
      let attrsString = rest.match(startRegExp)[2]
      console.log('检测到开始标记', tag)
      // 将开始标记推入 stack1 中
      stack1.push(tag)
      // 将空数组推入 stack2 中
      stack2.push({ tag, children: [], attrs: parseAttrsString(attrsString) })
      // 得到 attrs 的长度
      const attrsLength = attrsString ? attrsString.length : 0
      // 指针移动标签的长度 + 2 + 属性长度，因为 <> 占 2 位
      index += tag.length + 2 + attrsLength
    } else if (endRegExp.test(rest)) {
      let tag = rest.match(endRegExp)[1]
      console.log('检测到结束标记', tag)
      // 此时，tag 一定是和栈 1 顶部相同的
      let pop_tag = stack1.pop()
      if (tag === pop_tag) {
        let pop_arr = stack2.pop()

        if (stack2.length > 0) {
          // 检查 stack2 是否有 childrren 属性，没有就创建一个数组
          stack2[stack2.length - 1].children.push(pop_arr)
        }
      } else {
        throw new Error('标签没有封闭')
      }
      // 指针移动标签长度加 3，因为 </> 占 3 位
      index += tag.length + 3
    } else if (wordRegExp.test(rest)) {
      // 识别遍历到的这个字符，是不是文字，并别不能是全空
      let word = rest.match(wordRegExp)[1]
      // 看 word 是不是全是空
      if (!/^\s+$/.test(word)) {
        console.log('检测到文字标记', stack2[stack2.length - 1])
        // 改变此时 stack2 栈顶元素中
        stack2[stack2.length - 1].children.push({ text: word, type: 3 })
      }
      // 指针移动标签长度加 3，因为 </> 占 3 未
      index += word.length
    } else {
      // 标签中的文字
      index++
    }
  }
  console.log('stack1', stack1)
  console.log('stack2', stack2)
  return stack2[0].children[0]
}
