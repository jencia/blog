import Vue from 'vue'
import JcLink from './src/link.vue'

JcLink.install = () => {
    Vue.component(JcLink.name, JcLink)
}

export default JcLink
