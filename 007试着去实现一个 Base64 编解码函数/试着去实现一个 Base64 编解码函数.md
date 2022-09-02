# 试着去实现一个 Base64 编解码函数

> 所有文章及相关代码都会上传至我的 GitHub 仓库，地址为：[JayMe_DotDot/myArticle](https://github.com/JayMeDotDot/myArticle)。
> 如果你觉得文章对你有用，欢迎给仓库一个 star⭐️ 或者在掘金点个 赞👍🏻。

## 百度关于 Base64 的定义

Base64 是网络上常见的用于传输 8bit 字节码的编码方式之一，Base64 就是一种基于 64 个可打印字符来表示二进制数据的方法。
Base64 编码是从二进制到字符的过程，可用于在 HTTP 环境下传递较长的标识信息。采用 Base64 编码具有不可读性，需要啊解码后才能阅读。

## Base64 原理

我们都知道计算机是二进制的，所有的数据本质上都是一串 bits 序列。对于给定的一串 bits 序列，从最左边开始，按顺序每 6bits 为一组进行分组，所以一组能表示 2<sup>6</sup> 次方，也就是 64 种情况，这也是为什么它叫 Base64 的原因。

当然进行编码，我们需要一张转换表，Base64 的转换表如下：
| 索引 | 对应字符 | 索引 | 对应字符 | 索引 | 对应字符 | 索引 | 对应字符 |
| :---:  | :---:  | :---:  | :---:  | :---:  | :---:  | :---:  | :---:  |
|  0 | A | 16 | Q | 32 | g | 48 | w |
|  1 | B | 17 | R | 33 | h | 49 | x |
|  2 | C | 18 | S | 34 | i | 50 | y |
|  3 | D | 19 | T | 35 | j | 51 | z |
|  4 | E | 20 | U | 36 | k | 52 | 0 |
|  5 | F | 21 | V | 37 | l | 53 | 1 |
|  6 | G | 22 | W | 38 | m | 54 | 2 |
|  7 | H | 23 | X | 39 | n | 55 | 3 |
|  8 | I | 24 | Y | 40 | o | 56 | 4 |
|  9 | J | 25 | Z | 41 | p | 57 | 5 |
| 10 | K | 26 | a | 42 | q | 58 | 6 |
| 11 | L | 27 | b | 43 | r | 59 | 7 |
| 12 | M | 28 | c | 44 | s | 60 | 8 |
| 13 | N | 29 | d | 45 | t | 61 | 9 |
| 14 | O | 30 | e | 46 | u | 62 | + |
| 15 | P | 31 | f | 47 | v | 63 | / |

如果 bits 序列的长度正好是 6 的倍数，那么分组没问题；那如果不是，我们就需要进行特殊处理了。
因为我们正常拿到的数据是按照 8bit 字节码进行编码的，所以 bits 序列长度肯定为 8 的倍数。6 和 8 的公倍数是 24，由此可以得出，每 3 个原始字节对应 4 个 Base64 字节。
对于 bits 序列长度不是 6 的倍数的处理思路是：
  1. 在序列最后用 0 进行补齐至 6 的倍数
  2. 如果补齐后不是 8 的倍数，就需要再补，直至为 6 和 8 的公倍数
  3. 上面补上的则用 `=` 进行表示，补了几次就有几个等号

例如：字母 `a`，对应二进制编码为 `01100001`
  1. 首先我们按照 6bit 进行分组，可以分成两组 ===> `011000 01`
  2. 最后两位不够 6bit，需要补 4 个 0 ===> `011000 010000`
  3. 因为不是 8 的倍数，我们需要再补 12 个 0 ===> `011000 010000 000000 000000`

第一组 011000 对应值为 24，查表可得为字符 `Y`
第二组 010000 对应值为 16，查表可得为字符 `Q`
第三组 000000 000000 全部后续补上的，所以不进行转换
第三次 我们进行了两次补码，所以最终 `a` 转换成 Base64 为 `YQ==`

两个字符和三个字符以及以上，可以按照上述步骤进行转换就可以。而解码就是逆向操作
1. 二进制编码为 ===> `011000 010000 000000 000000`
2. 按照 8bit 进行分组 ===> `0100001 00000000 00000000` 
3. 从等号我们知道最后一步进行了两次补码，所以最后两个分组舍去，只取前面的，最终还原为 `a`

从上面的还原方法可以看出，最后补上的码都会被舍去，所以，不管我们补 0 还是 1 都不影响。也就是说：
`011000 011111 000000 000000` 
`011000 010100 000000 000000`
`011000 010011 000000 000000`
...我们都能还原为 `a`

上面就是我对 Base64 编解码的理解，实际中，还有其他一些处理规则，以及因为某些原因需要进行一些转换，详细了解可以去查看百度百科对于 Base64 的介绍。

依照上述步骤，我们就可以实现一个简单的 Base64 的编解码转换器，代码如下：
```javascript
class ToyBase64 {
  constructor() {
    this.str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    this.lookup = {}

    for (let i = 0; i < this.str.length; i++) {
      this.lookup[this.str[i]] = i
    }
  }

  decode(base64String) {
    const len = base64String.length
    if (len % 4 !== 0) throw new Error('Invalid string!')
    const idx = base64String.indexOf('=')
    if (idx !== -1 && idx < len - 2) throw new Error('Invalid string!')

    // 统计最后额外补了多少个 0
    const padZero = (() => {
      if (base64String[len-2] === '=') return 'AA'
      if (base64String[len-1] === '=') return 'A'
      return ''
    })()

    // 去掉补上的等号
    const str = padZero ? `${base64String.slice(0, -padZero.length)}${padZero}` : base64String

    const ans = []

    // 每 四个 base64 的字母 对应 三个字节
    for (let i = 0; i < len; i+=4) {
      const v0 = this.lookup[str[i]]
      const v1 = this.lookup[str[i+1]]
      const v2 = this.lookup[str[i+2]]
      const v3 = this.lookup[str[i+3]]

      const val = (v0 << 18) + (v1 << 12) + (v2 << 6) + v3

      ans.push(
        String.fromCharCode((val >>> 16) & 0xff),
        String.fromCharCode((val >>> 8) & 0xff),
        String.fromCharCode(val & 0xff),
      )
    }

    // 如果有等号的话，转换后的字符串尾部会多 0 个、一个或者两个 code 为 0 的字符
    return (padZero ? ans.slice(0, -padZero.length) : ans).join('')
  }

  encode(originalString) {
    // 简化，只针对 UTF-8 的字符进行处理
    const len = originalString.length
    const ans = []
    let val = 0
    let pad = 0

    // 
    for (let i = 0; i < len; i++) {
      pad = (8 * (i+1)) % 6
      // 迁移 8 位，将后面的字符添加进来
      val = (val << 8) | originalString[i].charCodeAt()
      if (pad === 0) {
        ans.push(
          this.str[val >> 6], 
          this.str[((val >>> 6) << 6) ^ val]
          )
        val = 0
      } else {
        ans.push(this.str[val >> pad])
        val = ((val >>> pad) << pad) ^ val
      }
    }

    // 如果字符串长度不是 3 的倍数，需要在后面补上 = 
    if (pad) {
      ans.push(this.str[val << (6 - pad)], '='.repeat((6 - pad) / 2))
    }

    return ans.join('')
  }
}

let b64 = new ToyBase64()
test()

// 用 10 条随机字符串，测试 ToyBase64 返回值是否和 btoa、atob 一样
function test() {
  for (let i = 0; i < 10; i++) {
    const testString = randomString()
    console.log(`对字符串 ${testString} 进行测试`)
    let encode = b64.encode(testString) === btoa(testString)
    let decode = b64.decode(b64.encode(testString)) === atob(btoa(testString))
    if (encode && decode) { 
      console.log(`第 ${i + 1} 次测试成功\n`) 
    } else {
      console.warn(`第 ${i + 1} 次测试失败\n`)
    }
  }
}

// 生成长度 100 以内的随机字符串
function randomString() {
  let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const len = 1 + Math.floor(Math.random() * 100)
  let ans = ''
  for (let i = 0; i < len; i++) {
    ans += str[Math.floor(Math.random() * 52)]
  }
  return ans
}

```

