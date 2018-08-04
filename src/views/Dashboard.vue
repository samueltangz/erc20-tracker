<template>
  <div>
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
import Loading from '@/components/Loading.vue'
import Accounts from '@/components/Accounts.vue'
import Transactions from '@/components/Transactions.vue'

const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/5ec3643e4f6e4773931bd99c932598fb')

const jsonInterface = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address'
      },
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      },
      {
        name: '_spender',
        type: 'address'
      }
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        name: 'spender',
        type: 'address'
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  }
]

const myContractInstance = new web3.eth.Contract(jsonInterface, '0x6144278a2568265eb396fe77fca9a2ce91036043')

export default {
  name: 'HelloWorld',
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

      lastBlock: 0,

      accounts: [{
        name: 'Alan',
        address: '0x102ee29eD6Abd17A5507B094fb9666111cAac6E4',
        balance: '0'
      }, {
        name: 'Edwin',
        address: '0xC213b811049881b9FFe1904A7325085067690045',
        balance: '0'
      }, {
        name: 'Harry',
        address: '0x19e264d91b08A746851AC47D92B0dc1061A24897',
        balance: '0'
      }, {
        name: 'Phoebe',
        address: '0xDFCAff68Cbdb997702BB1FaaE5a72D0E783228C7',
        balance: '0'
      }, {
        name: 'Samuel',
        address: '0xBCe00FD336be3be338458e93EfC80Da14f8a3e05',
        balance: '0'
      }, {
        name: 'Zetta',
        address: '0x0000000000000000000000000000000000000000',
        balance: '0'
      }],
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

      this.pollBalances()
      setInterval(this.pollBalances, 3600 * 1000)
      this.pollHistory()
      setInterval(this.pollHistory, 5 * 1000)
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
  }
}
</script>
