<template>
  <v-data-table
    :headers='headers'
    :items='transactions'
    hide-actions
    class='elevation-3'>
    <template slot='items' slot-scope='props'>
      <td>{{ props.item.date }} </td>
      <td>
        <v-chip>
          <v-avatar>
            <img :src="addressToAvatarUrl(props.item.from)">
          </v-avatar>
          {{ addressToName(props.item.from) }}
        </v-chip>
        <v-icon>chevron_right</v-icon>
        <v-chip>
          <v-avatar>
            <img :src="addressToAvatarUrl(props.item.to)">
          </v-avatar>
          {{ addressToName(props.item.to) }}
        </v-chip>
      </td>
      <td>{{ decimalize(props.item.amount) }} {{ symbol }}</td>
    </template>
    <template slot='no-data'>
      There are no transactions yet.
    </template>
  </v-data-table>
</template>

<script>
import md5 from 'js-md5'

export default {
  name: 'Transactions',
  components: {},
  data () {
    return {
      headers: [{
        text: 'Date',
        sortable: false,
        value: 'date'
      }, {
        text: 'Transaction',
        sortable: false
      }, {
        text: 'Value',
        sortable: false,
        value: 'returnValues.value'
      }]
    }
  },
  props: {
    accounts: {
      type: Array,
      required: true
    },
    transactions: {
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
    decimalize: function (amount) {
      const paddedAmount = '0'.repeat(Math.max(0, parseInt(this.decimals, 10) + 1 - amount.length)) + amount
      return `${paddedAmount.slice(0, -this.decimals)}.${paddedAmount.slice(-this.decimals)}`
    },
    addressToName: function (address) {
      const account = this.accounts.find(account => account.address === address)
      if (account === undefined) return 'Unknown'
      return account.name
    },
    addressToAvatarUrl: function (address) {
      const account = this.accounts.find(account => account.address === address)
      if (account === undefined) return `http://www.gravatar.com/avatar/${md5(address)}?d=identicon`
      return account.avatarUrl
    }
  }
}
</script>
