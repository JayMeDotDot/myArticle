function mergeSort(arr) {
  let ans = _mergeSort(arr)
  for (let i = 0; i < ans.length; i++) {
    arr[i] = ans[i]
  }
}

function _mergeSort(arr) {
  let len = arr.length
  let m = len >> 1
  if (len <= 1) { return arr }
  let arr1 = _mergeSort(arr.slice(0, m))
  let arr2 = _mergeSort(arr.slice(m))
  return merge(arr1, arr2)
}

function merge(arr1, arr2) {
  let l1 = l2 = 0
  let len1 = arr1.length
  let len2 = arr2.length 
  let tmp = []
  while (l1 < len1 && l2 < len2) {
    if (arr1[l1] <= arr2[l2]) {
      tmp.push(arr1[l1])
      l1++
    } else {
      tmp.push(arr2[l2])
      l2++
    }
  }
  if (l1 >= len1) {
    tmp.push(...arr2.slice(l2))
  } else {
    tmp.push(...arr1.slice(l1))
  }
  return tmp
}

module.exports = { mergeSort }