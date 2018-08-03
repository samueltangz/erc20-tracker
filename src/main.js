// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueClipboard from 'vue-clipboard2'
import colors from 'vuetify/es5/util/colors'

import App from '@/App.vue'
import router from '@/router'
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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App />'
})
