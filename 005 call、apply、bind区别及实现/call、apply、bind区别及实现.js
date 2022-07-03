// 实现一个自己的 apply 方法
Function.prototype.myApply =  function() {
  const self = this
  const obj = arguments[0]
  const arg = [...arguments[1]]
  if (!obj) { return self(...arg) }
  // 使用 Symbol 保证唯一
  const tag = Symbol()
  obj[tag] = self
  return obj[tag](...arg)
}

// 实现一个自己的 call 方法
Function.prototype.myCall =  function() {
  const self = this
  const obj = arguments[0]
  const arg = [...arguments].slice(1)
  if (!obj) { return self(...arg) }
  // 使用 Symbol 保证唯一
  const tag = Symbol()
  obj[tag] = self
  return obj[tag](...arg)
}

// 实现一个自己的 bind 方法
Function.prototype.myBind =  function(context) {
  const self = this
  return function() {
    return self.myApply(context, arguments)
  }
}

const obj = { name: 'test' }

const func = function() {
  console.log(this.name)
  console.log(arguments)
}

// 常规调用
console.log('\n常规调用')
func(1,2,3)

console.log('\n测试 apply')
func.myApply(obj, [1,2,3])


console.log('\n测试 call')
func.myCall(obj, 1,2,3)

console.log('\nbind后调用')
const funcBind = func.myBind(obj)
funcBind(1,2,3)