const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])

let ex2 = fp.map(fp.first);

console.log(xs.map(ex2));
