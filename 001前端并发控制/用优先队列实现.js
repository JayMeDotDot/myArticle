class PriorityQueue {
  constructor(max=10) {
    // 用数组存储数据
    this.queue = [null]
    // 记录队列中已存在的个数
    this.count = 0
    // 设置堆可以存储的最大数据个数
    this.max = max
  }

  // 入队操作
  enqueue(element) {
    if (this.count >= this.max) { return -1 }  // 队列已满，入队失败
    this.count = this.count + 1
    this.queue[this.count] = element
    let index = this.count
    let tmp = Math.floor(index / 2)
    while (tmp > 0 && this.queue[index].priority > this.queue[tmp].priority) {
      [this.queue[index], this.queue[tmp]] = [this.queue[tmp], this.queue[index]]
      index = tmp
      tmp = Math.floor(index / 2)
    }
  }

  // 出队操作
  dequeue() {
    if (this.count === 0) { return -1 }  // 队列为空，出队失败
    let element = this.queue[1]
    this.queue[1] = this.queue[this.count]
    delete this.queue[this.count]
    this.count = this.count - 1
    this.heapify(1)
    return element
  }

  // 自上而下进行堆化
  heapify(index) {
    let maxIndex = index
    while (true) {
      if (index*2 <= this.count && this.queue[maxIndex].priority < this.queue[index*2].priority) { maxIndex = index*2 }
      if (index*2+1 <= this.count && this.queue[maxIndex].priority < this.queue[index*2+1].priority) { maxIndex = index*2+1 }
      if (maxIndex === index) { break }
      [this.queue[index], this.queue[maxIndex]] = [this.queue[maxIndex], this.queue[index]]
      index = maxIndex
    }
  }
}


function sendRequest(urls, max, callback) {
  return new Promise(() => {
    let myFetch = async () => {
      while (max > 0 && urls.count > 0) {
        max--;
        let url = urls.dequeue()
        console.log(url.priority)
        fetch(url.value)
          .then(response => response.text())
          .then(data => {
            callback(data)
            max++;
            myFetch()
          })
      }
    }
    myFetch()
  })
}


let urls = new PriorityQueue()
urls.enqueue({value: 'https://www.baidu.com', priority: 7})
urls.enqueue({value: 'https://www.baidu.com', priority: 4})
urls.enqueue({value: 'https://www.baidu.com', priority: 9})
urls.enqueue({value: 'https://www.baidu.com', priority: 1})
urls.enqueue({value: 'https://www.baidu.com', priority: 6})
urls.enqueue({value: 'https://www.baidu.com', priority: 3})
urls.enqueue({value: 'https://www.baidu.com', priority: 2})
urls.enqueue({value: 'https://www.baidu.com', priority: 5})
urls.enqueue({value: 'https://www.baidu.com', priority: 8})
urls.enqueue({value: 'https://www.baidu.com', priority: 10})

let fn = (data) => {
  console.log(Date.now())
  console.log(data.slice(0,10))
}

sendRequest(urls, 3, fn)

urls.enqueue({value: 'https://www.baidu.com', priority: 12})