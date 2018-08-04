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

if (localStorage.getItem('contractAddress') === null) {
  localStorage.setItem('contractAddress', '0x6144278a2568265eb396fe77fca9a2ce91036043')
}
if (localStorage.getItem('network') === null) {
  localStorage.setItem('network', 'ropsten')
}
if (localStorage.getItem('accounts') === null) {
  localStorage.setItem('accounts', JSON.stringify(
    [{
      name: 'Alan',
      address: '0x102ee29eD6Abd17A5507B094fb9666111cAac6E4'
    }, {
      name: 'Edwin',
      address: '0xC213b811049881b9FFe1904A7325085067690045'
    }, {
      name: 'Harry',
      address: '0x19e264d91b08A746851AC47D92B0dc1061A24897'
    }, {
      name: 'Phoebe',
      address: '0xDFCAff68Cbdb997702BB1FaaE5a72D0E783228C7'
    }, {
      name: 'Samuel',
      address: '0xBCe00FD336be3be338458e93EfC80Da14f8a3e05'
    }]
  ))
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App />'
})
