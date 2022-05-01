function insertSort(arr) {
  if (arr.length < 1) { return }

  for (let i = 1; i < arr.length; i++) {
    let value = arr[i]
    let j = i - 1
    for (; j >= 0; j--) {
      if (arr[j] > value) {
        arr[j+1] = arr[j] // 移动元素
      } else {
        break
      }
    }
    arr[j+1] = value
  }
}

module.exports = { insertSort }