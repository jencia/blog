const fp = require('lodash/fp');

// 类型与检验方法的映射对象
const mapTypeFn = {
  object: v => Object.prototype.toString.call(v) === '[object Object]',
  array: v => Array.isArray(v),
  default: fp.curry((t, v) => typeof v === t)
}
// 检测变量的类型
exports.checkType = fp.curry((type, value) => {
  const fn = mapTypeFn[type];

  return fn ? fn(value) : mapTypeFn.default(type)(value)
})
// 由于判断 function 类型的地方比较多，所以单独定义一个
exports.checkFnType = this.checkType('function')