<template>
  <div>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>
      <v-breadcrumbs-item
        :to="{ name: 'Dashboard' }"
        exact>
        Dashboard
      </v-breadcrumbs-item>
      <v-breadcrumbs-item>
        Settings
      </v-breadcrumbs-item>
    </v-breadcrumbs>

    <ul>
      <li>Network + Contract address?</li>
      <li>Accounts</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      network: undefined,
      contractAddress: undefined,

      accounts: []
    }
  }
}
</script>
