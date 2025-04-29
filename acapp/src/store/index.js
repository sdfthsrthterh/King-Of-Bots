import { createStore } from 'vuex'
import ModuleUSer from './user'
import ModulePk from './pk'
import ModuleRecord from './record'
import ModuleRouter from './router'


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
    record: ModuleRecord,
    router: ModuleRouter,
  }
})
