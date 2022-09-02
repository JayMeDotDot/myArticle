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
