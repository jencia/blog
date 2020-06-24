const fp = require('lodash/fp')
const cars = require('./2-cars')

let _average = function (xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}
// let averageDollarValue = function (cars) {
//     let dollar_values = fp.map(function (car) {
//         return car.dollar_value
//     }, cars)
//     return _average(dollar_values);
// }
let averageDollarValue = fp.flowRight(_average, fp.map(fp.prop('dollar_value')))

console.log(averageDollarValue(cars));