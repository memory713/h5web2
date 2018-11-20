import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  userInfo: {},
  today: {
    year: '',
    month: '',
    monthDate: ''
  },
  login: false
}
const mutations = {
  today (state, today) {
    state.today = today || {}
  },
  setUserInfo (state, userInfo) {
    if (userInfo) {
      state.login = true
    } else {
      state.login = false
    }
    state.userInfo = userInfo || {}
  }
}
export default new Vuex.Store({
  state,
  mutations
})
