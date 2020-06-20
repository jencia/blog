const fp = require('lodash/fp')
const cars = require('./2-cars')

// let isLastInStock = function (cars) {
//     // 获取最后一条数据
//     let last_car = fp.last(cars)
//     // 获取最后一条数据的 in_stock 属性值
//     return fp.prop('in_stock', last_car)
// }

let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)

console.log(isLastInStock(cars))