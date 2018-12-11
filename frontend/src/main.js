import Vue from 'vue'
import App from './App'
import {store} from './store'
import axios from 'axios'
import router from './router'
import VueCookie from'vue-cookie';
import VueSession from 'vue-session'
import config from './config'
import VueLocalStorage from 'vue-localstorage'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import Notifications from 'vue-notification'
import Photoswipe from "vue-pswipe"

Vue.config.productionTip = false

Vue.component('photo-swipe',Photoswipe)
 
Vue.use(Photoswipe)
Vue.use(VueMomentJS, moment)
Vue.use(Notifications)
Vue.use(VueLocalStorage)
Vue.use(VueSession)
Vue.use(VueCookie)

Vue.prototype.$config = config;
Vue.prototype.$EventBus = new Vue;
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
