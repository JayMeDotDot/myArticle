# call、apply、bind区别及实现


> 所有文章及相关代码都会上传至我的 GitHub 仓库，地址为：[JayMe_DotDot/myArticle](https://github.com/JayMeDotDot/myArticle)。
> 如果你觉得文章对你有用，欢迎给仓库一个 star⭐️ 或者在掘金点个 赞👍🏻。


首先我们来看一下 MDN 对这三个函数的定义：

- `Function.prototype.apply()` 方法调用一个具有给定 `this` 值的函数，以及以一个数组的形式提供的参数。
- `Function.prototype.call()` 方法使用一个制定的 `this` 值和单独给出一个或多个参数来调用一个函数。
- `Function.prototype.bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

所以，`call` 和 `apply` 的区别在于传入的第二个参数，`call` 一个个传，而 `apply` 以数组形式传。`bind` 则是返回一个函数，以供后续使用。

那么，我们我们就自己去实现 apply、call 和 bind


```javascript
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
```

实际测试一下

```javascript
const obj = { name: 'test' }

const func = function() {
  console.log(this.name)
  console.log(arguments)
}

console.log('\n常规调用')
func(1,2,3)

console.log('\n测试 apply')
func.myApply(obj, [1,2,3])


console.log('\n测试 call')
func.myCall(obj, 1,2,3)

console.log('\nbind后调用')
const funcBind = func.myBind(obj)
funcBind(1,2,3)
```

最终测试结果如下图，可以看到，函数的 `this` 已经被正确修改了。

![测试效果](./%E6%B5%8B%E8%AF%95%E6%88%AA%E5%9B%BE.png)