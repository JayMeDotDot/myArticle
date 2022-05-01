function selectionSort(arr) {
  let index = 0
  while (index < arr.length - 1) {
    let minIndex = index
    for (let i = index; i < arr.length; i++) {
      if (arr[i] < arr[minIndex]) {
        minIndex = i
      }
    }
    ;[arr[index], arr[minIndex]] = [arr[minIndex], arr[index]]
    index++
  }
}

module.exports = { selectionSort }