<template>
  <div id="app">
    <div v-responsive.lg.xl.md class="header"></div>
    <top-nav></top-nav> <!-- 시간 되면 animation 넣기 -->
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
import LoginForm from './components/modal/LoginForm'
import RegisterForm from './components/modal/RegisterForm'
import VueRouter from 'vue-router'

Vue.use(BootstrapVue);
Vue.directive('responsive', vueResponsive)

export default {
  name: 'app',
  components: {
    TopNav,
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
  background: white;
  height: 100vh;
}
.header{
  background-image: url('../public/images/background.jpg'); 
  background-size: cover;
  height: 150px;
  margin-top: 0;
  text-align: center;
  opacity: 0.8!important;
  color: rgb(0, 29, 53);
}

#contents{
  height: 70%;
  width: 100%;
  overflow-y: scroll;
}
</style>
