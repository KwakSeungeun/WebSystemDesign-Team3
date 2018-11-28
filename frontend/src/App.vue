<template>
  <div id="app">
    <div v-responsive.lg.xl.md class="header">
      <h1 class="pt-5">아주대 중고책장터 이미지 같은거 넣기</h1>
    </div>
    <top-nav></top-nav>
    <div id="contents">
      <router-view></router-view>
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
import MainContents from './components/contents/MainContents'
import LoginForm from './components/modal/LoginForm'
import RegisterForm from './components/modal/RegisterForm'
import VueRouter from 'vue-router'

Vue.use(BootstrapVue);
Vue.directive('responsive', vueResponsive)

export default {
  name: 'app',
  components: {
    TopNav,
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
.header{
  background: #0277bd ;
  color: whitesmoke;
  margin-top: 0;
  height: 150px;
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
}

#contents{
  height: 70%;
  width: 100%;
  overflow-y: scroll;
}
</style>
