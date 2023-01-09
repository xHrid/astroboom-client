import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import leaderBorad from "@/views/LeaderView.vue"
import lobby from "@/views/LobbyView.vue"
import store from "../store/index"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path:"/leaderboard",
    name: "leaderboard",
    component: leaderBorad
  },

  {
    path: "/game",
    name: "game",
    component: () => import("@/views/GameView"),
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/lobby",
    name: "lobby",
    component: lobby,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/me",
    name: "profile",
    component: () => import("@/views/PlayerProfileView"),
    meta: {
      requiresAuth: true
    }
  },

  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue")
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((req, res, next) => {
  if(req.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.isAuthenticated) {
      next({
        path:"/login"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
