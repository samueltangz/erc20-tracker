// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueClipboard from 'vue-clipboard2'
import colors from 'vuetify/es5/util/colors'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/stylus/main.styl'

Vue.use(Vuetify, {
  theme: {
    primary: colors.grey.base,
    secondary: colors.indigo.darken2,
    accent: colors.indigo.darken2,
    error: colors.red.accent4,
    warning: colors.yellow.accent4,
    info: colors.blue.accent4,
    success: colors.green.accent4
  }
})
Vue.use(VueClipboard)
Vue.config.productionTip = false

if (localStorage.getItem('contractAddress') === null) {
  localStorage.setItem('contractAddress', '0x6144278a2568265eb396fe77fca9a2ce91036043')
}
if (localStorage.getItem('network') === null) {
  localStorage.setItem('network', 'ropsten')
}
store.commit('account/initialize')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App />'
})
