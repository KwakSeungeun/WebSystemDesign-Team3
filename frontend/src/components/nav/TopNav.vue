<template>
  <div id="top-nav">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">아주대 중고책 장터</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">          
        <b-navbar-nav>
          <b-nav-item><router-link to="/">책 장터</router-link></b-nav-item>
          <b-nav-item><router-link to="/sell">내 책 팔기</router-link></b-nav-item>
          <b-nav-item><router-link to="/mysale">내 거래 현황</router-link></b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-button-group size="sm" class="mb-auto">
            <b-btn v-b-modal.loginModal>로그인</b-btn>
            <b-btn v-b-modal.registerModal>회원가입</b-btn>
          </b-button-group>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name:"top-nav",
  data : ()=>({
    searchText: '',
  }),
  methods: {
    onSearch(){
      alert('serch:'+this.searchText);
    }
  }
}
</script>

<style>
#top-nav{
  text-align: center;
}
</style>
