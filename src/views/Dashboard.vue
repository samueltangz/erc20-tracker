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
import BigNumber from 'big-number'
import Web3 from 'web3'
import Loading from '@/components/Loading.vue'
import Accounts from '@/components/Accounts.vue'
import Transactions from '@/components/Transactions.vue'
import { jsonInterface } from '@/utils/web3.js'

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

      accounts: [],
      transactions: []
    }
  },
  computed: {
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

      this.initAccounts()
      this.pollBalances()
      this.pollHistory()
      this.pollingFnIds.push(setInterval(this.pollBalances, 3600 * 1000))
      this.pollingFnIds.push(setInterval(this.pollHistory, 5 * 1000))
    },

    initAccounts: function () {
      this.accounts = JSON.parse(
        localStorage.getItem('accounts')
      ).map(account => {
        return {
          name: account.name,
          address: account.address,
          balance: '0'
        }
      })
    },
    pollBalances: async function () {
      const accounts = this.accounts

      const balancesArray = await Promise.all(accounts.map(account => this.getBalance(account.address)))
      balancesArray.forEach((balance, index) => {
        accounts[index].balance = balance
      })
      this.accounts = Object.assign([], accounts)
      this.isAccountsLoaded = true
    },
    pollHistory: async function () {
      const newTransactions = await myContractInstance.getPastEvents('Transfer', {
        fromBlock: this.lastBlock,
        toBlock: 'latest'
      })
      if (newTransactions.length > 0) {
        const lastIndex = newTransactions.length - 1
        newTransactions.forEach(transaction => {
          this.transactions.push(transaction)
          if (this.lastBlock === 0) return
          const fromIndex = this.accounts.findIndex(account => account.address === transaction.returnValues.from)
          const toIndex = this.accounts.findIndex(account => account.address === transaction.returnValues.to)
          const amount = BigNumber(transaction.returnValues.value)
          if (fromIndex > -1) this.accounts[fromIndex].balance = BigNumber(this.accounts[fromIndex].balance).minus(amount).toString()
          if (toIndex > -1) this.accounts[toIndex].balance = BigNumber(this.accounts[toIndex].balance).plus(amount).toString()
        })
        this.lastBlock = newTransactions[lastIndex].blockNumber + 1
        this.accounts = Object.assign([], this.accounts)
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
