<template>
  <v-layout wrap>
    <v-flex
      v-for="account in accounts"
      v-if="symbol !== '' && decimals > 0"
      :key="account.address"
      xs6
      sm4
      md3
      pa-2>
      <v-card raised>
        <v-card-text>
          <qr-code
            :text="account.address"
            :size="160"
            style='border: 5px solid white; width: 170px; height: 170px; margin: 0 auto;' />
        </v-card-text>
        <v-card-text>
          <h3 class='title'>
            <v-avatar size='36px'>
              <img src='https://avatars0.githubusercontent.com/u/9064066?v=4&s=460'>
            </v-avatar>
            {{ account.name }}
          </h3>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-icon>account_balance_wallet</v-icon>
          {{ decimalize(account.balance) }} {{ symbol }}
          <v-spacer />
          <v-tooltip top>
            <v-btn
              v-clipboard:copy='account.address'
              v-clipboard:success='onCopy'
              slot='activator'
              icon
              flat
              color='blue'>
              <v-icon>file_copy</v-icon>
            </v-btn>
            <span>Copy address</span>
          </v-tooltip>
        </v-card-actions>
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
    },
    decimals: {
      type: Number,
      required: true
    }
  },
  methods: {
    onCopy: (e) => {
      alert('Copied!')
    },
    decimalize: function (amount) {
      const paddedAmount = '0'.repeat(Math.max(0, parseInt(this.decimals, 10) + 1 - amount.length)) + amount
      return `${paddedAmount.slice(0, -this.decimals)}.${paddedAmount.slice(-this.decimals)}`
    }
  }
}
</script>
