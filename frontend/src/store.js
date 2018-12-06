import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
      email:'',
      isLogged: false, // 로그인 중인 여부 판단
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
    setIsLogged(state, vale){
      this.state.isLogged = vale;
    },
    removeUser(){
      this.state.email=''
    }
  },
});