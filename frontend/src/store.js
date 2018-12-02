import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
      token: 'testToken',
      trades: []
  },
  mutations:{
    setTrades: function(trades, value){
      trades = value;
    }
  }
});