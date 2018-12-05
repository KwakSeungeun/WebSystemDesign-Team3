<template>
  <div id="app">
    <div v-responsive.lg.xl.md class="header"></div>
    <top-nav></top-nav>
    <!-- 시간 되면 animation 넣기 -->
    <div id="contents">
      <router-view></router-view>
    </div>
    <!-- modals -->
    <b-modal
      no-close-on-backdrop
      centered
      ref="loginRef"
      size="md"
      title="로그인"
      hide-footer
      id="loginModal"
    >
      <login-form></login-form>
    </b-modal>
    <b-modal
      no-close-on-backdrop
      centered
      ref="registerRef"
      size="md"
      title="회원가입"
      hide-footer
      id="registerModal"
    >
      <register-form></register-form>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import vueResponsive from "vue-responsive";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import TopNav from "./components/nav/TopNav";
import LoginForm from "./components/modal/LoginForm";
import RegisterForm from "./components/modal/RegisterForm";
import VueRouter from "vue-router";

Vue.use(BootstrapVue);
Vue.directive("responsive", vueResponsive);

export default {
  name: "app",
  components: {
    TopNav,
    LoginForm,
    RegisterForm
  },
  created() {
    this.$EventBus.$on("login", async( data) => {
      console.log("DATA :", data);
      const uemail = data.email;
      const upw = data.pw;
      
    });

    this.$EventBus.$on("register", async data => {
      //data is register info
      //here is connect register api
      const email = data.email;
      const pw = data.pw;
      const phone = data.phone;
      const preference = data.preference;
      const name = data.name;
      console.log("DATA!! :", pw);
      try {
        await this.$http.post("http://localhost:3000/auth/register", {
          email,
          pw: pw,
          phone,
          preference,
          name
        });
      } catch (err) {
        console.log(err.response);
      }
      this.$refs.registerRef.hide(); //if success login
    });
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  word-break: keep-all;
  overflow-y: hidden;
  background: white;
  height: 100vh;
}
.header {
  background-image: url('../public/images/background.jpg'); 
  background-size: cover;
  margin-top: 0;
  height: 150px;
  opacity: 0.8 !important;
}

#contents {
  height: 70%;
  width: 100%;
  overflow-y: scroll;
}
</style>
