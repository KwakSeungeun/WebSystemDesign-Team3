<template>
  <div id="top-nav">
    <b-jumbotron>
      <template slot="header">아주대 중고 책 장터</template>
      <div v-responsive.lg.xl.md slot="lead">
        아주대 학생들의 중고책 전공 서적 및 교양책 등 책 거래 장터 입니다!
      </div>
      <!-- <hr class="my-4"> -->
    </b-jumbotron>
  </div>
</template>

<script>
import Vue from 'vue'
import vueResponsive from 'vue-responsive'

Vue.directive('responsive', vueResponsive)

export default {
  name:"top-nav",
  components: {
    
  }
}
</script>

<style>
#top-nav{
  text-align: center;
}
</style>
