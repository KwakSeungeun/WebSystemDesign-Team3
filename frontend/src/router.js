import Vue from 'vue'
import Router from 'vue-router'
import MainContents from './views/MainContents'
import SellMyBook from './views/SellMyBook'
import MySaleStatus from './views/MySaleStatus'
import TradeDetails from './views/TradeDetails'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
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
    },
    {
      path: '/detail',
      component: TradeDetails
    }
  ]
})
