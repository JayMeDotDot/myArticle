const { bubbleSort } = require('./BubbleSort')
const { insertSort } = require('./InsertSort')
const { selectionSort } = require('./SelectionSort')
const { mergeSort } = require('./MergeSort')
const { quickSort } = require('./QuickSort')



/**
 * 测试函数
 * @param { sortFn, testArr, smallArr,  largeArr }
 */
function benchmark(fn) {
/**
 * 随机生成两组数组：
 * 1. 测试样本 -- 10个
 * 2. 小数据量 -- 100个
 * 3. 大数据量 -- 1万个
 */

 const testArr = Array(10).fill(0).map(i => Math.floor(i + Math.random() * 10))
 const smallArr = Array(1000).fill(0).map(i => Math.floor(i + Math.random() * 10))
 const largeArr = Array(10000).fill(0).map(i => Math.floor(i + Math.random() * 10))

  console.log(`\nTest ${fn.name} start...`)

  console.log('\ntestArr\n')
  console.time()
  console.log(testArr)
  fn(testArr)
  console.log(testArr)
  console.timeEnd()

  console.log('\nsmallArr\n')
  console.time()
  fn(smallArr)
  console.timeEnd()

  console.log('\nlargeArr\n')
  console.time()
  fn(largeArr)
  console.timeEnd()
}


benchmark(bubbleSort)
benchmark(insertSort)
benchmark(selectionSort)
benchmark(mergeSort)
benchmark(quickSort)