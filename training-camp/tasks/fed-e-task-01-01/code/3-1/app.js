const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let maybe = Maybe.of([5, 6, 1]);

let ex1 = num => Container.of(maybe._value).map(fp.map(fp.add(num)))

console.log(ex1(1));
console.log(ex1(5));