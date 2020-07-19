# TypeScript 语言

## JS 类型系统问题

在讲 JS 问题之前，我们先来了解什么是强类型与弱类型，什么是静态类型与动态类型，再去分析 JS 类型系统特征和存在的问题。

### 强类型和弱类型

强类型和弱类型是从类型安全的角度做分类。JS 是一种弱类型语言，至于强弱之分有什么差别呢？

强类型是从语言层面就限制了函数的实参类型必须与形参类型相同，举个 java 的例子：

```java
class Main {
    static void foo (int num) {
        System.out.println(num);
    }
    public static void main (string[] args) {
        Main.foo(100); // ok

        // 函数定义的参数是 int 类型，如果传入的是其他类型在编译阶段就报错
        Main.foo("100"); // error "100" is a string

        // 这时候我们就知道，我们需要将字符串转化为 int 类型
        Main.foo(Integer.parseInt("100")); // ok
    }
}
```

而弱类型不会限制实参的类型。

```js
function foo (num) {
    console.log(num);
}

foo(100); // ok
foo('100'); // ok
foo(parseInt('100')); // ok
```

对于强类型和弱类型的划分界限，比较认同的说法是，强类型语言中不允许任意的隐式类型转换，而弱类型语言则允许任意的数据隐式类型转换。

隐式类型转换就是如果你传入的类型不是想要的类型，系统就会自动帮你转换类型，比如：

```js
'100' - 50;         // 最终结果是 50 ，'100' 会被自动转换为 100 进行运算
Math.floor(true);   // 最终结果是 1，函数内部 true 被自动转化为 1 进行处理
```

如果是强类型，以上的例子在编译阶段就会报错，不会返回结果。

### 静态类型与动态类型

静态类型和动态类型是从类型检查的角度做分类。

静态类型一旦变量声明之后，它的类型就是明确的，不允许再修改。

动态类型在运行阶段才能知道它的类型，而且变量类型可以随时发生变化。例如

```js
// 变量声明都是用 var ，不知道是什么类型
// 只有当赋值 100 ，才知道 foo 是 number 类型
var foo = 100;

// 当赋值了 'bar' ，变量类型又变成 string
foo = 'bar';

console.log(foo);
```

所以在动态类型语言中的变量是没有类型的，而变量中存放的值是有类型的。

所以 JS 是一个动态类型。 

### JS 类型系统特征

JS 是一种弱类型且动态类型的语言，所以 JS 是一门灵活多变的语言。不过灵活的背后丢失的是类型系统的可靠性，这就导致我们每次引用一个变量时都要担心这变量是不是我们想要的类型。

为什么 JS 不设计成强类型且静态类型的语言呢？

- 早期 JS 的应用简单，代码量很少，设计成强类型的反而觉得麻烦没有必要；
- JS 是个脚本语言，它不需要编译就能直接运行，所以它没有编译环节。而类型检查需要在编译环节检测的，所以根本做不来类型检查；

基于上述的原因，JS 选择成为更加灵活多变的弱类型/动态类型语言。

现如今 JS 运用越来越广，遍地都有大规模的 JS 应用，现在这种弱类型/动态类型语言已经不再不适合了。

### 弱类型的问题

这边举三个例子来说明这问题。

#### 问题1

```js
const obj = {};

obj.foo();
```

以上代码很明显的能看出来 obj 并不存在 foo 方法，而我们去调用它，这在语法层面上是没问题的。只有当我们运行了这段代码才抛出异常，也就是说在 JS 这种弱类型的语言里只有在运行时才能检测到类型异常。以上代码是在运行时就立即执行，如果我们是通过触发某个事件才去执行的呢？例如：

```js
const obj = {};

setTimeout(() => {
    obj.foo();
}, 100000);
```

