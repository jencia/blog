const fp = require('lodash/fp')
const cars = require('./2-cars')

let _underscore = fp.replace(/\W+/g, '_')

let sanitizeNames =fp.map(fp.flowRight(_underscore, fp.toLower, fp.prop('name')))

console.log(sanitizeNames(cars))