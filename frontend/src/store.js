import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
      email:'',
      trades: []
  },
  mutations:{
    setTrades: function(state, value){
      this.state.trades = value;
    },
    setUser(state, email){
      this.state.email = email;
      console.log('VUEX setUser :',this.state.email);
    },
    removeUser(){
      this.state.email=''
    }
  },
});