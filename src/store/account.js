import BigNumber from 'big-number'

export default {
  namespaced: true,
  state: {
    accountList: [],
    balances: {}
  },
  getters: {
    accounts: state => {
      return Object.assign([], state.accountList.map(
        account => {
          return {
            name: account.name,
            address: account.address,
            balance: state.balances[account.address]
          }
        }
      ))
    }
  },

  mutations: {
    initialize: (state) => {
      if (localStorage.getItem('accounts') === null) {
        localStorage.setItem('accounts', JSON.stringify(
          [{
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
          }]
        ))
      }
      state.accountList = JSON.parse(localStorage.getItem('accounts'))
      state.accountList.forEach(account => {
        state.balances[account.address] = '0'
      })
    },
    setBalance: (state, payload) => {
      const { address, balance } = payload
      state.balances[address] = balance
      state.balances = Object.assign([], state.balances)
    },
    addBalance: (state, payload) => {
      const { address, amount } = payload
      state.balances[address] = BigNumber(state.balances[address]).plus(BigNumber(amount)).toString()
      state.balances = Object.assign([], state.balances)
    },
    subBalance: (state, payload) => {
      const { address, amount } = payload
      state.balances[address] = BigNumber(state.balances[address]).minus(BigNumber(amount)).toString()
      state.balances = Object.assign([], state.balances)
    }
  },
  actions: {}
}