<template>
  <v-layout wrap>
    <v-flex
      v-for="account in accounts"
      :key="account.address"
      xs4
      pa-2>
      <v-card raised>
        <v-card-text>
          <qr-code
            :text="account.address"
            :size="160" />
        </v-card-text>
        <v-card-text>
          <v-avatar size='36px'>
            <img src='https://avatars0.githubusercontent.com/u/9064066?v=4&s=460'>
          </v-avatar>
          {{ account.name }}
          <v-icon>account_balance_wallet</v-icon>
          {{ account.balance }} {{ symbol }}
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import QrCode from 'vue-qrcode-component'

export default {
  name: 'Accounts',
  components: {
    QrCode
  },
  props: {
    accounts: {
      type: Array,
      required: true
    },
    symbol: {
      type: String,
      required: true
    }
  }
}
</script>
