<template>
    <div id="main" ref="main">
        <button class="floating-btn" @click="scrollToTop"></button>
        <b-container class="mx-auto mb-3 mt-3">
            <b-row>
                <b-col sm="7">
                    <b-form-input v-model="searchText" placeholder="찾고 싶은 책을 검색해 보세요!"></b-form-input>
                </b-col>
                <b-col sm="1">
                    <b-button @click="onSearch">검색</b-button>
                </b-col>
                <b-col sm="4">
                    <b-dropdown id="filter" text="필터">
                        <b-dropdown-item-button @click="filtering('update')">업데이트 순</b-dropdown-item-button>
                        <b-dropdown-item-button @click="filtering('price')">가격 낮은 순</b-dropdown-item-button>
                        <b-dropdown-item-button @click="filtering('priceDesc')">가격 높은 순</b-dropdown-item-button>
                    </b-dropdown>
                </b-col>
            </b-row>
        </b-container>
        <div class="list-container">
            <button  v-for="trade in filteringTrades" :key="trade.id" class="card-container">
                <router-link style="text-decoration:none !important;" 
                    :to="{name: 'trade-details', params:{id: trade._id}}">
                    <book-card :trade="trade"></book-card>
                </router-link>
            </button>
        </div>
        <div class="outline" v-if="filteringTrades.length==0">
            <h4>현재 등록된 책 장터가 없습니다!<br>지금 책을 등록해 보세요!</h4>
        </div>
    </div>
</template>

<script>
import BookCard from '../components/card/BookCard'
import _ from 'lodash'

export default {
    name:'main-contents',
    components: {
        BookCard,
    },
    data: function(){
        return{
            searchText: '',
            filteringTrades: []
        }
    },
    methods:{
        scrollToTop: function(){
            this.$refs.main.scrollTop = 0;
        },
        getBookList: function(){
            return new Promise(async(resolve, reject)=>{
                await this.$http.get(`${this.$config.serverUri}trade/trade_list`)
                .then(response=>{
                    resolve(response.data.trade_list)
                })
                .catch(err=>{
                    reject(err);
                });
            });
        },
        onSearch: function(){
            console.log(this.searchText);
        },
        filtering: function(mode){
            if(mode === 'update'){
                this.filteringTrades = _.orderBy(this.filteringTrades, ['time_stamp'], ['desc']);
            }
            else if(mode === 'price'){
                this.filteringTrades = _.orderBy(this.filteringTrades, ['price'], ['asc']);
            }
            else if(mode === 'priceDesc'){
                this.filteringTrades = _.orderBy(this.filteringTrades, ['price'], ['desc']);
            }
        }
    },
    created(){
        this.getBookList().then(result=>{
            this.$store.commit('setTrades',result);
            this.$localStorage.set('trades', JSON.stringify(result));
            this.filteringTrades = _.filter(this.$store.state.trades, { 'status': 0 }); //expire 된 거 보여주기
            this.filteringTrades = _.orderBy(this.filteringTrades, ['time_stamp'], ['desc']);
        });
    },   
}
</script>


<style>
#main{
    background: white;
    width: 100%;
}
.list-container{
    margin: 2%;
}
.card-container{
    background: white;
    border: 0;
    outline: 0;
    margin: 10px;
}
/* smart phone */
 @media only screen and (max-width : 320px){
     .card-container{
        width: calc(100% - 20px);
        height: 800px;
    }
 }
/* pad and desktop */
 @media only screen and (min-device-width : 768px){
     .card-container{
        width: calc(100%/2 - 20px);
        height: 700px;
    }
 }

.floating-btn{
  background: url( "../../public/images/topIcon.png" ) no-repeat;
  background-size: cover;
  border: none;
  width: 32px;
  height: 32px;
  position: absolute;
  bottom: 30px;
  right: 30px;
}
</style>
