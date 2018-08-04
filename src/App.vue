<template>
  <v-app
    id="app"
    dark>
    <v-toolbar
      app
      fixed>
      <v-toolbar-title>
        ERC20 Token Tracker
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        router
        :to="{ name: 'Settings' }"
        icon
        dark>
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-container>
        <router-view />
      </v-container>
    </v-content>
    <v-footer
      app
      fixed
      class="pa-3">
      <v-spacer />
      <span>Created by Samuel with &hearts; 2018</span>
    </v-footer>

  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>
