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
    setUserUpdate: function(state, value) {
      for(let key of Object.keys(value)) {
        if(key == 'a_pw' || key == 'b_pw') continue;
        this.state.user[key] = value[key];
      }
    },
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
    addAlarm: function(state, value) {
      this.state.alarmList.push(value);
    },
    setAlarms: function(state, value) {
      this.state.alarmList = value;
    },
    setTrades: function(state, value){
      this.state.trades = value;
    },
    setUser(state, user){
      this.state.user = user
    },
    setIsLogged(state, value){
      this.state.isLogged = value;
    },
    removeUser(){
      this.state.user = {}
    }
  },
});