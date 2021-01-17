
//s<=r<e
export function randomInt(s, e) {
    let d = e - s
    if (d < 0) {
        return s
    }
    let r = Math.random() * d + s
    r = parseInt(r, 10)
    return r
}

export function copy(message) {
    let doc = document.createElement("input")
    doc.value = message
    document.body.appendChild(doc)
    doc.select()
    let status
    try {
        status = document.execCommand('copy')
    } catch (e) { }
    document.body.removeChild(doc)
    return status
}
export function addHttp(url){
    return (url.match(/https?:\/\//i)?'':'https://') + url
}