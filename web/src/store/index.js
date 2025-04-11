import { createStore } from 'vuex'
import ModuleUSer from './user'
import ModulePk from './pk'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user: ModuleUSer,
    pk: ModulePk,
  }
})
