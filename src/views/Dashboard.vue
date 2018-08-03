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
      :symbol="symbol" />
    <transactions
      :accounts="accounts"
      :transactions="txHistory"
      :decimals="decimals"
      :symbol="symbol" />
  </div>
</template>

<script>
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

      tokenName: undefined,
      symbol: undefined,
      decimals: 0,

      accounts: [{
        name: 'Alan',
        address: '0x102ee29eD6Abd17A5507B094fb9666111cAac6E4'
      }, {
        name: 'Edwin',
        address: '0xC213b811049881b9FFe1904A7325085067690045'
      }, {
        name: 'Harry',
        address: '0x19e264d91b08A746851AC47D92B0dc1061A24897'
      }, {
        name: 'Phoebe',
        address: '0xDFCAff68Cbdb997702BB1FaaE5a72D0E783228C7'
      }, {
        name: 'Samuel',
        address: '0xBCe00FD336be3be338458e93EfC80Da14f8a3e05'
      }],
      txHistory: []
    }
  },
  computed: {
    loadingMessage: function () {
      if (this.tokenName === undefined || this.symbol === undefined || this.decimals === 0) {
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
      [this.tokenName, this.symbol, this.decimals] = await Promise.all([
        myContractInstance.methods.name().call(),
        myContractInstance.methods.symbol().call(),
        myContractInstance.methods.decimals().call()
      ])

      this.pollBalances()
      setInterval(this.pollBalances, 10000)

      this.pollHistory()
      setInterval(this.pollHistory, 10000)
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
      this.txHistory = await myContractInstance.getPastEvents('Transfer', {
        fromBlock: 0,
        toBlock: 'latest'
      })
      this.txHistory.reverse()
      this.isTransactionsLoaded = true
    },

    getBalance: async function (address) {
      const balance = await myContractInstance.methods.balanceOf(address).call()
      return this.decimalize(balance)
    },
    decimalize: function (amount) {
      const paddedAmount = '0'.repeat(Math.max(0, parseInt(this.decimals, 10) + 1 - amount.length)) + amount
      return `${paddedAmount.slice(0, -this.decimals)}.${paddedAmount.slice(-this.decimals)}`
    }
  },
  mounted () {
    this.init()
  }
}
</script>
