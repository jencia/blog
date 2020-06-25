const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let maybe = Maybe.of([5, 6, 1])

let ex1 = fp.map(fp.add(1))

console.log(maybe.map(ex1));