const fp = require('lodash/fp')
const cars = require('./2-cars')

let _underscore = fp.replace(/\W+/g, '_')
let setPropsByFn = fp.curry((name, fn, obj) => fp.set(name, fn(obj[name]))(obj))

let sanitizeNames = fp.map(setPropsByFn('name', fp.flowRight(_underscore, fp.toLower)))

console.log(sanitizeNames(cars))