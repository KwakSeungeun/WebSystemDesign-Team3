<template>
  <div id="top-nav">
    <b-navbar toggleable="md">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="/">아주대 중고책 장터</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">          
        <b-navbar-nav>
          <b-nav-item><router-link to="/">책 장터</router-link></b-nav-item>
          <b-nav-item><router-link to="/sell">내 책 팔기</router-link></b-nav-item>
          <b-nav-item><router-link to="/select/buyer">구매자 선택</router-link></b-nav-item>
          <b-nav-item><router-link to="/mysale">내 장터 현황</router-link></b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-button-group v-if="!isLogged" size="sm" class="mb-auto">
            <b-btn @click="openLoginModal">로그인</b-btn>
            <b-btn @click="openRegisterModal">회원가입</b-btn>
          </b-button-group>
          <b-button-group v-if="isLogged" size="sm" class="mb-auto">
            <b-btn type="submit" @click="onLogout">로그아웃</b-btn>
            <b-btn @click="openUpdateModal">내 정보</b-btn>
            <b-btn @click="openAlarmModal">알람 <b-badge variant="light" v-if="notice > 0">{{notice}}</b-badge></b-btn>
          </b-button-group>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-modal
      no-close-on-backdrop
      centered
      ref="authModal"
      size="lg"
      title="이메일 인증 필요"
      hide-footer
      id="authModal">
      <p>아직 이메일 인증을 완료하지 못했습니다. 아주메일로 계정을 인증하세요!<br>
      <b>인증메일이 도착하지 않았다면 다시 회원가입을 진행 해 주세요!</b>
      </p>
      <div class="row-align">
        <a style="flex:1" href="https://www.google.com/gmail/">이메일 인증하기</a> 
        <!-- <button style="flex:1" class="round-btn" @click="sendAuthMail">인증메일 다시 받기</button>  -->
      </div>
    </b-modal>
    <b-modal
      no-close-on-backdrop
      centered
      ref="loginRef"
      size="md"
      title="로그인"
      hide-footer
      id="loginModal">
      <login-form></login-form>
    </b-modal>
    <b-modal
      no-close-on-backdrop
      centered
      ref="registerRef"
      size="md"
      title="회원가입"
      hide-footer
      id="registerModal">
      <register-form v-bind:errMsg="errMsg"></register-form>
    </b-modal>
    <b-modal hide-footer ref="logoutModal" centered>
      <p>로그아웃 되었습니다.</p>
    </b-modal>
    <b-modal
      no-close-on-backdrop
      centered
      ref="userInfoModal"
      size="md"
      title="회원 정보"
      hide-footer
      id="userInfoModal">
      <p>유저 정보</p>
      <user-info />
    </b-modal>
    <b-modal
      no-close-on-backdrop
      centered
      ref="alarmDetailsRef"
      size="lg"
      title="알람"
      hide-footer
      id="alarmDetails">
      <alarm-details @exit="hideAlarmModal"></alarm-details>
    </b-modal>
    <pulse-loader :loading="loading" class="center"></pulse-loader>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import LoginForm from "../modal/LoginForm"
import RegisterForm from "../modal/RegisterForm";
import AlarmDetails from "../modal/AlarmDetails";
import UserInfo from "../modal/UserInfo"
import Vue from 'vue'

const Push = require('push.js');

