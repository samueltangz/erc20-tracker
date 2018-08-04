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
      <li>Network: {{ network }}</li>
      <li>Contract address: {{ contractAddress }}</li>
      <li>Accounts: {{ accounts }}</li>
      <hr>
      <li>
        Support operations:
        <ol>
          <li>Update network</li>
          <li>Update contract address</li>
          <li>Create new account</li>
          <li>Update account (name, address, order)</li>
          <li>Delete account</li>
        </ol>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Settings',
  data () {
    return {
      network: undefined,
      contractAddress: undefined
    }
  },
  mounted () {
    this.contractAddress = localStorage.getItem('contractAddress')
    this.network = localStorage.getItem('network')
  },
  computed: {
    ...mapGetters('account', [
      'accounts'
    ])
  }
}
</script>
