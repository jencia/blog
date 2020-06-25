const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let safeProp = fp.curry(function (x, o) {
    return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }

let ex3 = fp.flowRight(fp.map(fp.first), safeProp('name'))

console.log(ex3(user));
