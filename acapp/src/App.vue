<template>

    <div class="game-body">
      <MenuView v-if="$store.state.router.router_name === 'menu'"/>
      <PkIndexViewVue v-else-if="$store.state.router.router_name === 'pk'"/>
      <RecordIndexViewVue v-else-if="$store.state.router.router_name === 'record'"/>
      <RecordContentViewVue v-else-if="$store.state.router.router_name === 'record_content'"/>
      <RanklistIndexViewVue v-else-if="$store.state.router.router_name === 'ranklist'"/>
      <UserBotIndexViewVue v-else-if="$store.state.router.router_name === 'user_bot'"/>
    </div>

</template>

<script>  //写js代码

import { useStore } from 'vuex'
import MenuView from './views/MenuView.vue'
import PkIndexViewVue from './views/pk/PkIndexView.vue'
import RecordIndexViewVue from './views/record/RecordIndexView.vue'
import RecordContentViewVue from './views/record/RecordContentView.vue'
import RanklistIndexViewVue from './views/ranklist/RanklistIndexView.vue'
import UserBotIndexViewVue from './views/user/bot/UserBotIndexView.vue'


export default {
  components: {
    MenuView,
    PkIndexViewVue,
    RecordContentViewVue,
    RecordIndexViewVue,
    RanklistIndexViewVue,
    UserBotIndexViewVue,
  },
  setup() {
    const store = useStore();
    const jwt_token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkOTExMTBlNTUxYTE0M2Y5YTIwZTExYTlhYzY3MTRmMiIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTc0NTc1OTUyOCwiZXhwIjoxNzQ2OTY5MTI4fQ.jbmsjvEoOy9C8a2VlKgtFWxhyIBydMKgG1UKsm1Wvb4";
        if (jwt_token) {
            store.commit("updateToken", jwt_token);
            store.dispatch("getinfo", {
                success() {
                    store.commit("updatePullingInfo", false);
                },
                error() {
                    store.commit("updatePullingInfo", false);
                }
            })
        } else {
            store.commit("updatePullingInfo", false);
        }
  }
}
</script>



<style scoped>  

body {
  margin: 0;
}
div.game-body{
  background-image: url("@/assets/images/background2.png");
  background-size: cover;
  width:100%;
  height: 100%;

}

div.window {
  width: 100vw;
  height: 100vh;
}
</style>
