## 简答题

### 一、谈谈你是如何理解 JS 异步编程的，EventLoop、消息队列都是做什么的，什么是宏任务，什么是微任务？

异步编程简单来说就是将一段代码延后执行，先放一边，让其他代码先执行，等到时机成熟了再拉回来执行下。

代码延后执行就意味这段代码被挂起，处于等待状态，需要放在其他线程，不然会堵塞当前线程。而 JS 是单线程的，需要借助平台（比如浏览器、node）提供的 API 才能将这些代码放在其他线程上，比如 setTimeout、XHR。

这些被挂起的代码在另外一个线程上会被这个线程监控，等到了时机成熟后（比如 setTimeout 计时结束或者 XHR 得到响应）会被放入消息队列里。JS 的线程里会有一个调用栈，会将所有的同步代码依次执行。执行完成后会检查消息队列里有没有代码，如果有会把消息队列里的代码依次拉入调用栈里，然后继续依次执行，等再次执行完后会再次去检查消息队列，就这样不断重复，这个过程就叫 EventLoop 。

在异步编程里面还分宏任务和微任务，两者都会放入消息队列里，只是 JS 会优先执行完微任务后才去执行宏任务。setTimeout、XHR 都属于宏任务，Promise 的 .then 属于微任务。

## 代码题

### 一、将下面异步代码使用 Promise 的方式改进

```js
setTimeout(function () {
    var a = 'hello';
    setTimeout(function () {
        var b = 'lagou';
        setTimeout(function () {
            var c = 'I ❤️ U';
            console.log(a + b + c)
        }, 10)
    }, 10)
}, 10)
```

答案请看 [1-1.js](./code/1-1.js)

### 二、基于以下代码完成下面的四个练习

```js
const fp = require('lodash/fp')
// 数据
// horsepower 马力，dollar_value 价格，in_stock 库存
const cars =[
    {
        name: 'Ferrari FF',
        horsepower: 660,
        dollar_value: 700000,
        in_stock: true
    },
    {
        name: 'Spyker C12 Zagato',
        horsepower: 650,
        dollar_value: 648000,
        in_stock: false
    },
    {
        name: 'Jaguar XKR-S',
        horsepower: 550,
        dollar_value: 132000,
        in_stock: false
    },
    {
        name: 'Audi R8',
        horsepower: 525,
        dollar_value: 114200,
        in_stock: false
    },
    {
        name: 'Aston Martin One-77',
        horsepower: 750,
        dollar_value: 1850000,
        in_stock: true
    },
    {
        name: 'Pagani Huayra',
        horsepower: 700,
        dollar_value: 1300000,
        in_stock: false
    }
]
```

#### 练习1：使用函数组合 fp.flowRight() 重新实现下面这个函数

```js
let isLastInStock = function (cars) {
    // 获取最后一条数据
    let last_car = fp.last(cars)
    // 获取最后一条数据的 in_stock 属性值
    return fp.prop('in_stock', last_car)
}
```

答案请看 [2-1.js](./code/2-1.js)

#### 练习2：使用 fp.flowRight()、fp,prop() 和 fp.first() 获取第一个 car 的 name

答案请看 [2-2.js](./code/2-2.js)

#### 练习3：使用帮助函数 _average 重构 averageDollarValue，使用函数组合的方式实现

```js
let _average = function (xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}
let averageDollarValue = function (cars) {
    let dollar_values = fp.map(function (car) {
        return car.dollar_value
    }, cars)
    return _average(dollar_values);
}
```

答案请看 [2-3.js](./code/2-3.js)

#### 练习4：使用 flowRight 写一个 sanitizeNames() 函数，返回一个下划线连接的小写字符串，把数组中的 name 转换为这种形式：例如：sanitizeNames(["Hello World"]) => ["hello_world"]

```js
let _underscore = fp.replace(/\W+/g, '_') // <-- 无须改动，并在 sanitizeNames 中使用它
```

答案请看 [2-4.js](./code/2-4.js)

### 三、基于下面提供的代码，完成后续的四个练习

```js
// support.js
class Container {
    static of(value) {
        return new Container(value)
    }
    constructor(value) {
        this._value = value;
    }
    map(fn) {
        return Container.of(fn(this._value))
    }
}
class Maybe {
    static of(x) {
        return new Maybe(x)
    }
    isNothing() {
        return this._value === null || this._value === undefined
    }
    constructor(x) {
        this._value = x
    }
    map(fn) {
        return this.isNothing() ? this : Maybe.of(fn(this._value))
    }
}
module.exports = { Maybe, Container }
```

#### 练习1：使用 fp.add(x, y) 和 fp.map(f, x) 创建一个能让 functor 里的值增加的函数 ex1

```js
// app.js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let maybe = Maybe.of([5, 6, 1]);
let ex1 = () => {
    // 你需要实现的函数。。。
}
```

答案请看 [3-1/app.js](./code/3-1/app.js)

#### 练习2：实现一个函数 ex2，能够使用 fp.first 获取列表的第一个元素

```js
// app.js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
    // 你需要实现的函数。。。
}
```

答案请看 [3-2/app.js](./code/3-2/app.js)

#### 练习3：实现一个函数 ex3 ，使用 safeProp 和 fp.first 找到 user 的名字的首字母

```js
// app.js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let safeProp = fp.curry(function (x, o) {
    return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }
let ex3 = () => {
    // 你需要实现的函数。。。
}
```

答案请看 [3-3/app.js](./code/3-3/app.js)

#### 练习4：使用 Maybe 重写 ex4 ，不要有 if 语句

```js
// app.js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let ex4 = function (n) => {
    if (n) {
        return parseInt(n)
    }
}
```

答案请看 [3-4/app.js](./code/3-4/app.js)

### 四、手写实现 MyPromise 源码

要求：尽可能还原 Promise 中的每一个 API ，并通过注释的方式描述思路和原理。

答案请看 [MyPromise.js](./code/4-1/MyPromise.js)
测试代码 [test.js](./code/4-1/test.js)