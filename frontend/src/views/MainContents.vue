<template>
    <div id="main" ref="main">
        <button class="floating-btn" @click="scrollToTop"></button>
        <div style="margin:2% 20% 2% 20%;">
            <div class="row-align">
                <div class="row-item" style="flex: 2;">
                    <b-form-input v-model="searchText" placeholder="찾고 싶은 책을 검색해 보세요!"></b-form-input>
                </div>
                <div class="row-item" >
                    <b-button @click="onSearch">검색</b-button>
                </div>
                <div class="row-item">
                    <b-dropdown id="filter" text="필터" style="width: 150px;">
                        <b-dropdown-item-button @click="filtering('update','업데이트 순')">업데이트 순</b-dropdown-item-button>
                        <b-dropdown-item-button @click="filtering('state','책 상태 순')">책 상태 순</b-dropdown-item-button>
                        <b-dropdown-item-button @click="filtering('price', '최저가 순')">최저가 순</b-dropdown-item-button>
                        <b-dropdown-item-button @click="filtering('priceDesc','최고가 순')">최고가 순</b-dropdown-item-button>
                    </b-dropdown>
                </div>
                <div v-if="filterMode" class="row-item" style="color: #1B4F72; padding-top: 10px;">
                    <p><b>{{filterMode}}</b></p>
                </div>
                <br>
            </div>
        </div>
        <div class="list-container">
            <button  v-for="trade in filteringTrades" :key="trade.id" class="card-container">
                <router-link style="text-decoration:none !important;" 
                    :to="{name: 'trade-details', params:{id: trade._id}}">
                    <book-card :trade="trade"></book-card>
                </router-link>
            </button>
        </div>
        <div class="outline" v-if="filteringTrades.length==0 && !noResult">
            <h4>현재 등록된 책 장터가 없습니다!<br>지금 책을 등록해 보세요!</h4>
        </div>
        <div class="outline" v-if="filteringTrades.length==0 && noResult">
            <h4>검색 결과가 없습니다.</h4>
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
            filteringTrades: [],
            noResult : false,
            filterMode : ''
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
            this.filteringTrades = _.filter(this.filteringTrades, trade=>{
                return trade.title.includes(this.searchText) 
                        || trade.author.includes(this.searchText)   
                        || trade.tag.includes(this.searchText);
            });
            if(this.filteringTrades.length == 0) this.noResult = true;
        },
        filtering: function(mode, value){
            this.filterMode = value;
            if(mode === 'update'){
                this.filteringTrades = _.orderBy(this.filteringTrades, ['time_stamp'], ['desc']);
            }
            else if(mode === 'price'){
                this.filteringTrades = _.orderBy(this.filteringTrades, ['price'], ['asc']);
            }
            else if(mode === 'priceDesc'){
                this.filteringTrades = _.orderBy(this.filteringTrades, ['price'], ['desc']);
            } 
            else if(mode === 'state'){
                this.filteringTrades = _.orderBy(this.filteringTrades,['state'],['desc']);
            }
        }
    },
    created(){
        this.getBookList().then(result=>{
            this.$store.commit('setTrades',result);
            this.$localStorage.set('trades', JSON.stringify(result));
            this.noResult = false;
            if(!this.filteringTrades) {
                return;
            } else{
                this.filteringTrades = _.filter(this.$store.state.trades, { 'status': 0 }); //expire 된 거 보여주기
                this.filteringTrades = _.orderBy(this.filteringTrades, ['time_stamp'], ['desc']);
            }
        });
    },  
    watch: {
        searchText: function(){
            if(!this.searchText){
                this.filteringTrades = _.filter(this.$store.state.trades, { 'status': 0 }); //expire 된 거 보여주기
                this.filteringTrades = _.orderBy(this.filteringTrades, ['time_stamp'], ['desc']);
                this.noResult = false;
            }
        }
    } 
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
        width: calc(100%/3 - 20px);
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
