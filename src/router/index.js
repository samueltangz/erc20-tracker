import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '@/views/Dashboard.vue'
import Settings from '@/views/Settings.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  }, {
    path: '/settings/',
    name: 'Settings',
    component: Settings
  }]
})
