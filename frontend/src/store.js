import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
      user:{},
      isLogged: false, // 로그인 중인 여부 판단
      trades: [],
      alarmList: [],
      notice: 0
  },
  mutations:{
    setNoticeZero: function(state) {
      this.state.notice = 0;
    },
    noticeDecrease: function(state) {
      this.state.notice--;
    },
    noticeIncrease: function(state) {
      this.state.notice++;
    },
    setReadAlarm: function(state, value) {
      for(let i = 0; i < this.state.alarmList.length; i++) {
        if(this.state.alarmList[i]._id == value) {
          this.state.alarmList[i].read = true;
          break;
        }
      }
    },
    deleteAlarm: function(state, value) {
      for(let i = 0; i < this.state.alarmList.length; i++) {
        if(this.state.alarmList[i]._id == value) {
          this.state.alarmList.splice(i, 1);
          break;
        }
      }
    },
    setAlarms: function(state, value) {
      this.state.alarmList = value;
    },
    setTrades: function(state, value){
      this.state.trades = value;
    },
    setUser(state, user){
      this.state.user = user
      console.log('VUEX setUser :',this.state.user);
    },
    setIsLogged(state, value){
      this.state.isLogged = value;
    },
    removeUser(){
      this.state.user = {}
    }
  },
});