function bubbleSort(arr) {
  const len = arr.length
  
  let flag = false

  for (let c = 0; c < len; c++) {
    flag = false
    for (let i = 0; i < len - 1; i++) {
      // 只有当 i 位数据比 i+1 位数据大时
      // 才进行数据交换，保证排序的稳定性
      if (arr[i] > arr[i+1]) {
        [arr[i], arr[i+1]] = [arr[i+1], arr[i]]
        flag = true
      }
    }
    // 如果遍历过后没有发生数据交换，说明已经是有序的了
    if (!flag) { return arr }
  }
  return arr
}

module.exports = { bubbleSort }