import { createRouter, createWebHistory } from 'vue-router'

import NotFoundView from "@/views/error/NotFoundView.vue"
import PkIndexView from "@/views/pk/PkIndextView.vue"
import RecordIndexView from "@/views/record/RecordIndexView.vue"
import RankListIndexView from "@/views/ranklist/RankListIndexView.vue"
import UserBotIndexView from "@/views/user/bot/UserBotIndexView.vue"
import UserAccountLoginView from "@/views/user/account/UserAccountLoginView.vue"
import UserAccountRegisterView from "@/views/user/account/UserAccountRegisterView.vue"


const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/pk/"
  },
  {
    path: "/pk/",
    name: "pk_index",
    component: PkIndexView,
  },
  {
    path: "/ranklist/",
    name: "ranklist_index",
    component: RankListIndexView,
  },
  {
    path: "/record/",
    name: "record_index",
    component: RecordIndexView,
  },
  {
    path: "/user/bot/",
    name: "user_bot_index",
    component: UserBotIndexView,
  },
  {
    path: "/user/account/login/",
    name: "user_account_login",
    component: UserAccountLoginView,
  },
  {
    path: "/user/account/register/",
    name: "user_account_register",
    component: UserAccountRegisterView,
  },
  {
    path: "/404/",
    name: "404",
    component: NotFoundView,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404/"
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
