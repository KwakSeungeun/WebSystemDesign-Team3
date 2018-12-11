<template>
  <div id="app">
    <div v-responsive.lg.xl.md class="header"></div>
    <!-- 시간 되면 animation 넣기 -->
    <div id="contents">
      <top-nav></top-nav>
      <router-view></router-view>
    </div>
    <notifications group="alarm_notice" position="bottom left"/>
  </div>
</template>

<script>
import Vue from "vue";
import vueResponsive from "vue-responsive";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import TopNav from "./components/nav/TopNav";
import VueRouter from "vue-router";

Vue.use(BootstrapVue);
Vue.directive("responsive", vueResponsive);

export default {
  name: "app",
  components: {
    TopNav,

  },
  created() {
    this.$store.commit('setTrades',JSON.parse(this.$localStorage.get('trades')));
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
  height: calc(100vh - 150px);
  width: 100%;
  overflow-y: scroll;
}
</style>
