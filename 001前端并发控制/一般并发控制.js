function sendRequest(urls, max, callback) {
  return new Promise(() => {
    let myFetch = async () => {
      while (max > 0 && urls.length > 0) {
        max--;
        let url = urls.shift()
        fetch(url)
          .then((response) => response.text())
          .then((data) => {
            callback(data)
            max++;
            myFetch()
          })
      }
    }
  
    myFetch()
  })
}

let urls = Array(10).fill('https://www.baidu.com')
let fn = (data) => {
  console.log(Date.now())
  console.log(data.slice(0,10))
}

sendRequest(urls, 3, fn)

