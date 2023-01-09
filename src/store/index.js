import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    token: "",
    lobbyCode: "",
    mode: 'r',
    isAuthenticated: false
  },

  mutations: {

    setUser( state, user ) {
      state.user = user;
    },

    setToken( state, token ) {
      state.token = token;
    },

    setStatus(state, status) {
      state.isAuthenticated = status;
    },

    setLobbyCode(state, code) {
      state.lobbyCode = code;
    },

    setMode(state, mode) {
      state.mode = mode;
    },

    logout(state) {
      console.log("LogginOut")
      state.user = {},
      state.token = "",
      state.isAuthenticated = false;
    }
  },

  plugins: [createPersistedState()]
})
