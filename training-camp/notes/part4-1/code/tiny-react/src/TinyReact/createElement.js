export default function createElement (type, props, ...children) {
    const childElement = [].concat(children)
        .reduce((res, child) => res.concat(child), [])
        .filter(child => ![false, true, null].includes(child))
        .map(child => {
            if (child instanceof Object) {
                return child
            }
            return createElement('text', { textContent: child })
        })

    return {
        type,
        props: Object.assign({ children: childElement }, props),
        children: childElement
    }
}