我们这边用 setTimeout 来模拟，这种在程序刚才运行的时候没什么问题，当代码执行到 `obj.foo()` 的时候才会抛出异常。也就是说你如果没有测试到这段代码，那这样这样一个隐患就留在代码里。如果是强类型语言，这种在语法层面就已经报错了，根本不用等到程序运行到这段代码才知道。

#### 问题二

```js
function sum (a, b) {
    return a + b;
}

console.log(sum(100, 100));     // 200
console.log(sum(100, '100'));   // 100100
```

这函数原本是想做一个求和运算的函数，预期的效果是两个数值相加，可如果你传入字符串，这在语法层面是没问题的，字符串和数字也能相加，但实际返回的结果跟预期的不一样，这就是一个很典型的类型不确定导致函数的功能有可能发生变化。

#### 问题三

```js
const obj = {};

obj[true] = 100;
console.log(obj['true'])；  // 100
```

obj 设置值的时候属性名传入一个 true ，实际内部会有个隐式转化，最终变成 'true' ，所以我们使用 obj['true'] 是能访问到的。这种赋值跟取值用的属性名不一样，看着就很奇怪，不了解这特性的人用的时候就会让人感到很疑惑。

对象属性名只能支持字符串和 Symbol ，传入其他类型应该是不允许的，如果是使用强类型，这种在语法层面上就会报错。如果传入的都是正确的类型，使用者就会很明确的知道我要用哪个属性名去取值。

### 强类型的优势

#### 错误更早暴露

这点在 “弱类型的问题” 小节已经能体现出来，类型导致的问题在语法层面上就会报错，根本不用等到运行时才知道，所以错误能够更早的发现。

#### 代码更智能，编码更准确

简单的说就是编译器没有代码提示，那种有多痛苦就不用我说了，举个例子:

```js
function render (element) {
    element.className = 'container';
    element.innerHtml = 'hello world';
}
```

在方法里传入 element 参数，如果 element 有指定数据类型，编译器就能识别这个类型，列出这个参数所拥有的属性和方法。在编码过程中我写 `element.` 然后编译器就会给出智能提示，就像下图这样：

