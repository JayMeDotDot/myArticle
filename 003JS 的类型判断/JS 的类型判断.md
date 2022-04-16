# JS 的类型判断

> 这是我的 GitHub：[JayMeDotDot](https://github.com/JayMeDotDot/) 欢迎大家关注

在日常编程中，我们经常会遇到需要依据一个 JS 类型，来对其进行一些处理。首先，我们来看一下 JS 中究竟有多少种基本类型。

## JS 的类型

JS 语言中类型集合由原始值和对象组成。
JS 的原始值有七种：String、Number、Boolean、undefined、null、Symbol、BigInt。
在 JS 中，对象可以被看作是一组属性的集合。

## 类型判断方法
那么我们如何在 JS 中去判断一个变量是什么类型呢？
  1. **typeof 操作符**
  ```javascript
  // 数值
  typeof 37 === 'number';
  typeof 42n === 'bigint';
  typeof NaN === 'number'; 

  // 字符串
  typeof 'bla' === 'string';

  // 布尔值
  typeof true === 'boolean';

  // Symbols
  typeof Symbol() === 'symbol';

  // Undefined
  typeof undefined === 'undefined';

  // 对象
  typeof {a: 1} === 'object';
  typeof [1, 2, 4] === 'object';
  typeof new Date() === 'object';
  typeof null === 'object';

  // 函数
  typeof function() {} === 'function';

  ```

  从上面的例子中，可以发现，typeof 操作符有一定的缺陷，虽然它可以区分function，但是它无法区分 NaN、null、Array。
  而且，当你使用 new 关键字来创建 Boolean、Number、String 的时候，其实创建的是一个对象，typeof 返回也是一个对象。如果你需要使用的话就得非常小心。

  ```javascript
  typeof new Boolean(true) === 'object';
  typeof new Number(1) === 'object';
  typeof new String('abc') === 'object';
  ```

  2. **区分 Array 和 Object**

  那么如何区分 Array 和 Object 呢？
  我们可以使用 Array.isArray 或者 Object.prototype.toString.call 来区分数组和普通对象

  ```javascript
  Array.isArray([]) // true
  Object.prototype.toString.call([]) // '[object Array]'
  ```

  3. **区分自定义类型**

  那么如何去区分自定义的类型呢？看如下情形
  ```javascript
  function Person(name) {
    this.name = name
  }
  
  let person = new Person('Jack')

  typeof person  // 'object'
  Object.prototype.toString.call(person) // '[object Object]'
  ```

  可以看到一般情况下 JS 是无法区分的，我们只能通过 instanceof 来确定 person 是 Person 的实例。
  但 ES6 可以通过 Symbol.toStringTag 这个 Symbol 来改变调用 Object.prototype.toString.call 时返回的身份标识。

  ```javascript
  function Person(name) {
    this.name = name
  }

  Person.prototype[Symbol.toStringTag] = 'Person'

  Person.prototype.toString = function() {
    return this.name
  }

  let person = new Person('Jack')

  person.toString(person)  // 'Jack'
  Object.prototype.toString.call(person)  // '[object Person]'
  ```

