import Vue from 'vue'
import Router from 'vue-router'
import MainContents from './views/MainContents'
import SellMyBook from './views/SellMyBook'
import MySaleStatus from './views/MySaleStatus'
import TradeDetails from './views/TradeDetails'
import SelectBuyer from './views/SelectBuyer'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollToTop (to, from, savedPosition) {
    return{ x:0, y:0 };
  },
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
      path: '/details/:id',
      name: "trade-details",
      component: TradeDetails
    },
    {
      path: '/select/buyer',
      name: "select-buyer",
      component: SelectBuyer
    }
  ]
})