![](https://jencia.github.io/images/blog/training-camp/notes/TypeScript-1.gif)

可我上面写的代码是弱类型，并没有这功能，都是手写的，还写错了有没有发现。有了代码提示能够加快我们的编码速度，更能让编码更准确。

#### 重构更牢靠

在项目开发过程中，可能会因为开发周期比较赶，编写的代码比较随意，比如你可能出现类似这样的代码：

```js
const util = {
    aaa: () => {
        console.log('util func');
    }
}
```

有一个方法名称当时命名的比较随意，现在想改掉。可这时候你全局搜索下你发现有太多地方用到这个方法了，这时候你贸然改掉可能会引发一些 bug 。有时候你没法保证每个地方都改掉，一旦漏改了一个你也不知道，在弱类型里面只有在运行时才能知道是否有错，我们又没有写单元测试，不能保证测试方案能覆盖所有情况。

而如果是强类型的话，你这边改了方法名称，其他有用到这方法的地方在语法层面就会报错，你就可以根据报错的地方逐一改正。

#### 减少不必要的类型判断

在 JS 里面封装方法我们往往为了保证类型的正确性，需要做一堆关于参数的类型检查代码，例如：

```js
function sum (a, b) {
    if (typeof a !== 'number' || typeof b !== 'number) {
        throw new TypeError('arguments must be a number');
    }
    return a + b;
}
```

我们去检测两个参数是否都是 number ，如果不是就抛异常。如果业务复杂一点，这类型的判断就更多了。

在强类型语言里面，不符合的类型根本就传不进来，所以也不需要做这一堆操作。

## Flow

这是一个 JavaScript 的类型检查器。

### 快速上手

先找一个文件夹，作为项目工程目录，后续编学 flow 都在这个文件夹下建文件。

1. 初始化项目工程，这边使用 [yarn](https://classic.yarnpkg.com/zh-Hans/docs/install#windows-stable) 。

```sh
$ yarn init --yes
```

这时候在你的项目工程下就有一个 package.json 文件

2. 安装 flow-bin

```sh
$ yarn add flow-bin --dev
```

3. 初始化 flow

```sh
$ yarn flow init
```

这时候项目工程下会有个 `.flowconfig` 文件，到这里 flow 的环境就搭建完了。

4. 编码

```ts
// @flow

function sum (a: number, b: number) {
    return a + b
}

sum(100, 100)
sum('100', '100')
```

需要 flow 类型检查的文件就在文件顶部加上 `// @flow` 。

flow 增加了类型注解的写法，也就是在参数名后面跟上冒号（ : ），然后紧跟上类型名称，也就是这边的 `a: number` 写法。不过这种写法编译器可能会报错，因为 JS 不支持这种语法，我们需要把编译器的语法检验禁掉，在 VSCode 里面进入首选项设置界面，搜索 “JavaScript validate”，然后把 “Enable/disable Javascript validation” 的打钩去掉，如图所示：

![](https://jencia.github.io/images/blog/training-camp/notes/TypeScript-2.png)

这样编译器就不会报错了。

5. 校验

```sh
$ yarn flow
```

执行完命令行后，如果检测到类型错误就会显示出详细的错误信息，还有对应的文件跟代码行数，我们就可以根据上面的错误信息改正代码的错误。

### 编译移除注解

我们代码上加 `:number` 这种类型注解后实际浏览器运行时不支持的，我们只是在编译的时候为了类型检测而添加的，而运行环境是需要移除掉这些类型注解才能运行的。当然手动去删除不太现实，这边提供了两种方式自动移除注解。

#### flow-remove-types

这是 flow 官方出的一个命令行工具，专门用来移除注解。

1. 安装

```sh
$ yarn add flow-remove-types --dev
```

2. 使用

```sh
$ yarn flow-remove-types . -d dist
```

我们的代码放在当前目录，所以路径使用 "."，这段命令的意思就是讲当前路径下的文件全部移除注解，并把移除会的代码文件放在 dist 目录下。

我们就能在 dist 里找到同样文件名的文件被去掉了注解。

不过正常我们的源代码应该放在 src 目录，这样就能避免有些 node_modules 里的第三方模块受影响。

那命令行就应该改成这样：

```sh
$ yarn flow-remove-types src -d dist
```

#### babel

说到编译，当下最流行的就是 babel 了，babel 配合 preset-flow 也能完成移除注解的功能。babel 的使用需要以下几个流程：

1. 安装

```sh
$ yarn add @babel/core @babel/cli @babel/preset-flow --dev
```

- @babel/core 是 babel 的核心库
- @babel/cli 提供了一些命令行工具，让我们能够直接在命令行使用 babel 编译
- @babel/preset-flow 里面包含了移除注解的插件

2. 添加配置文件

在项目根目录下创建 .babelrc 文件

```json
{
    "presets": ["@babel/preset-flow"]
}
```

在配置文件里指定要使用的插件

3. 使用

```sh
$ yarn babel src -d dist
```

最终的效果跟 flow-remove-types 一样，只是转化后的代码更优，没有多余的空格。

### 开发工具插件

开发工具插件就是一旦类型不正确，编辑器就会报错，不用再执行命令行去检测才知道有错。

VSCode 插件 “Flow Language Support”

### 类型推断

flow 具有类型推断的特性，例如：

```js
function square (n) {
    return n * n;
}

square('10')
```

这边我们没有指定类型，这在语法层面应该没问题的，但是 flow 会监测到你这边是做乘法运算，而字符串跟字符串是不能相乘的，这边 flow 自动推断为这边的 n 应该是 number 类型，所以也会报错，正如下图所示：

![](https://jencia.github.io/images/blog/training-camp/notes/TypeScript-3.png)

不要觉得 flow 有这样特性你就懒得写类型注解了，最好是自己添加类型注解，这样能让代码具有更好的可读性。

### 类型注解

```ts
function square (n: number): number {
    return n * n;
}

let num: number = 100

num = 'string'  // error

function foo(): void {
    // 没返回值的函数
}
```

### 原始类型

```ts
const a: string = 'xxx'

const b1: number = 123
const b2: number = NaN
const b3: number = Infinity

const c: boolean = true
const d: null = null
const e: void = undefined
const f: Symbol = Symbol()
```

### 数组类型

```ts
const arr1: Array<number> = [1, 4, 5];
const arr2: number[] = [1, 4, 5];
const arr3: [string, number] = ['str', 100];
```

### 对象类型

```ts
const obj1: { foo: string, bar: number} = { foo: 'str', bar: 100 }

// 可选属性
const obj2: { foo?: string, bar: number} = { bar: 100 }

// 动态属性
const obj3: { [string]: string } = {}
obj3.key1 = 'value1';
obj3.key2 = 'value2';
```

### 函数类型

```ts
function foo (callback: (string, number) => void) {
    callback('string', 100)
}

foo(function (str, n) {
    // str => string
    // n => number
})
```

### 特殊类型

```ts
const a: 'foo' = 'foo'

const type: 'success' | 'warning' | 'danger' = 'success'

type stringOrNumber = string | number

const b1: stringOrNumber = 100
const b2: stringOrNumber = 'xxx'

const gender: ?number = undefined
const gender2: number | null | void = undefined
```

### Mixed & Any

```ts
// mixed 任意类型
function passMixed (value: mixed) {
    // mixed 虽然是任意类型，但也属于强类型，
    // 需要先判断是否是字符串才能使用字符串的方法
    if (typeof value === 'string') {
        value.substr(1)
    }
    // 这边也是要保证 value 是数字类型才能相乘
    if (typeof value === 'number') {
        value * value
    }
}
passMixed('string')
passMixed(100)

// any 任意类型
function passAny (value: any) {
    // any 属于弱类型，跟传统 JS 没什么区别
    value.substr(1)
    value * value
}
passAny('string')
passAny(100)
```

### 运行环境 API

使用了运行环境（比如浏览器）的 API 返回的数据不属于基本数据类型里面的，写类型注解的时候就需要使用运行环境提供给我们的类型，例如：

```ts
const element: HTMLElement | null = document.getElementById('app');
```

这边查找 DOM 元素，如果找不到就是 null，如果找到了那就是 DOM 元素，DOM 元素都继承于 HTMLElement ，所以我们直接使用 HTMLElement，不过有时候就需要精确的指定某一个类型，这时候就需要查找下有哪些类型可用。下列列举了几个类型查找的网址：

- https://www.saltycrane.com/cheat-sheets/flow-type/latest/
- https://github.com/facebook/flow/blob/master/lib/core.js
- https://github.com/facebook/flow/blob/master/lib/dom.js
- https://github.com/facebook/flow/blob/master/lib/bom.js
- https://github.com/facebook/flow/blob/master/lib/cssom.js
- https://github.com/facebook/flow/blob/master/lib/node.js

## TypeScript

TypeScript（简称 ts ）是 JavaScript 的超集，可以理解为

TypeScript = JavaScript + 类型系统 + ES6+新特性

最终会编译成浏览器可以访问的 JS 代码。

![](https://jencia.github.io/images/blog/training-camp/notes/TypeScript-4.png)

### 快速上手

先找一个文件夹，作为项目工程目录，后续编学 flow 都在这个文件夹下建文件。

1. 初始化项目工程。

```sh
$ yarn init --yes
```

这时候在你的项目工程下就有一个 package.json 文件。

2. 安装 typescript

```sh
$ yarn add typescript --dev
```

3. 编码

比如我创建一个 demo1.ts 文件，注意这边是 ts 后缀的。

```ts
const hello = (name: string) => {
    console.log(`Hello, ${name}`);
}

hello('TypeScript');    // Hello, TypeScript
```

4. 编译

```sh
$ yarn tsc demo1.ts
```

这时候 demo1.ts 旁边多了一个 demo1.js 文件，这就是编译后的文件，它会将 ts 文件类型注解代码移除，并转化成 es3 代码。

### 配置文件

tsc 提供了一个快速生成配置文件的命令：

```sh
$ yarn tsc --init
```

这时候项目工程下会生成一个 tsconfig.json 文件，这就是 ts 的配置文件。这个配置文件是作用于整个项目工程的，下列简单介绍下几项配置。

```json
{
    /* 编译配置 */
    "compilerOptions": {
        "target": "es5",        /* 编译成 es5 代码，默认 es3 */
        "module": "commonjs",   /* 以 commonjs 作为模块化标准编译 */
        "sourceMap": true,      /* 生成 sourceMap 文件 */
        "outDir": "dist",       /* 导出后存放的地方 */
        "rootDir": "src",       /* 源码存放的地方 */
        "strict": true,         /* 开启严格检查 */
    }
}
```

如果像上一节那样指定文件编译就不会走配置文件，要使用配置文件的话，命令行代码就要改成这样：

```sh
$ yarn tsc
```

如果想显示中文的错误信息，可以这样写:

```sh
$ yarn tsc --locale zh-CN
```

在 VSCode 设置中文的话可以在设置里面搜索 “typescript locale” 就能找到。

更多的配置项后续再补充。

### 原始类型

```ts
const a: string = 'foobar';
const b: number = 100 // NaN Infinity
const c: boolean = true // false

// 非严格模式下 string、number、boolean 可以为空
const d: string = null

// 非严格模式可以为 null
const e: void = undefined

const f: null = null
const g: undefined = undefined

const h: symbol = Symbol()
```

如果使用上一节的配置，那这边的 Symbol() 就会报错。原因是 Symbol 是 ES2015 才出的，而我们配置文件的 target 配的是 es5 ，es5 还没有 Symbol 。

在 TypeScript 编译中会有一个标准库，里面定义了一系列类型定义，也可以理解成一个类型集。配置文件如果没有指定标准库，默认是使用 target 的标准库，也就是这边的 es5 所拥有的类型集。es5 还没有 Symbol ，自然也就没有对应的类型定义。

要解决这问题，其实只要配置指定标准库就行，标准库对应的配置项是 lib ，最终长这样：

```json
{
    /* 编译配置 */
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "lib": ["ES2017", "DOM"],
        "sourceMap": true,
        "outDir": "dist",
        "rootDir": "src",
        "strict": true
    }
}
```

标准库除了要加 ES2015 ，还有加上 DOM ，这边的 DOM 其实还包含 BOM 的库，不指定这个标准库的话，是找不到 DOM 和 BOM 相关 API 的，连 console 都报错。

### Object 类型

```ts
const foo1: object = function () {}
const foo2: object = {}
const foo3: object = []

const foo4: object = 123    // error

const obj: { foo: number, bar: string } = { foo: 123, bar: 'str' }

```

### 数组类型

```ts
const arr1: Array<number> = [1, 2, 3]
const arr2: number[] = [1, 2, 3]

function sum (...args: number[]) {
    return args.reduce((prev, current) => prev + current, 0)
}

sum(1, 2, 3);
```

### 元素类型

```ts
const tuple: [number, string] = [18, 'yjc']
const [age, name] = tuple;

Object.entries({
    foo: 123,
    bar: 345
})
```

### 枚举类型

```ts
enum PostStatus {
    Draft = 'xx',       // 可传字符串
    Unpublished = 3,    // 可传数字

    // 可不传，不传会根据上一个值加一；
    // 如果上一个不是 number 类型，就报错；
    // 如果是第一位，那就是 0
    Published           // 4
} 

const post = {
    title: 'Hello TypeScript',
    content: 'TypeScript is a typed superset of JavaScript.',
    status: PostStatus.Published
}
```

使用枚举最终生成的代码会转化为一个对象，这目的是让我们能够用索引访问枚举的值。

```ts
PostStatus[0]   // 'xx'
PostStatus[1]   // 3
```

如果确定代码不会采用这种方式访问枚举，那就可以采用常量枚举：

```ts
const enum PostStatus {
    Draft = 'xx',
    Unpublished = 3,
    Published
} 
```

只要在 enum 前面加上 const 就是常量枚举，常量枚举不会编译成对象，而是将使用到枚举的地方替换成值

### 函数类型

```ts
function func1 (a: number, b: number): string {
    return 'func1'
}
func1(100, 200) // ok
// 固定参数个数
func1(100) // error
func1(100, 200, 300) // error

// ?: 表示可选参数
function func2 (a: number, b?: number): string {
    return 'func2'
}
func2(100)

// 设置了默认值也被认为是可选参数
function func3 (a: number, b: number = 200): string {
    return 'func3'
}
func3(100)

// 使用了 ... 就可传任意多个参数
function func4 (a: number, b: number, ...rest: number[]): string {
    return 'func4'
}
func4(1, 2, 3, 4, 5, 6)

// 函数也可作为参数，函数类型注解用 箭头函数写法
function foo (callback: (str: string, n:number) => string) {
    callback('string', 100)
}
foo(v => {})  // error
foo((a, b, c) => 'xx') // error
foo((str: string, n: string) => str + n) // error
foo((str: string, n: number) => str) // ok
```

### 任意类型

```ts
// any 任意类型，跟以往 JS 的使用一样，是种弱类型/动态类型
let foo: any = 'str'
foo = 100
foo = true
```

### 隐式类型推断

```ts
// 定义变量的时候 ts 会做隐式类型推断
// 定义变量的时候有赋值，这时候就以这个值为变量类型
let foo = 18
foo = 'str' // error

// 如果定义变量的时候没赋值，那就是 any 类型
let bar
bar = 100  // ok
bar = 'xxx' // ok
```

### 类型断言

```ts
const nums = [110, 120, 119, 112]

// 这时候 res 被 ts 推断为 number | undefined
const res = nums.find(i => i > 0)

// 类型断言的两种方式告诉 ts 这边返回的值一定是 number
const num1 = res as number
const num2 = <number>res   // 在 jsx 中不能用 
```

类型断言只是告诉 TypeScript 我这块的类型是很确定的，让 ts 不会报类型错误。这跟类型转换不一样，类型转换是运行时的，值会发生改变的。

以上类型断言的写法也可以连在一起写：

```ts
const res = nums.find(i => i > 0) as number
```

可能有些人会觉得这样写，好像也可以把 number 放在前面

```ts
const res: number = nums.find(i => i > 0)
```

这种写法是会报错的，这种属于类型注解，其实这两种差很多，这边的断言是把 `number | undefined` 转为 `number` ，这样就是 res 拿到了一个 number 数据。

而如果改成类型注解，那就是 `number = number |
 undefined`，等号左右类型不匹配自然报错。

注意这边的值是 number 或 undefined ，所以断言只能从这两种之中选一个，不能写其他类型的。

### 接口

基本使用

```ts
interface Post {
    title: string
    content: string
    subtitle?: string           // 可选
    readonly summary: string    // 只读
}

function printPost (post: Post) {
    console.log(post.title)
    console.log(post.content)
}

const hello: Post = {
    title: 'Hello TypeScript',
    content: 'A javascript superset',
    summary: 'A javascript',
}

hello.summary = 'xxx'   // error
printPost(hello)
```

动态属性对象

```ts
interface Cache {
    [prop: string]: string
}
const cache: Cache = {};

cache.foo = 'value1'
cache.bar = 'value2'
```

### 类

```ts
class Person {
    public name: string     // 修饰符默认 public
    // name: string = 'init name'   // 可设置初始值
    private age: number
    protected readonly gender: boolean  // 只读

    constructor (name: string, age: number) {
        this.name = name
        this.age = age
        this.gender = true
    }

    sayHi (msg: string): void {
        console.log(`I am ${this.name}, ${msg}`)
        console.log(this.age)
    }
}

class Student extends Person {
    private constructor (name: string, age: number) {
        super(name, age)
        console.log(this.age)       // error
        console.log(this.gender)    // ok
    }

    static create (name: string, age: number) {
        return new Student(name, age);
    }
}

const tom = new Person('tom', 18);
console.log(tom.name)   // ok
console.log(tom.age)    // error
console.log(tom.gender) // error

const jack1 = new Student('jack', 19);      // error
const jack2 = Student.create('jack', 19);   // ok
```

修饰符：

- public 默认值，都可以访问
- protected 实例无法访问，子类可以访问
- private 实例无法访问，子类也不能访问

有几天需要注意的：

1. 所有属性都必要事先进行类型定义，this 无法访问未定义的属性。
2. 类的所有属性都必须初始化，要么设置默认值，要么在构造函数内赋值。
3. 构造函数被标记为 private 或 protected 后就无法通过 new 进行实例化，可通过静态方法实例化

### 类与接口

```ts
interface Eat {
    eat (food: string): void
}
interface Run {
    run (distance: number): void
}

// 使用 implements 实现接口，可以传多个
// 实现了的接口，接口上定义的方法一定要全部实现
class Person implements Eat, Run {
    eat (food: string): void {
        console.log(`优雅的进食：${food}`)
    }
    run(distance: number): void {
        console.log(`直立行走：${distance}`)
    }
}

class Animal implements Eat, Run {
    eat(food: string): void {
        console.log(`呼噜呼噜的吃：${food}`)
    }
    run(distance: number): void {
        console.log(`爬行：${distance}`)
    }
}
```

根据面向对象的思维，这边定义了 Person（人）和 Animal（动物）的类，根据这两个类的特性，他们都有 “吃” 和 “走” 的能力，于是抽象出了 Eat（吃）和 Run（走）的接口，然后让两个类分别实现了 Eat 和 Run 接口。

### 抽象类

```ts
interface Eat {
    eat (food: string): void
}
interface Run {
    run (distance: number): void
}

// class 前面加上 abstract 就是抽象类
// 抽象类不需要实现接口里的全部方法，可以定义成抽象方法
abstract class Animal implements Eat, Run {
    // 抽象类可以实现一部分方法
    eat (food: string): void {
        console.log(`呼噜呼噜的吃：${food}`)
    }
    // 一部分定义为抽象方法，让继承者实现
    // 普通方法前面加上 abstract 就是抽象方法
    abstract run (distance: number): void
}

class Dog extends Animal {
    run(distance: number): void {
        console.log(`四脚爬行：${distance}`)
    }
}

const dog = new Dog();
dog.eat('🦴')
dog.run(100)
```

### 泛型

```ts
// 这边 createArray 传进来的可能是 number，可能是 string ，我们可以采用泛型。
// 泛型使用一对尖括号，里面的 T 是一个变量名，用来接收外部传进来的类型。
// 这边的 value 值和返回值数组元素类型都是同一个类型，所以可以使用 T 作为类型
function createArray<T> (length: number, value: T): T[] {
    const arr = Array<T>(length).fill(value);
    return arr;
}

// 这边可以不传类型，会自动推断出 T 的值是 string
const res1 = createArray(3, 'test');

// 最好是能传类型，这样类型更明确，也更便于阅读代码
const res2 = createArray<string>(3, 'test');
const res3 = createArray<number>(3, 123);
```
