import Vue from 'vue'
import JcButton from './src/button.vue'

JcButton.install = () => {
    Vue.component(JcButton.name, JcButton)
}

export default JcButton
