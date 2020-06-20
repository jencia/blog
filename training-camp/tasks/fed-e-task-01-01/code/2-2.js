const fp = require('lodash/fp')
const cars = require('./2-cars')

let getFirstName = fp.flowRight(fp.prop('name'), fp.first)

console.log(getFirstName(cars));