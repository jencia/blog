const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let ex4 = fp.flowRight(fp.map(parseInt), Maybe.of)

console.log(ex4())
console.log(ex4(5))