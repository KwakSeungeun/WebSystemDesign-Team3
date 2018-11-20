<template>
  <div id="top-nav">
      <b-navbar variant="primary">
        <b-navbar-brand tag="h1">아주대 중고책 거래 장터</b-navbar-brand>
        <b-nav-form>
          <b-input v-model="searchText" type="text" placeholder="원하는 책을 검색해 보세요!"></b-input>
          <b-btn @click="onSearch" variant="success">검색</b-btn>
        </b-nav-form>
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
    onSearch:()=>{
      alert('serch')
    }
  }
}
</script>

<style>
#top-nav{
  text-align: center;
}
</style>
