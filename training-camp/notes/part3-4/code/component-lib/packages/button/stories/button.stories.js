import JcButton from '..'

// 默认导出成员作为第一层菜单信息
export default {
    title: 'JcButton',
    component: JcButton
}

// 第二层菜单信息，变量名 Demo1 将作为菜单名存在
// 传一个函数，返回一个组件配置，将作为预览组件
export const Demo1 = () => ({
    components: { JcButton },
    template: '<jc-button>第一种按钮</jc-button>'
})

export const Demo2 = () => ({
    components: { JcButton },
    template: '<jc-button type="reset">第二种按钮</jc-button>'
})
// 如果不想用 Demo2 为菜单名，可以通过配置修改
Demo2.story = {
  name: '重置按钮'
}