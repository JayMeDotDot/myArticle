// 定义一个链表节点
class Node {
  constructor(val, next){
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
  }
}


// 实现一个 LRU 的基本操作
// 1. 插入到链表头部
// 2. 删除链表尾节点
// 3. 断开中间的节点，插入到头部
// LRU 还需要有一个容量

let head = null

let capacity = 10

function LRU(node) {
  let count = 0
  let dummy = { next: head }
  let index = dummy
  while (index && index.next && count < capacity-1) {
    // 如果找到相等的值，就取出该节点，放入链表头部
    if (index.next.val === node.val) {
      let tmp = breakMid(index)
      tmp.next = head
      head = tmp
      return
    }
    index = index.next
    count += 1
  }
  // 如果链表为空，头节点就是该节点
  if (count === 0) { head = node }
  // 如果链表已经满了，就把尾节点删除
  if (count >= capacity-1) {
    index.next = null
  }
  // 在链表中没有找到相同节点，插入链表头部
  node.next = head
  head = node
}
// 断开某个节点，将该节点两头的节点链接起来，并返回断开的节点
function breakMid(node) {
  let tmp = node.next
  node.next = node.next.next
  return tmp
}

// 塞入 10 个节点
for (let i = 1; i <= capacity; i++) {
  LRU(new Node(i))
}
// 遍历打印出来
let test1 = head
while (test1) {
  console.log(test1.val)
  test1 = test1.next
}

// 再塞入第 11 个节点
LRU(new Node(11))
console.log();
let test2 = head
while (test2) {
  console.log(test2.val)
  test2 = test2.next
}

// 塞入第 12 个节点，但是该节点已在链表中
LRU(new Node(8))
console.log();
let test3 = head
while (test3) {
  console.log(test3.val)
  test3 = test3.next
}