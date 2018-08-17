import BigNumber from 'big-number'
import md5 from 'js-md5'

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
            avatarUrl: account.avatarUrl ? account.avatarUrl : `http://www.gravatar.com/avatar/${md5(account.address)}?d=identicon`,
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
          }, {
            name: 'Zetta',
            address: '0x03129deAf06732076D1149c40A0743CAD679554d'
          }, {
            name: 'Byr(o:n',
            address: '0x9Ce8744E16816d519227945D4dE610C45F364111',
            avatarUrl: 'https://vxcon.hk/images/common/individual_sponsors/byronwai.png'
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
      state.balances[address] = BigNumber(state.balances[address])
        .plus(BigNumber(amount))
        .toString()
      state.balances = Object.assign([], state.balances)
    },
    subtractBalance: (state, payload) => {
      const { address, amount } = payload
      state.balances[address] = BigNumber(state.balances[address])
        .minus(BigNumber(amount))
        .toString()
      state.balances = Object.assign([], state.balances)
    }
  },
  actions: {}
}
