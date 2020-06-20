const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let ex4 = n => n && parseInt(n)

console.log(ex4())
console.log(ex4(5))