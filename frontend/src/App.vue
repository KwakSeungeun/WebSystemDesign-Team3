<template>
  <div id="app">
    <top-nav style="margin-bottom:1vh;"></top-nav>
    <b-container fluid v-responsive.lg.xl.md>
      <b-row >
        <b-col cols="2">
          <side-nav></side-nav>
        </b-col>
        <b-col cols="10">
          <main-contents></main-contents>
        </b-col>
      </b-row>
    </b-container>
    <!-- smartphone -->
    <div v-responsive.sm.xs>
      <b-btn v-b-toggle.phone class="side-nav-container">메뉴</b-btn>
      <b-collapse id="phone">
        <side-nav></side-nav>
      </b-collapse>
    </div>
    <!-- modals -->
    <b-modal no-close-on-backdrop centered ref="loginRef"
                size="md" title="로그인" hide-footer id="loginModal">
      <login-form></login-form>
    </b-modal>
    <b-modal no-close-on-backdrop centered ref="registerRef"
        size="md" title="회원가입" hide-footer id="registerModal">
      <register-form></register-form>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import vueResponsive from 'vue-responsive'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import TopNav from './components/nav/TopNav'
import SideNav from './components/nav/SideNav'
import MainContents from './components/contents/MainContents'
import LoginForm from './components/modal/LoginForm'
import RegisterForm from './components/modal/RegisterForm'

Vue.use(BootstrapVue);
Vue.directive('responsive', vueResponsive)

export default {
  name: 'app',
  components: {
    TopNav,
    SideNav,
    MainContents,
    LoginForm,
    RegisterForm
  },
  created(){
    this.$EventBus.$on('login',(data)=>{
      //data is login info
      //here is connect login api
      this.$refs.loginRef.hide() //if success login
      console.log("DATA :",data);
    });
    
    this.$EventBus.$on('register',(data)=>{
      //data is register info
      //here is connect register api
      this.$refs.registerRef.hide() //if success login
      console.log("DATA :",data);
    });
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  word-break:keep-all;
  overflow-y: hidden;
  background: yellowgreen;
  height: 100vh;
}
</style>
