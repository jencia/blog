# ECMAScript 新特性

## ECMAScript 概述

ECMAScript 也是一门脚本语言，一般缩写为 ES ，通常我们会把它看作为 JavaScript 的标准化规范。但实际上 JavaScript 其实是 ECMAScript 的扩展语言，因为 ECMAScript 中只是提供了最基本的语法，通俗来说就是约定了代码该如何编写。例如我们该如何定义变量和函数，或者怎样实现分支循环之类的语句。它只是停留在语言层面，并不能直接用来完成应用中的实际功能开发。而 JavaScript 实现了 ECMAScript 的语言标准，并在这基础之上做了一些扩展，使得我们可以在浏览器环境中操作 DOM 和 BOM，在 NodeJS 环境中可以做一些读写文件之类的操作。

总的来说在浏览器环境中 JavaScript 等于 ECMAScript 加上 web 所提供提供 API，也就是我们所说的 DOM 和 BOM。

![](https://jencia.github.io/images/blog/training-camp/notes/ECMAScript-1.png)

在 NodeJS 环境中，JavaScript 等于 ECMAScript 加上 NodeJS 所提供的 API，比如 fs、net 这样内置模块所提供的 API .

![](https://jencia.github.io/images/blog/training-camp/notes/ECMAScript-2.png)

所以在 JavaScript 的语言本身指的就是 ECMAScript。

随着这些年 Web 这种模式深入的发展，从 2015 年开始 ES 保持每年一个大版本的迭代。伴随着新版本的迭代，很多新特性陆续的出现。这就导致我们现如今 JavaScript 这门语言的本身也就变成越来越高级、越来越便捷，下图是截止 2019 各个版本的名称、版本号、发行时间。

![](https://jencia.github.io/images/blog/training-camp/notes/ECMAScript-3.png)

从 2015 过后 ECMAScript 就决定不再按版本号去命名，而是使用发行年份。由于这样的决定是在 ES2015 诞生的过程中产生的，当时就有很多人习惯了 ES6 这样的名称，所以对于 ES2015 就出现了有人称之为 ES6 的情况。 

## let 与块作用域

在 ES2015 之前，JS 变量的作用域分为全局作用域和函数作用域，在 ES2015 之后多了一种块级作用域。“块” 就是用花括号包起来的，例如：

```js
if (true) {
    // 这里面用花括号包起来的就是块
    var foo = 'xxx';
}
console.log(foo);   // 'xxx'
```

用 var 声明的变量是没有块级作用域的，在块里面定义的变量，外面去访问也能访问到。

```js
if (true) {
    // 这里面用花括号包起来的就是块
    var foo = 'xxx';
}
console.log(foo);   // 'xxx'
```

而用 ES2015 新出的 let 去定义变量就会在块里面才能访问到，let 定义的方式跟 var 一样，只是把关键字改掉，例如：

```js
if (true) {
    let foo = 'xxx';
    console.log(foo);   // 'xxx'
}
console.log(foo);   // Uncaught ReferenceError: foo is not defined
```

块外面想访问块里面的变量就会报变量未定义的错误，只有同属于同一个块作用域才能访问到。
常见的块级作用域的还有 for 循环，如果涉及到多重 for 循环，外面往往需要定义不同的变量名去叠加器，否则就会出问题，例如：

```js
for (var i = 0; i < 3; i++) {
    for (var i = 0; i < 3; i++) {
        console.log(i);
    }
}
// 0 1 2
```

我们把两层循环的累加器都定义为 i ，这是一个 3 * 3 的循环，应该是打印 9 次才对，结果只打印的 3 次。原因其实很明显，var 没有块级作用域，在这边就相当于全局环境。两层循环的 i 处于同一个环境下，就会出现后者会覆盖前者的情况，内层的 i 等于 3 的时候，外层的 i 也会是 3，3 < 3 不成立就结束循环，所以只打印 3 次。

解决方案只要把内层的 i 用 let 定义就好

```js
for (var i = 0; i < 3; i++) {
    for (let i = 0; i < 3; i++) {
        console.log(i);
    }
}
// 0 1 2 0 1 2 0 1 2
```

使用 let 定义后内层循环的 i 就处于块级作用域里，跟外层的 i 就独立开了，相当于两个变量了，就不会被覆盖，也就能按照预期的结构运行。不过即使这样可以，这种同名的命名方式也最好不要出现，这种会让人混乱，不利于后期理解代码。

与 for 相关的还有一个典型的 for 循环绑定事件的示例，下面用函数去模拟这种场景：

```js
var elements = [{}, {}, {}];
for (var i = 0; i < elements.length; i++) {
    elements[i].onClick = function () {
        console.log(i);
    }
}
elements[0].onClick();  // 3
elements[1].onClick();  // 3
elements[2].onClick();  // 3
```

这边期望的是点击第一个是打印 0 ，第二个打印 1 ，第三打印 2，结果跟预期的完全不同，都是打印 3 。其实这边的 i 是属于全局作用域的变量，事件回调里访问的是全局的 i ，这个 i 是一直在变化的。而触发这个事件的时候是在循环外面，这时候循环已经结束了， i 已经加到 3 了，所以打印出来的自然就是 3 。

这场景也是闭包的典型场景，我们通过建立闭包可以解决这个问题。

```js
var elements = [{}, {}, {}];
for (var i = 0; i < elements.length; i++) {
    elements[i].onClick = (function (i) {
        return function () {
            console.log(i);
        }
    })(i)
}
elements[0].onClick();  // 0
elements[1].onClick();  // 1
elements[2].onClick();  // 2
```

闭包其实就是利用函数作用域摆脱全局作用域的影响。现在有了块级作用域就不用那么麻烦的，可以直接把 var 改成 let 就好了。

```js
var elements = [{}, {}, {}];
for (let i = 0; i < elements.length; i++) {
    elements[i].onClick = function () {
        console.log(i);
    }
}
elements[0].onClick();  // 0
elements[1].onClick();  // 1
elements[2].onClick();  // 2
```

其实 let 内部实现也是一种闭包的机制，因为在触发事件的时候循环早就结束了，这个 i 也早就被销毁了，就是因为闭包机制，我们才能拿得到 i 的值。其实循环体内用的 i 不是括号里面的 i ，是有进行过重新定义，其实隐藏了一条语句，如下：

```js
var elements = [{}, {}, {}];
for (let i = 0; i < elements.length; i++) {
    // let i = i;
    elements[i].onClick = function () {
        console.log(i);
    }
}
```

这个 `let i = i` 只是个伪代码，JS 内部可能是用类似的办法将 i 重新在循环体内定义一次，然后将当前的值赋值过去。如果是 let 每次循环的循环体都是块作用域，数据都隔离开，而使用 var 就变成覆盖全局变量，数据都一样，这就是为什么使用 let 能解决这问题。

另外在 for 循环里还有一个特别之处，其实 for 循环拥有两层作用域，举个例子：

```js
for (let i = 0; i < 3; i++) {
    let i = 'foo';
    console.log(i);
}
// foo foo foo
```

这两个 i 看似会冲突，结果是能正常打印三个 foo 。这表明这两个 i 不会互相影响，也就是说它们是属于两个不同作用域的，我们把 for 循环拆解开就能看得比较清楚。

```js
let i = 0;

if (i < 3) {
   let i = 'foo';
    console.log(i); 
}
i++;

if (i < 3) {
   let i = 'foo';
    console.log(i); 
}
i++;

if (i < 3) {
   let i = 'foo';
    console.log(i); 
}
i++;
```

let 还有一点跟 var 不一样，var 会有变量提升的特性，例如：

```js
console.log(foo);   // undefined
var foo = 'xxx';
```

这边是先打印再定义，却能返回 undefined ，也就是说 foo 的定义被提升到顶部。这是 var 的一个特性，而 let 取消了这个特性

```js
console.log(foo);   // Uncaught ReferenceError: foo not defined
let foo = 'xxx';
```

## const

const 就是在 let 的基础上多了一个 “只读” 的特性，所谓的 “只读” 就是在变量声明之后就不允许再被修改，一旦修改了就会报错，例如：

```js
const name = 'aaa';

name = 'bbb';   // Uncaught TypeError: Assignment to constant variable.
```

不允许先定义后赋值：

```js
const name;
name = 'aaa';   // Uncaught SyntaxError: Missing initializer in const declaration
```

不过要注意的一点是这边的不允许修改指的是地址指向，如果你的值是对象类型，那属性值是允许修改的，例如：

```js
const obj = {};
obj.name = 'aaa';
```

这样写是完全没问题的，但如果是将整个对象赋值过去那就改变了地址指向，就会报错，例如：

```js
const obj = {};
obj = { name: 'aaa' }  // Uncaught TypeError: Assignment to constant variable.
```

最佳体验应该是：不使用 var、主用 const、配合 let

## 数组的扩展

### 数组的解构

快速提出数组中想要的值

```js
const arr = [100, 200, 300];

// 以往的方式
const a1 = arr[0];
const a2 = arr[1];
const a3 = arr[2];

// 解构的写法
const [a1, a2, a3] = arr;

// 只提取第三个
const [, , a3] = arr;

// 提取后续所有值
const [a1, ...rest] = arr;

// 提取到不存在的值会拿到 undefined
const [a1, a2, a3, a4, a5] = arr;

// 设置默认值
const [a1, a2 = '0'] = arr;
```

### 数组的展开

快速传出数组元素

```js
const arr = [100, 200, 300];

// 以前打印数组元素可能需要这样
console.log(arr[0], arr[1], arr[2]);

// 对于动态数组以上方法就行不通，我们可能需要这样做
console.log.apply(console, arr);

// 现在有了 ... 操作符就可以直接展开数组
console.log(...arr);

// 上面那中做法就相当于数组被展开变成 100, 200, 300 放进数组
console.log(100, 200, 300);

// 同样的原理我们可以展开后放在其他数组里，就达到拷贝或合并数组的效果
const otherArr = [0, ...arr];  // [0, 100, 200, 300]
```

## 对象的扩展

### 对象的解构

快速提取对象中想要的值

```js
const obj = { name: 'xxx', age: 22, };

// 根据属性名提取
const { name， age } = obj;

// 提取其他属性
const { name, ...rest } = obj;

// 提取不存在的属性会拿到 undefined
const { test } = obj;

// 设置默认值
const { name = 'test' } = obj;

// 属性重命名
const { name: busName } = obj;
const { name: boxName = 'box' } = obj;
```

### 对象字面量的增强

简化属性写法

```js
const name = 'tom'

// 以前的写法
const obj = {
    name: name,
    say: function () {}
}

// 现在可以这样简化
const obj = {
    name,           // 属性名和变量名一样的时候可以合在一起
    say() {},       // 函数可以省掉 ': function'
    say2: () => {}  // 箭头函数无法简化
}
```

属性名支持表达式

```js
const key = 'name';

const obj = {
    [key]: 'tom',           // 支持传入变量
    [1 + 2]: 'aa',          // 支持运算，计算结果作为 key
    [Math.random()]: 'bb'   // 支持执行函数，返回值作为 key
}
```

### 对象方法扩展

新加的方法主要是 Object.assets 和 Object.is

#### Object.assets

这方法是用于对象合并，也可用于对象拷贝。

```js
const obj1 = { a: 'a', b: 'b' };
const obj2 = { a: 'a2', c: 'c' };

// 将 obj2 合并进 obj1，原来有的属性后面覆盖前面的，原来没有的进行补充
Object.assign(obj1, obj2);  // { a: 'a2', b: 'b', c: 'c' }

// 第一个参数的原值会被改变，后续的参数不变
console.log(obj1);  // { a: 'a2', b: 'b', c: 'c' }
console.log(obj2);  // { a: 'a2', c: 'c' }

// 不想改变原值的话第一个参数传空对象
Object.assign({}, obj1, obj2);
console.log(obj1);  // { a: 'a', b: 'b' }

// 参数可以传无限多个，后面会覆盖前面的
const obj = Object.assign({}, { a: '1' }, { a: '2' }, { d: 'd' });
console.log(obj);   // { a: '2', b: 'b', d: 'd' }

// 这种方式常常用于设置默认值
function setData (data) {
    const actualData = Object.assign({
        name: '',
        age: 22
    }, data});

    console.log(actualData)  // { name: 'tom', age: 22 }
}
setData({ name: 'tom' })
```

对象合并除了用 Object.assign 还有一种方法，那就是使用 ... 运算符，类似数组的展开一样，将对象展开重新构建。

```js
const obj1 = { a: 'a', b: 'b' };
const obj2 = { a: 'a2', c: 'c' };

// 在一个空对象里展开 obj1 和 obj2 ，根据后面覆盖前面原则形成全新的对象
const obj = { ...obj1, ...obj2 };
console.log(obj);  // { a: 'a2', b: 'b', c: 'c' }

// 可在任意位置展开，在别的属性前面展开也可能会被覆盖
console.log({ ...obj1, a: '222' }); // { a: '222', b: 'b' }

// 在展开前可以做逻辑判断
const foo = {
    name: 'test',
    ...(true ? obj1 : obj2)
};
```

需要注意的一点是不管用 Object.assign 还是用 ... 都是属于浅拷贝，对象合并也是一种浅拷贝。

```js
const tom = {
    name: 'tom',
    age: 20,
    classInfo: {
        id: 'asd',
        grade: 1,
        number: 20
    }
}
const foo = { ...tom };

tom.age = 25;
tom.classInfo.number = 30;

console.log(foo.age);   // 20
console.log(foo.classInfo.number);  // 30
```

这边 foo 拷贝了 tom ，tom 改了值后，foo 第一层数据没变，但第二层数据却跟着变了。也就是说我们只拷贝了第一层，这就是浅拷贝。实际上这边只是改变了 tom 的地址指向，而 tom 里面的属性值地址指向并没有改变。要解决这问题就需要使用深拷贝，后续专门开一个专题讲解深拷贝。

#### Object.is

以前判断两个值是否相等可以用 == 和 === 来做判断，但有些情况即使用 === 也不能达到我们预期的结果，例如:

```js
-0 === +0   // true
NaN === NaN // false
```

-0 和 +0 本质来说都是 0，正常情况下是可以认为是相等的，但有些时候比如做一些数学算法的时候认为它们是不相等的。

NaN 都是代表非数字，非数字的情况有很多，代表无限种可能，所以认为是不相等的。但有些时候我们只是把它当成是一个特殊的值，从这个角度看这两个就应该是相等的。

针对这些情况就可以选择用 Object.is 去判断

```js
Object.is(-0, +1);      // false
Object.is(NaN, NaN);    // true
```

正常情况下还是优先使用 === 的方式。

## 字符串扩展

### 模板字符串

这是一种新的字符串定义语法，用来处理字符串连接问题。

```js
// 以前的方式，使用单引号或双引号
const str = 'hello es2015, this is a string';
const str = "hello es2015, this is a string";

// 现在多了反引号的方式
const str = `hello es2015, this is a string`;

// 可以插入变量
const name = 'es2015';
const str = `hello ${name}, this is a ${typeof name}`;

// 可以加入表达式
const str = `hello es${2000 + 15}`;     // hello es2015

// 转义符，${}这三个被转义其中一个都会视为普通字符串
const str = `hello \`es2015\`, \${name}`;   // hello `es2015`, ${name}

// 插值传入非字符串类型都会被转为字符串类型
const str = `hello ${{}} ${true}`;      // hello [object Object] true

// 支持换行，会保留所有空格和回车
const str = `===== 清单 =====
1. HTML
   2. CSS

3. JS

`;
// ===== 清单 =====↵1. HTML↵   2. CSS↵↵3. JS↵↵"
```

### 带标签的模板字符串

模板字符串还支持以下这种语法：

```js
tag`string`
```

tag是模板字符串的标签，其实就是一个方法名，用于自定义模板字符串的返回格式。

```js
const name = 'tom';
const gender = true;

/**
 * @param {string[]} strings 模板字符串里的静态数据
 * @param {string} string 第一个变量值
 * @param {string} boolean 第二个变量值，参数多少个就看有多少个变量
 * @return {string} 返回最终组合完成的字符串
 */
function myTagFn (strings, name, gender) {
    // strings: ['hey,', ' is a ', '.']
    // name:    'tom'
    // gender:  true
    const sex = gender ? 'man' : 'woman';

    return strings[0] + name + string[1] + sex + string[2];
}

const result = myTagFn`hey, ${name} is a ${gender}.`;

console.log(result);    // hey, tom is a man.
```

### 字符串扩展方法

增加了 startsWith、endsWith、includes 方法

```js
const message = 'Error: foo is not defined';

// 字符串是否是以 Error 为前缀
console.log(message.startsWith('Error')) // true 

// 字符串是否是以 . 为后缀
console.log(message.endsWith('.')) // true

// 字符串是否包含 foo 字符串
console.log(message.includes('foo')); // true
```

## 函数扩展

### 参数默认值

以前函数参数设置默认值需要判断参数有没有存在，如果有就使用传过来的值，如果没有就使用默认值。你可能会这样写：

```js
function fn (str) {
    const value = typeof str === 'undefined' ? 'default' : str;
    // 或者
    const value = value || 'default';

    console.log(value);
}
```

现在提供了一种参数默认值的设置方式

```js
// 这种方式是判断 str 是否是 undefined
function fn (str = 'default') {
    console.log(str);
}

fn('test'); // test
fn();       // default
```

### 剩余参数

有时候函数的参数个数是不固定的，是动态参数的。针对这种情况我们以前的做法是使用 arguments 对象获取，就像以下这样：

```js
function fn () {
    console.log(arguments);
}
fn(1, 2, 3, 4);
```

这样写其实不够直观，而且 arguments 是个伪数组。现在出了一种更合适的写法，可以通过 ... 来获取剩余参数

```js
function fn (...args) {
    console.log(args);  // [1, 2, 3, 4]
}
fn(1, 2, 3, 4);
```

有时候第一个参数是固定的，后续参数才是动态的，就可以这样：

```js
function fn (first, ...args) {
    console.log(args);  // [2, 3, 4]
}
fn(1, 2, 3, 4);
```

这种 ... 只能放在参数的最后，且最多只能有一个

### 箭头函数

函数定义的另外一种写法

```js
// 普通函数的写法
const inc = function (n) {
    return n + 1;
}

// 箭头函数的写法
const inc = (n) => {
    return n + 1;
}

// 箭头函数简化写法：
// 只有一个参数可以省略括号
// 直接返回数据的话可以省略掉大括号和 return
const inc = n => n + 1;

// 需要设置初始值的参数就不能省略括号
const inc = (n = 0) => n + 1;

// 返回值逻辑较复杂的话要包个括号
const inc = n => (n ? n + 1 : 1);

// 结合其他方法的简化
const arr = [6, 9, 12, 15];
arr.filter(v => v > 10);    // [12, 15]
```

箭头函数除了可以简写代码，还有一点跟普通函数不一样，就是它不会改变 this 的指向，例如：

```js
const person = {
    name: 'tom',
    say: function () {
        console.log(this.name); // 'tom'
    },
    say: () => {
        // 在这边 this 指向的应该是全局的 window
        console.log(this.name); // 'undefined'
    },
    sayHiSync: function () {
        setTimeout(function () {
            // 这边的 this 指向被改变了，就取不到值
            console.log(this.name); // 'undefined'
        })
        setTimeout(() => {
            // 在这边是处于 sayHiSync 的作用域下，所以 this 值跟 sayHiSync 一样指向 person
            console.log(this.name); // 'tome'
        })
    }
}
person.say();
```

## Proxy

代理对象，用来监视对象的读写过程。

Proxy 其实就是 Object.defineProperty 的强化版，我们先来看看以前的写法：

```js
var person = {};

Object.defineProperty(person, 'name', {
    get () {
        console.log('name 被访问');
        return this._name;  // 如果直接写 this.name 会陷入死循环
    },
    set (value) {
        console.log('name 被设置');
        this._name = value;
    }
})
Object.defineProperty(person, 'age', {
    get () {
        console.log('age 被访问');
        return this._age;
    },
    set (value) {
        console.log('age 被设置');
        this._age = value;
    }
})
```

Object.defineProperty 属于浸入式的方式设置，会改动到原来的对象结构，每个属性都要单独设置 Object.defineProperty ，而且需要引入额外的属性才能实现功能。而使用 Proxy 就会简化很多：

```js
var person = {};

var personProxy = new Proxy(person, {
    get (target, property) {
        console.log(`${property} 被访问`);
        return target[property];
    },
    set (target, property, value) {
        console.log(`${property} 被设置`);
        target[property] = value;
    }
})
```

Proxy 会返回一个新的对象，不会改动到原对象的对象结构，不过只是结构不会改，属性值是会跟着变的。Proxy 不管是监听什么属性都统一在同一个 set 和 get 里处理，减少了不少代码冗余。下列举了一个比较完整的例子：

```js
var person = {
    name: 'tom',
    age: 30
};
var personProxy = new Proxy(person, {
    get (target, property) {
        return property in target ? target[property] : 'default';
    },
    set (target, property, value) {
        if (property === 'age' && !Number.isInteger(value)) {
            throw new TypeError(`${value} is not an int`);
        }
        target[property] = value; 
    }
});

console.log(personProxy.name);  // 'tom'
console.log(personProxy.xx);    // 'default'
// 只是读取 person 的属性就没经过代理，就没做处理
console.log(person.xx);         // undefined

personProxy.age = 'xxx';        // Uncaught TypeError: xxx is not an int
personProxy.age = 10.5;         // Uncaught TypeError: 10.5 is not an int
personProxy.age = 10;

console.log(personProxy.age);   // 10
// 在代理里设置的值，原对象也会改变
console.log(person.age);        // 10
```

我们可以在 get 里判断是否存在该属性，不存在可以设置默认值，也可以在设置属性值的时候判断属性类型，从而做相关响应。当然我们也可以劫持属性值的设置，像数组里面的 push 方法就在 set 里面控制是否 push 成功。

在 Object.defineProperty 里只能监视对象的 set 和 get ，在 Proxy 中可以监视更多的操作，比如 delete 删除属性：

```js
var person = { name: 'tom' };
var personProxy = new Proxy(person, {
    deleteProperty (target, property) {
        console.log('delete', property);
        delete target[property];
    }
});

delete personProxy.name;    // delete name
console.log(person);        // {}
```

更多的操作监视就不演示了，支持的属性见下表

![](https://jencia.github.io/images/blog/training-camp/notes/ECMAScript-4.png)

## Reflect

封装了一系列对对象的底层操作。

Proxy 底层就是调用了 Reflect 提供的方法，例如：

```js
var obj = {};
var proxy = new Proxy(obj, {
    get (target, property) {
        return Reflect.get(target, property);
    }
    set (target, property, value) {
        Reflect.set(target, property, value)
    }
});
```

Proxy 的 get 和 set 默认就是调用了 Reflect 的 get 和 set 方法。实际开发的时候前面做一堆监听操作，最后再去调用 Reflect 的方法。

Reflect 的出现可能有些人觉得没必要，他拥有的方法，以前都有相应的方式可以实现，就显得很多余。其实仔细观察我们以前的写法你会发现操作方式各不一样：

```js
var obj = { name: 'tom' };

obj.name = 'yjc';               // 设置 name 属性值
console.log(obj.name);          // 获取 name 属性值
console.log('name' in obj);     // 判断 obj 里是否有 name 属性
console.log(Object.keys(obj));  // 获取所有属性名
console.log(delete obj.name);   // 删除 name 属性
```

这边对比下就能很明显的看到，同样是操作对象，写法却各不相同，5种操作4种写法。而 Reflect 提供了统一的对象操作 API：

```js
var obj = { name: 'tom' };

Reflect.set(obj, 'name', 'yjc');
console.log(Reflect.get(obj, 'name'));
console.log(Reflect.has(obj, 'name'));
console.log(Reflect.ownKeys(obj));
console.log(Reflect.deleteProperty(obj, 'name'));
```

## Promise

详情见 [01-01/Promise.md](../01-01/Promise.md)

## class 类

定义一个类，之前都是用 function 去模拟，例如：

```js
function Person (name) {
    this.name = name;
}
Person.prototype.say = function () {
    console.log(`hi, my name is ${this.name}`);
}
Person.create = function (name) {
    return new Person(name);
}

const person1 = new Person('person1');
const person2 = Person.create('person2');
person1.say();  // hi, my name is person1
person2.say();  // hi, my name is person2
```

之前那样属性名、方法、静态方法都比较分散 class 将这些类相关的东西都整合一起，对应的写法是这样的：

```js
class Person {
    // 构造器
    constructor (name) {
        // 原型属性
        this.name = name;
    }
    // 原型方法
    say () {
        console.log(`hi, my name is ${this.name}`);
    }
    // 静态方法
    static create (name) {
        return new Person(name);
    }
}

const person1 = new Person('person1');
const person2 = Person.create('person2');
person1.say();  // hi, my name is person1
person2.say();  // hi, my name is person2
```

class 还提供了类的继承，相对于以前用原型链实现简单很多，如下：

```js
// 继承 Person 类
class Student extends Person {
    constructor (name, number) {
        super(name);    // 调用父类的构造器
        this.number = number;
    }
    hello () {
        super.say();    // 调用父类的 say 方法
        console.log(`my school number is ${this.number}`);
    }
}

const student = new Student('tom', 10010);
student.hello();    // hi, my name is tom 8↵my school number is 10010
```

## Set

一种类似于数组的数据结构，但是成员的值都是唯一的，没有重复的值。

```js
const s1 = new Set();       // Set(0) {}

// 采用 .add 的方式加数据，支持链式调用
s1.add(4).add(2).add(5).add(3).add(4);

// Set 没有下标索引，需通过 .forEach 遍历所有元素
// Set 会自动去重，所以只打印 4 个值
s1.forEach(v => console.log(v));    // 4 2 5 3

// 也可以通过 for...of 遍历
for (const v of s1) {
    console.log(v);
}

console.log(s1.size);   // 成员总数
console.log(s1.has(2)); // 是否存在值为 2 的成员
s1.delete(4);           // 删除值为 4 的成员
console.log(s1);        // Set(3) { 2, 5, 3 }

s1.clear();             // 清除所有数据
console.log(s1);        // Set(0) {}

// 数组转化为 Set
const s2 = new Set([2, 3]);
// Set 转化为数组
const arr1 = Array.from(s2)
const arr2 = [...s2];

// 数组转为 Set 再转为数组可达到去除重复元素的效果
const arr3 = [1, 2, 2, 4, 1, 3];
const _arr3 = [...new Set(arr3)];
console.log(_arr3);     // [1, 2, 4, 3]
```

## Map

一种类似于对象的数据结构，只是对象的键只能是字符串或 Symbol ，而 Map 可以是任意类型。

```js
const obj = {};

obj[true] = 'value';
obj[123] = 'value';
obj[{ a: 1 }] = 'value';

// 在对象里所有的键都会被转化为字符串
console.log(Object.keys(obj));  // ['true', '123', '[object Object]']

// 随便传什么对象都可以拿得到值，甚至传字符串都能拿到
console.log(obj[{}]);       // 'value'
console.log(obj[{ a: 6 }]); // 'value'
console.log(obj['[object Object]']);    // 'value'
```

当遇到键要存非字符串类型数据的时候就该想到用 Map ，以下是 Map 的基本使用：

```js
const m = new Map();
const tom = { name: 'tom' };

m.set(tom, 90);

console.log(m);             // Map(1) {{ name: 'tome'} => 90}
console.log(m.get(tom));    // 90

m.forEach((value, key) => {
    console.log(value, key); // 90 { name: 'tom'}
});

// Map 在 for...of 里面遍历出来的元素是个数组，所以需要解构下
for (const [value, key] of m) {
    console.log(value, key);
}

console.log(m.has(tom));    // m 里面是否存在 key 为 tom 的成员
m.delete(tom);              // 删除 key 为 tom 的成员
m.clear();                  // 清除所有成员
console.log(tom);           // Map(0) {}
```

## Symbol

用于创建独一无二的值。

```js
// 每次创建的 Symbol 都不一样
console.log(Symbol() === Symbol()); // false

// 可传入参数作为描述文本，便于开发调试
console.log(Symbol('foo')); // Symbol(foo)
console.log(Symbol('bar')); // Symbol(bar)
console.log(Symbol('baz')); // Symbol(baz)

// 常用于创建独一无二的属性名
const obj = {
    [Symbol()]: 123
}
console.log(obj);           // { Symbol(): 123 }
console.log(obj[Symbol()]); // undefined

// 可模拟实现对象的私有成员
const name = Symbol();
const person = {
    [name]: 'tom',
    say () {
        console.log(`my name is ${this[name]}.`);
    }
}
person.say();   // 'my name is tom'
```

Symbol 还提供了几个方法和几个值得关注的点

```js
// Symbol 传入的参数只是作为描述文本，即使参数相同生成出来的值还是不同
console.log(Symbol('foo') === Symbol('foo'));   // false

// Symbol 提供的一个 .for 用于将这个 Symbol 的结果存放在全局上
// .for 会先去查找全局看有没有相同描述的，如果没有就创建一个，有就直接用
const s1 = Symbol.for('foo');
const s2 = Symbol.for('foo');
// 创建 s2 的时候有找到对应的 Symbol，就直接引用，所以结果是相等的
console.log(s1 === s2); // true

// 需要注意的是，参数不管传入什么都会转化为字符串，true 会转化为 'true'
console.log(Symbol.for(true) === Symbol.for('true'));   // true

// Symbol 提供了一些内置值
console.log(Symbol.iterator)     // Symbol(Symbol.iterator)
console.log(Symbol.hasInstance)  // Symbol(Symbol.hasInstance)

// 比如你可以通过内置 Symbol 改变对象的 toString 返回结果
const obj = {
    [Symbol.toStringTag]: 'XX'
}
console.log(obj.toString());    // [object XX]

// 还有一点要注意的是用 Symbol 定义的属性不会被遍历出来
const obj = {
    [Symbol()]: 'symbol value',
    foo: 'normal value'
};
for (const key in obj) {
    console.log(key);               // 只打印 foo
}
console.log(Object.keys(obj));      // ['foo']
console.log(JSON.stringify(obj));   // {"foo":"normal value"}
// 只能通过这种专门获取 Symbol 的方法才能找到 Symbol
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol()]
```

## 迭代器

迭代器（Iterator）是一种可迭代接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作。迭代器主要是提供给 for...of 使用的。

数组、Set、Map 等已内部实现了可迭代接口，例如：

```js
const arr = [5, 8, 12];
// 每个实现了可迭代接口的对象都可以通过 Symbol.iterator 拿到迭代器对象
const iterator = arr[Symbol.iterator]();

// 每个迭代器都有一个 next 方法，方法的执行都返回同样数据格式的对象
// value    当前指向的值
// done     是否已迭代完成
iterator.next();    // { value: 5, done: false }
iterator.next();    // { value: 8, done: false }
iterator.next();    // { value: 12, done: false }
iterator.next();    // { value: undefined, done: true }

// 使用 for...of 其实就是不断的去调用 next 方法
for (const value of arr) {
    console.log(value)
}

// 我们可以采用 do...while 去模拟，大概就是下列这样
do {
    const { value, done } = iterator.next();
    if (done) {
        break;
    }
    console.log(value);
} while(true);
```

一个对象只要实现了可迭代接口，任何数据结构都可以使用 for...of 遍历数据。从上面代码分析，实现可迭代接口需要满足两个条件：

1. 拥有 Symbol.iterator 属性，且属性值是一个函数，函数返回值是一个对象
2. 这个对象拥有 next 方法，且 next 返回拥有 value 和 done 属性的对象

以下是根据这两个条件模拟实现的代码：

```js
const obj = {
	store: ['foo', 'bar', 'baz'],
	[Symbol.iterator]() {
		let i = 0;
		
		return {
			next: () => ({
				value: this.store[i],
				done: i++ >= this.store.length
			})
		};
    }
}
for (const value of obj) {
	console.log(value);     // foo bar baz
}
```

## 生成器

生成器（Generator）主要用于避免异步编程中回调嵌套过深的问题，这边只做基本的用法讲解，详细的内容放在异步编程专题的 [01-01/Generator.md](../01-01/Generator) 去讲解。

```js
// Generator 其实就是在普通函数的基础上，在函数名左边加一个星号（ * ）
function * fn() {
    console.log(1111);
    // Generator 通常配合 yield 关键字一起使用
    yield 100;
    console.log(2222);
    yield 100;
    console.log(3333);
    return 100;
}

// 函数调用后不会马上执行，而返回值是一个 generator 实例
// generator 实现了迭代器，它也有 .next 方法
const generator = fn();

// 调用了 next 才开始执行函数，一旦遇到 yield 或 return 函数就会停下来
// 跟在 yield 或 return 后面的值将作为 next 的 value 值返回
console.log(generator.next());  // 1111 { value: 100, done: false }

console.log(generator.next());  // 2222 { value: 200, done: false }
console.log(generator.next());  // 3333 { value: 300, done: false }
console.log(generator.next());  // { value: undefined, done: true }

```

## ES Modules

这块将在后续的模块化开发专题详细讲解

## ES2016 概述

ES2016 只加了两块内容，Array.prototype.includes 和指数运算符。

### Array.prototype.includes

以前我们判断数组中是否存在某个元素，我们通常使用 indexOf 做判断，例如：

```js
const arr = ['foo', 1, NaN, false];

// 如果找到就返回元素对应的下标，如果找不到就返回 -1 ，通过判断是否是 -1 来得知是否存在
console.log(arr.indexOf('foo'));    // 0
console.log(arr.indexOf('baz'));    // -1

// 但如果遇到数组元素是 NaN 的，就没法判断
console.log(arr.indexOf(NaN));      // -1

// 使用 includes 可直接返回布尔值，且可以判断是否存在 NaN
console.log(arr.includes('foo'));   // true
console.log(arr.includes(NaN));     // true
```

### 指数运算符

我们以前要进行指数运算的话通常是使用 Math.pow 方法实现，例如：

```js
console.log(Math.pow(2, 10));   // 1024
```

现在提供更便捷的指数运算符，使用两个星号（ * ）

```js
console.log(2 ** 10);   // 1024
```

## ES2017 概述

### Object.values

类似于 Object.keys ，只是 Object.keys 是将所有的键组成数组，而 Object.values 是将所有的值组成数组，例如：

```js
const obj = {
    foo: 'value1',
    bar: 'value2'
}

console.log(Object.values(obj));    // ['value1', 'value2']
```

### Object.entries

将对象的键值对以数组的形式组织，例如：

```js
const obj = {
    foo: 'value1',
    bar: 'value2'
}

console.log(Object.entries(obj));   // [['foo', 'value1'], ['bar', 'value2']]

// 这就使得我们可以用 for...of 遍历对象
for (const [key, value] of Object.entries(obj)) {
    console.log(key, value);        // foo value1 ↵ bar value2
}

// 这也就使得对象可以直接转化为 Map
console.log(new Map(Object.entries(obj)))   // Map(2) {"foo" => "value1", "bar" => "value2"}
```

### Object.getOwnPropertyDescriptors

主要是解决对象的 setter 和 getter 无法拷贝的问题

```js
const p1 = {
    firstName: 'yang',
    lastName: 'jc',
    get fullName () {
        return `${this.firstName} ${this.lastName}`;
    }
}

console.log(p1.fullName);   // 'yang jc'

// 这边把 p1 拷贝到 p2
const p2 = Object.assign({}, p1);
p2.lastName = 'xxx'

console.log(p2.fullName);   // 'yang jc'
```

使用 Object.assets 做拷贝实际效果跟预期的不一样。这时候改了 p2.lastName ，按理说 p2.fullName 应该重新计算变成 yang xxx 才对，结果发现用 Object.assign 做拷贝只是把 fullName 当成普通的属性处理。

getter 是属于对象描述里面的内容，所以需要连对象描述一起拷贝，而要拷贝对象描述就需要获取 p1 的对象描述，所以才出现了 Object.getOwnPropertyDescriptors 方法。

```js
const desc = Object.getOwnPropertyDescriptors(p1);
// 重新构建一个对象，采用 p1 的对象描述去构建，也能达到对象拷贝的效果
const p3 = Object.defineProperties({}, desc);

p3.lastName = 'xxx'
console.log(p3.fullName);   // yang xxx;
```

### padStart/padEnd

padStart 和 padEnd 都是字符串原型上的方法，都是用来填充补位用的，例如：

```js
'5'.padStart(3, '0');   // '005'
'25'.padStart(3, '0');  // '025'

'html'.padEnd(12, '-');         // html--------
'css'.padEnd(12, '-');          // css---------
'javascript'.padEnd(12, '-');   // javascript--
```

### 函数尾逗号

在 ES2017 开始，函数参数允许添加尾逗号，尾逗号就是参数最后一位留下一个逗号，不管是函数的调用还是函数的定义都允许出现尾逗号，例如：

```js
function fn (a, b, ) {
    console.log(a, b, )
}

fn(4, 2, )
```

### Async/Await

这一块放在异步编程专题里面讲，详情想看 [01-01/AsyncAwait.md](../01-01/AsyncAwait.md)