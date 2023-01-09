import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import axios from "axios"
import router from './router/index.router'
import swal from 'vue-sweetalert2';
import config from './config'
// import socketio from 'socket.io-client';
// import VueSocketIO from 'vue-socket.io'

// Vue.use(new VueSocketIO({
//     connection: socketio('http://localhost:3000')
//   })
// );


const base = axios.create({
  baseURL: `${config.SERVER_BASEURL}`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`
  }
});

Vue.prototype.$http = base;

Vue.config.productionTip = false

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(swal);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
