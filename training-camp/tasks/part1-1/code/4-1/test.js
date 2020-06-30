const MyPromise =  require('./MyPromise')

// ========== demo1 =============
// 多次变换只有第一次有效，同步、异步、异常都有效
new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success sync')
  }, 1000)
  resolve('success')
  reject('error')
}).then(console.log, console.log)

// ========== demo2  ===========
// 根据 Promise 的异常处理
// 执行器：同步异常捕捉，异步异常抛出
// then 和 catch 的异常都能捕捉
// new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     // dsdxx
//     resolve('success sync')
//   }, 1000)
//   // dsddds
//   resolve('success')
//   // reject('error')
// })
//   .then(res => {
//     // dsd
//     console.log(res)
//   })
//   .catch(console.log)

// ============ demo3 ===========
// 支持多次调用和链式调用
// 支持同步和异步的数据传递和错误信息传递
// var promise = new MyPromise((resolve, reject) => {
//   // setTimeout(() => {
//   //   resolve('success sync')
//   // }, 1000)
//   resolve('success')
// })

// promise
//   .then(res => console.log(1, res))
//   .then(() => {
//     console.log(4, 'then1')
//     return 'xxx' 
//     // return new MyPromise(resolve => {
//     //   setTimeout(() => resolve('xxx'), 1000)
//     // })
//   })
//   .then()
//   .then(44)
//   .then(res => {
//     console.log(5, res)
//     throw '6 error'
//   })
//   .catch(console.log)
// promise.then(res => console.log(2, res))
//   .then(() => console.log(4, 'then2'))
// promise.then(res => console.log(3, res))

// =========== demo4 ==========
// 测试 finally，成功、失败、延迟
// new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('success');
//     // reject('error');
//   }, 1000)
// })
//   .finally(() => {
//     console.log('finally')
//     return new Promise(resolve => {
//       setTimeout(resolve, 1000)
//     })
//   })
//   .then(console.log)
//   .catch(console.log)

// =========== demo5 ==========
// 测试 Promise.all 和 Promise.race
// const p1 = new Promise(resolve => {
//   setTimeout(() => resolve(1111), 1000)
// })
// const p2 = new Promise(resolve => {
//   setTimeout(() => resolve(222), 900)
// })
// const p3 = new Promise(resolve => {
//   setTimeout(() => resolve(333), 1500)
// })

// // Promise.all(['00', p1, p2, p3, '44'])
// //   .then(console.log)

// Promise.race([p1, p2, p3])
//   .then(console.log)