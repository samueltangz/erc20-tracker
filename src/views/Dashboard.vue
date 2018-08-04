<template>
  <div>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>
      <v-breadcrumbs-item>
        Dashboard
      </v-breadcrumbs-item>
    </v-breadcrumbs>

    <loading
      :value="!isAccountsLoaded || !isTransactionsLoaded"
      progressColor='blue'
      :message='loadingMessage' />
    <div v-if="tokenName">
      Token Name: {{ tokenName }}
    </div>
    <hr>
    <accounts
      :accounts="accounts"
      :decimals="decimals"
      :symbol="symbol" />
    <transactions
      :accounts="accounts"
      :transactions="transactions"
      :decimals="decimals"
      :symbol="symbol" />
  </div>
</template>

<script>
import Web3 from 'web3'
import { mapGetters } from 'vuex'

import store from '@/store'
import Loading from '@/components/Loading.vue'
import Accounts from '@/components/Accounts.vue'
import Transactions from '@/components/Transactions.vue'
import { jsonInterface } from '@/utils/web3.js'
import { getTimezonedDate } from '@/utils/time.js'

const contractAddress = localStorage.getItem('contractAddress')
const network = localStorage.getItem('network')

const web3 = new Web3(`https://${network}.infura.io/v3/5ec3643e4f6e4773931bd99c932598fb`)
const myContractInstance = new web3.eth.Contract(jsonInterface, contractAddress)

export default {
  name: 'Dashboard',
  components: {
    Loading,
    Accounts,
    Transactions
  },
  data () {
    return {
      isAccountsLoaded: false,
      isTransactionsLoaded: false,

      tokenName: '',
      symbol: '',
      decimals: 0,

      pollingFnIds: [],
      lastBlock: 0,

      transactions: []
    }
  },
  computed: {
    ...mapGetters('account', [
      'accounts'
    ]),
    loadingMessage: function () {
      if (this.tokenName === '' || this.symbol === 'undefined' || this.decimals === 0) {
        return 'Retrieving basic information...'
      }
      if (this.isAccountsLoaded === false) {
        return 'Retrieving accounts...'
      }
      if (this.isTransactionsLoaded === false) {
        return 'Retrieving transactions...'
      }
    }
  },
  methods: {
    init: async function () {
      const [tokenName, symbol, decimals] = await Promise.all([
        myContractInstance.methods.name().call(),
        myContractInstance.methods.symbol().call(),
        myContractInstance.methods.decimals().call()
      ])
      this.tokenName = tokenName
      this.symbol = symbol
      this.decimals = parseInt(decimals, 10)

      this.pollBalances()
      this.pollHistory()
      this.pollingFnIds.push(setInterval(this.pollBalances, 3600 * 1000))
      this.pollingFnIds.push(setInterval(this.pollHistory, 5 * 1000))
    },

    pollBalances: async function () {
      const balancesArray = await Promise.all(this.accounts.map(account => this.getBalance(account.address)))
      balancesArray.forEach((balance, index) => {
        store.commit('account/setBalance', {
          address: this.accounts[index].address,
          balance
        })
      })
      this.isAccountsLoaded = true
    },
    pollHistory: async function () {
      const newTransactions = await myContractInstance.getPastEvents('Transfer', {
        fromBlock: this.lastBlock,
        toBlock: 'latest'
      })
      if (newTransactions.length > 0) {
        const lastIndex = newTransactions.length - 1
        // Input new transactions
        newTransactions.forEach(transaction => {
          // Add to history
          this.transactions.unshift({
            blockNumber: transaction.blockNumber,
            date: this.lastBlock > 0 ? getTimezonedDate() : undefined,
            from: transaction.returnValues.from,
            to: transaction.returnValues.to,
            amount: transaction.returnValues.value
          })
          // Remove the oldest from history if there are more than 10 records
          if (this.transactions.length > 10) this.transactions.pop()
          // Update the balances using the record
          if (this.lastBlock === 0) return
          const amount = transaction.returnValues.value
          store.commit('account/subtractBalance', {
            address: transaction.returnValues.from,
            amount
          })
          store.commit('account/addBalance', {
            address: transaction.returnValues.to,
            amount
          })
        })
        // Obtain the time when the transaction occurs
        this.transactions.forEach(async transaction => {
          if (transaction.date !== undefined) return
          const block = await web3.eth.getBlock(transaction.blockNumber)
          transaction.date = getTimezonedDate(block.timestamp * 1000)
        })
        this.lastBlock = newTransactions[lastIndex].blockNumber + 1
      }
      this.isTransactionsLoaded = true
    },

    getBalance: async function (address) {
      return myContractInstance.methods.balanceOf(address).call()
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    this.pollingFnIds.forEach(clearInterval)
  }
}
</script>
