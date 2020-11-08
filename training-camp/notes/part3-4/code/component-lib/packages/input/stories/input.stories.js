import JcInput from '..'

export default {
    title: 'JcInput',
    component: JcInput
}
export const Demo1 = () => ({
    components: { JcInput },
    template: '<jc-input />'
})

export const Demo2 = () => ({
    components: { JcInput },
    template: '<jc-input type="number" />'
})