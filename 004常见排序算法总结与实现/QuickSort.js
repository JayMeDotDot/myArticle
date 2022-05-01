function quickSort(arr) {
  _quickSort(arr, 0, arr.length - 1)
}

function _quickSort(arr, left, right) {
  if (left >= right) { return }
  let pivot = partition(arr, left, right)
  _quickSort(arr, left, pivot - 1)
  _quickSort(arr, pivot + 1, right)
}

function partition(arr, left, right) {
  let value = arr[right]
  let pivot = left
  for (let i = left; i < right; i++) {
    if (arr[i] < value) {
      ;[arr[i], arr[pivot]] = [arr[pivot], arr[i]]
      pivot++
    }
  }
  ;[arr[right], arr[pivot]] = [arr[pivot], arr[right]]
  return pivot
}

module.exports = { quickSort }