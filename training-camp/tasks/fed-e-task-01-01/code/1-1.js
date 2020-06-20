const sleep = (delay = 10) => new Promise(resolve => {
    setTimeout(resolve, delay)
})
let a, b, c

sleep()
    .then(() => {
        a = 'hello'
        return sleep()
    })
    .then(() => {
        b = 'lagou'
        return sleep()
    })
    .then(() => {
        c = 'I ❤️ U'
        console.log(a + b + c)
    })