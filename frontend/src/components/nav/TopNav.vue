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
            <b-btn @click="onLogout">로그아웃</b-btn>
            <b-btn @click="openUpdateModal">내 정보</b-btn>
            <b-btn @click="openAlarmModal">알람</b-btn>
          </b-button-group>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
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
      <register-form></register-form>
    </b-modal>
    <b-modal hide-footer ref="logoutModal" centered>
      <p>로그아웃 되었습니다.</p>
    </b-modal>
    <pulse-loader :loading="loading" class="center"></pulse-loader>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import LoginForm from "../modal/LoginForm"
import RegisterForm from "../modal/RegisterForm";
import config from "../../config"
import Vue from 'vue'

export default {
  name:"top-nav",
  data : ()=>({
    searchText: '',
    loading: false,
  }),
  components:{
    LoginForm,
    RegisterForm,
    PulseLoader
  },
  computed: {
    isLogged: function(){
      return this.$store.state.isLogged;
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
      alert('내 정보 수정');
    },
    openAlarmModal: function(){
      alert('알람 정보 보기');
    },
    onLogout: function(){
      this.$session.destroy();
      this.$store.commit('setIsLogged',this.$session.exists());
      this.$refs.logoutModal.show();
    }
  },
  created: function(){
    if (this.$session.exists()) {
      console.log("이미 로그인 되어 있다!")
      this.$store.commit('setIsLogged',this.$session.exists());
      this.$http.defaults.headers.common['x-access-token'] = this.$session.get('token');
    }
    this.$EventBus.$on("login", async(data) => {
      const uemail = data.email;
      const upw = data.pw;
      
      this.loading = true;
      await this.$http.post(`${config.serverUri}auth/login`,{
        email: uemail,
        pw : upw
      }).then((res)=>{
        console.log('res',res)
        if(res.status == 200 && res.data.token != null) {
          this.$session.set('token', res.data.token);
          this.$http.defaults.headers.common['x-access-token'] = res.data.token;
          this.$store.commit('setIsLogged',this.$session.exists());
        }
        this.$refs.loginRef.hide();
        this.loading = false;
      }).catch((err)=>{
        console.log("catch",err);
        alert("로그인에 실패했습니다. 다시 한 번 해주세요!")
        this.$store.commit('setIsLogged',this.$session.has('token'));
      });
    });
    
    this.$EventBus.$on("register", async data => {
      const email = data.email;
      const pw = data.pw;
      const phone = data.phone;
      const preference = data.preference;
      const name = data.name;
      console.log("DATA!! :", pw);
      
      this.loading = true;
      await this.$http.post(`${config.serverUri}auth/register`,{
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
}
.center{
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 1000000;
}
</style>
