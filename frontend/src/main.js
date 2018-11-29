import Vue from 'vue'
import App from './App'
import {store} from './store'
import axios from 'axios'
import VueRouter from 'vue-router'
import MainContents from './components/contents/MainContents'
import SellMyBook from './components/contents/SellMyBook'
import MySaleStatus from './components/contents/MySaleStatus'

Vue.prototype.$EventBus = new Vue;
Vue.prototype.$http = axios;

Vue.config.productionTip = false

Vue.use(VueRouter);
const routes = [
  {
    path:'/',
    component: MainContents
  },
  {
    path: '/sell',
    component: SellMyBook
  },
  {
    path: '/mysale',
    component: MySaleStatus
  }
];

const router = new VueRouter({
  routes
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
