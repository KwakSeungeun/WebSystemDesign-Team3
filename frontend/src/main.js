import Vue from 'vue'
import App from './App'
import {store} from './store'
import axios from 'axios'
import router from './router'
import VueSessionStorage from 'vue-sessionstorage'

Vue.use(VueSessionStorage)

Vue.prototype.$EventBus = new Vue;
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
