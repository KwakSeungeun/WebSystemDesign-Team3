<template>
  <div id="app">
    <top-nav></top-nav>
    <!-- desktop and pad --> 
    <div v-responsive.lg.xl.md class="large-container">
      <side-nav style="flex:1;"></side-nav>
      <main style="flex:10;"></main>
    </div>
    
    <!-- smartphone -->
    <div v-responsive.sm.xs>
      <b-btn v-b-toggle.phone class="side-nav-container">메뉴</b-btn>
      <b-collapse id="phone">
        <side-nav></side-nav>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import TopNav from './components/nav/TopNav'
import SideNav from './components/nav/SideNav'
import Main from './components/contents/Main'

Vue.use(BootstrapVue);

export default {
  name: 'app',
  components: {
    TopNav,
    SideNav,
    Main
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  word-break:keep-all;
  overflow: hidden;
  background: yellowgreen;
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
}

.large-container{
  background: yellow;
  display: flex;
  flex-direction: row;
  width: 100%;
}
</style>
