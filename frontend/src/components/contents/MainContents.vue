<template>
    <div id="main">
        <div v-for="trade in filteringTrades" :key="trade.id" class="list-container">
            <button class="card-container" @click="cardClick(trade)">
                <book-card :trade="trade"></book-card>
            </button>
        </div>
    </div>
</template>

<script>
import BookCard from '../card/BookCard'
// cofig.js 에서 서버 url 저장해 둔 뒤, 붙여서 사용하기
const url = 'http://localhost:3000/'

export default {
    components: {
        BookCard
    },
    data:()=>({
        filteringTrades: [] // 실제 화면에 보여질 list
    }),
    methods:{
        cardClick: function(trade){
            console.log("CARD CLICK!",trade) //세부 페이지 router  /  여기서 경매 참여하기 modal
        },
        getBookList: function(){
            return new Promise(async(resolve, reject)=>{
                await this.$http.get(`${url}trade/trade_list`)
                .then(response=>{
                    resolve(response.data.trade_list)
                })
                .catch(err=>{
                    reject(err);
                });
            });
        }
    },
    created(){
        this.getBookList().then(result=>{
            console.log("CREATED! and get booklist",result);
            this.$store.commit('setTrades',result);
            this.filteringTrades = result; // 경매 진행중인 것만 filtering 하는 code update, status 이용해서 작업
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
    background: yellow;
    margin-left: 5%;
    margin-right: 5%;
}
/* smart phone */
 @media only screen and (max-width : 320px){
     .card-container{
        background: gray;
        border: 0;
        outline: 0;
        margin: auto;
        width: calc(100% - 40px);
        height: 450px;
        margin: 10px;
    }
 }
/* pad */
 @media only screen and (min-device-width : 768px) and (max-device-width : 1024px){
     .card-container{
        background: gray;
        border: 0;
        outline: 0;
        margin: auto;
        width: calc(100%/2 - 40px);
        height: 450px;
        margin: 10px;
    }
 }
/* desktop */
 @media only screen and (min-width : 1224px){
     .card-container{
        background: gray;
        border: 0;
        outline: 0;
        margin: auto;
        width: calc(100%/3 - 40px);
        height: 450px;
        margin: 10px;
    }
 }
</style>
