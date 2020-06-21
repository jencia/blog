/*
  1. Promise 就是一个类，在执行这个类的时候，需要传递一个执行器进去，执行器会立即执行
  2. Promise 中有三种状态，分别为成功（fulfilled）、失败（rejected）、等待（pending）
    初始状态 pending
    执行 resolve：pending -> fulfilled
    执行 reject：pending -> rejected
    一旦状态确定就不可更改
  3. 三种状态只会出现其中一个，所以承诺结果的值只有一个
  4. 执行器、then、catch 都要考虑同步代码、异步代码、出现异常的情况
  5. then 和 catch 方法都能可以多次调用，而支持链式调用
  6. 关于链式调用有几项规则:
    - then 和 catch 都是要传递 function，如果不是，则使用默认值，默认是 function (v) { return v }
    - 每个 then 和 catch 都能往下传新数据，return 的值作为 resolve 的数据，throw 的值作为 reject 的数据
    - 往下传递的数据如果是 Promise 就作为新的异步代码等待执行完成后才进入下一个 then 或 catch；非 Promise 值就是同步代码
    - 往下传递 Promise 时不能是当前 Promise ，一定是要全新的 Promise ，否则抛出异常 (TypeError: Chaining cycle detected for promise #<Promise>)
  7. api 与原生 Promise 保持一致，在实例属性上不出现额外数据，比如 resolve、reject、callback
*/

const { checkFnType } = require('./utils')
const event = require('./event')

const STATUS = {
  PENDING: 'pending',     // 等待
  RESOLVED: 'resolved', // 成功
  REJECTED: 'rejected'    // 失败
}

class MyPromise {
  constructor (actuator) {
    if (!checkFnType(actuator)) {
      throw new TypeError(`Promise resolver ${fn} is not a function`)
    }
    this._tag = Symbol()
    this.status = STATUS.PENDING
    this.value = undefined

    // 结果响应，成功和失败代码合在一起
    event.on(this._tag, 'response', ({ value, status }) => {
      // 只有处于等待状态才能
      if (this.status !== STATUS.PENDING) return

      this.status = status
      this.value = value

      // 如果执行了 resolve ，就触发成功回调
      event.emit(
        this._tag,
        status === STATUS.RESOLVED ? 'successCallback' : 'failCallback',
        value
      )
      // 响应结束，清除所有当前实例的事件
      event.off(this._tag)
    })

      // 根据状态值获取对应的响应函数
    const getResFn = status => value => event.emit(this._tag, 'response', { value, status })
    try {
      // 执行器在实例化的时候立即执行
      actuator(getResFn(STATUS.RESOLVED), getResFn(STATUS.REJECTED))
    } catch (e) {
      // 如果执行器有代码异常直接走 reject
      getResFn(STATUS.REJECTED)(e)
    }
  }

  // 采用 get 和 set 统一管理设置和获取权限
  get status () {
    return this['[[PromiseStatus]]'] || STATUS.PENDING
  }
  set status (s) {
    // 只有处于等待状态才能修改状态
    if (this.status === STATUS.PENDING) {
      this['[[PromiseStatus]]'] = s
    }
  }
  get value () {
    return this['[[PromiseValue]]']
  }
  set value (v) {
    this['[[PromiseValue]]'] = v
  }

  then (successCallback, failCallback) {
    this._callNum = this._callNum ? this._callNum + 1 : 1
    // 非函数类型的参数使用默认参数
    const successCb = checkFnType(successCallback) ? successCallback : v => v
    const failCb = checkFnType(failCallback) ? failCallback : v => { throw v }
    const index = this._callNum  // 拷贝一份避免到后面都变成最后一个值
    let thenValue

    try {
      // TODO 微任务怎么模拟呢？
      if (this.status === STATUS.RESOLVED) {
        thenValue = successCb(this.value)
      } else if (this.status === STATUS.REJECTED) {
        thenValue = failCb(this.value)
      }
      // 无论什么状态下都去绑定回调事件，同步代码会执行到空的，只有异步代码才会执行到实际回调
      // 事件名称带 :num 表示这是第几个 then 方法，触发事件时会无视序号全部执行
      event.on(this._tag, `successCallback:${index}`, res => {
        thenValue = successCb(res)
      })
      event.on(this._tag, `failCallback:${index}`, e => {
        thenValue = failCb(e)
      })
    } catch (e) {
      return MyPromise.reject(e)
    }
    
    // 如果不是等待状态，即同步代码就直接返回结果
    if (this.status !== STATUS.PENDING) {
      return Promise.resolve(thenValue)
    }

    return new MyPromise((resolve, reject) => {
      const getHandleFn = () => () => {
        // 如果返回自身实例就报错
        if (thenValue === this) {
          throw new TypeError('Chaining cycle detected for promise #<Promise>')
        }
        // 如果返回 MyPromise 就等待执行，否则直接返回
        thenValue instanceof MyPromise ? thenValue.then(resolve, reject) : resolve(thenValue)
      }
      event.on(this._tag, `successCallback:end:${index}`, getHandleFn(STATUS.RESOLVED))
      event.on(this._tag, `failCallback:end:${index}`, getHandleFn(STATUS.REJECTED))
    })
  }
  catch (failCallback) {
      return this.then(undefined, failCallback)
  }
  finally (callback) {
    if (checkFnType(callback)) return this

    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      e => MyPromise.resolve(callback()).then(() => { throw e })
    )
  }
}

MyPromise.resolve = value => {
  // 如果传的是 MyPromise 对象，则直接return
  if (value instanceof MyPromise) {
    return value
  }
  // 其他值创建一个新的 MyPromise ，并直接把值传 resolve 的参数里
  return new MyPromise(resolve => {
    resolve(value)
  })
}

MyPromise.reject = reason => {
  // reject 不管传的是什么值都创建一个新的 MyPromise，将值作为 reject 的参数
  return new MyPromise((_, reject) => {
    reject(reason)
  })
}

// 多个 MyPromise 同时进行，所有 MyPromise 都响应完后再返回所有的值
MyPromise.all = arr => {
  const result = [] // 最终结果值
  let count = 0     // 当前完成个数

  return new MyPromise((resolve, reject) => {
    const addData = (i, value) => {
      // 完成后设置对应索引下值，个数加一，如果完成个数等于总数就 resolve
      result[i] = value
      count += 1
      count === arr.length && resolve(result)
    }
    for (let i in arr) {
      const curr = arr[i];

      // 如果是 MyPromise 值则在响应结束后添加值，否则立即添加值
      curr instanceof MyPromise
        ? curr.then(v => addData(i, v), reject)
        : addData(i, arr[i])
    }
  })
}

// 多个 MyPromise 同时进行，取最早得到响应的 MyPromise
MyPromise.race = arr => {
  return new MyPromise((resolve, reject) => {
    for (let i in arr) {
      const curr = arr[i];

      if (curr instanceof MyPromise) {
        curr.then(resolve, reject)
      } else {
        resolve(arr[i]);
        break;
      }
    }
  })
}

module.exports = MyPromise