export default {
  name:"top-nav",
  data : ()=>({
    searchText: '',
    loading: false,
    errMsg : ''
  }),
  components:{
      UserInfo,
    LoginForm,
    RegisterForm,
    AlarmDetails,
    PulseLoader
  },
  computed: {
    isLogged: function() {
        return this.$store.state.isLogged;
    },
    notice: function() {
        return this.$store.state.notice;
    },
    alarmList: function() {
        return this.$store.state.alarmList;
    }
  },
  methods: {
    openLoginModal: function(){
      this.$refs.loginRef.show();
    },
    openRegisterModal: function(){
      this.$refs.registerRef.show();
    },
    openUpdateModal: function(){
      this.$EventBus.$emit('user_info_update');
      this.$refs.userInfoModal.show();
    },
    openAlarmModal: function(){
      this.$refs.alarmDetailsRef.show();
    },
    hideAlarmModal: function() {
      this.$refs.alarmDetailsRef.hide();
    },
    openErrModal: function(value){
      this.errMsg = value;
    },
    onLogout: function(){
      this.$session.destroy();
      this.$store.commit('setIsLogged',this.$session.exists());
      this.$store.commit('setUser',{});
      this.$localStorage.remove('loginUser');
      this.$localStorage.remove('token');
      this.$refs.logoutModal.show();
      this.$router.push('/');
    },
    login: async function(uemail, upw){
      let checkLogin = false;
      await this.$http.post(`${this.$config.serverUri}auth/login`,{
        email: uemail,
        pw : upw
      }).then(async(res)=>{
        console.log('res',res)
        if(res.status == 200 && res.data.token != null) {
          this.$http.defaults.headers.common['x-access-token'] = res.data.token;
          this.$session.set('token', res.data.token);
          this.$localStorage.set('token', res.data.token);
          this.$store.commit('setIsLogged',this.$session.exists());

          this.$http.get(`${this.$config.serverUri}user/alarms`).then(res => {
            this.$store.commit('setAlarms', res.data.alarms);
            this.$store.commit('setNoticeZero');
            for(let i = 0; i < this.alarmList.length; i++) {
                if(this.alarmList[i].read == false) this.$store.commit('noticeIncrease');
            }
          }).catch(err => {
          });
        }
        this.$refs.loginRef.hide();
        this.loading = false;
      }).catch((err)=>{
        let msg = err.response.data.message;
        if(msg.includes('auth')){
          console.log('이메일 인증 실패');
          this.$refs.authModal.show();
          this.loading = false;
          return;
        }
        console.log("catch",err.response);
        alert("로그인에 실패했습니다. 다시 한 번 해주세요!")
        this.$store.commit('setIsLogged',this.$session.exists());
        this.loading = false;
      });
      if(true){
        console.log("유저정보 저장하는거")
        let user_obj = await this.getUser(uemail);
        this.$localStorage.set('loginUser', JSON.stringify(user_obj));
        this.$store.commit('setUser',user_obj);
      }
    },
    getUser: function(email){
      return new Promise((resolve, reject)=>{
        this.$http.get(`${this.$config.serverUri}user/`)
        .then(res=>{
          resolve(res.data)
        })
        .catch(err=>{
          console.log("유저 받아오는데 오류",err.response)
          reject(err)
          });
      });
    }
  },
  created: async function(){
    if (this.$localStorage.get('loginUser') != null) {
      let loggedUser = JSON.parse(this.$localStorage.get('loginUser'))
      let token = this.$localStorage.get('token');

      this.$http.defaults.headers.common['x-access-token'] = token;
      this.$store.commit('setUser', loggedUser);
      this.$session.set('token', token);
      this.$store.commit('setIsLogged',this.$session.exists());

      this.$http.get(`${this.$config.serverUri}user/alarms`).then(res => {
        this.$store.commit('setAlarms', res.data.alarms);
        this.$store.commit('setNoticeZero');
        for(let i = 0; i < this.alarmList.length; i++) {
          if(this.alarmList[i].read == false) this.$store.commit('noticeIncrease');
        }
      }).catch(err => {
      });
    }

    setInterval(()=>{
      this.$http.get(`${this.$config.serverUri}user/alarms`).then(res => {
        let dic = {};
        let flag = false;
        for(let i = 0; i < this.alarmList.length; i++) dic[this.alarmList[i]._id] = 1;
        for(let i = 0; i < res.data.alarms.length; i++) {
        if(dic[res.data.alarms[i]._id] != 1) {
            this.$store.commit('addAlarm', res.data.alarms[i]);
            if(res.data.alarms[i].read == false) this.$store.commit('noticeIncrease');
            flag = true;
          }
        }
        if(flag) {
            this.$notify({
                group: 'alarm_notice',
                title: '새로운 알람이 도착했습니다!',
                text: '알람을 확인해주세요.'
            });

            Push.create("새로운 알람이 도착했어요!!!", {
                body: "알람을 확인해주세요!",
                //icon: "",
                timeout: 5000,
                onClick: function() {
                    console.log(this);
                }
            });
        }
      }).catch(err => {
        if(err.response.data.message === "login_expired"){
          this.$http.defaults.headers.common['x-access-token'] = null;
          this.onLogout();
        }
      });
    }, 10000);

    this.$http.get(`${this.$config.serverUri}user/alarms`).then(res => {
      this.$store.commit('setAlarms', res.data.alarms);

      this.$store.commit('setNoticeZero');
      for(let i = 0; i < this.alarmList.length; i++) {
        if(!this.alarmList[i].read) this.$store.commit('noticeIncrease');
      }
    }).catch(err => {
        this.$store.commit('setNoticeZero');
        console.log(err.response, " ", "alarm fail");
    });

    this.$EventBus.$on("login", async(data) => {
      this.login(data.email, data.pw)
      this.loading = true;
    });
    
    this.$EventBus.$on("register", async data => {
      const email = data.email;
      const pw = data.pw;
      const phone = data.phone;
      const preference = data.preference;
      const name = data.name;
      
      this.loading = true;
      await this.$http.post(`${this.$config.serverUri}auth/register`,{
          email : email,
          pw: pw,
          phone: phone,
          preference: preference,
          name: name
      }).then((res)=>{
        console.log("res",res);
        this.$refs.registerRef.hide(); 
        this.loading = false;
      }).catch((err)=>{
        if(err.response.data && err.response.data.success.includes("already")){
          console.log('이미 존재하는 이메일');
          this.openErrModal('이미 존재하는 계정입니다!')
          this.loading = false;
          return;
        }
        if(err.response.data && err.response.data.success.includes("email_valid_fail")){
          console.log('이메일 형식');
          this.openErrModal('@ajou.ac.kr 형식을 맞춰 주세요!');
          this.loading = false;;
          return;
        }
        this.errMsg = '';
        console.log("catch",err.response);
        alert("회원가입에 실패했습니다. 다시 한 번 해주세요!")
        this.loading = false;
      });
    });
  },
  beforeDestroy: function(){
    this.$EventBus.$off("login");
    this.$EventBus.$off("register");
  }
}
</script>

<style>
#top-nav{
  text-align: left;
  background: rgb(224, 224, 224, 0.6);
}
.center{
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 1000000;
}
b-nav-item{
  color: #E74C3C;
}
</style>
