<template>
    <div id="select-buyer">
        <div v-if="isLogged">
            <div v-for="matching in myMatcingList" :key="matching._id">
                <match-card v-bind:match="matching"></match-card>
            </div>
        </div>
        <div v-else>
            <h1>로그인 시 이용 가능한 서비스 입니다.</h1>
        </div>
    </div>
</template>

<script>
import MatchCard from '../components/card/MatchCard.vue'
import _ from 'lodash'

export default {
    name: 'select-buyer',
    components:{
        MatchCard,
    },
    data: function(){
        return{
            myMatcingList : [],
            myTrades : []
        }
    },
    computed: {
        isLogged: function(){
            return this.$store.state.isLogged;
        }
    },
    created: async function(){
        if(this.$session.exists() || this.$store.state.user){
            let User = this.$store.state.user;
            await this.$http.get(`${this.$config.serverUri}trade/my_trade_list/${User.data._id}`)
            .then(res=>{
                this.myTrades = res.data.trade_list;
                console.log('결과:',this.myTrades);
            })
            .catch(err=>{
                console.log("Call my trade error\n",err.response);
            });
            this.myMatcingList = _.filter(this.myTrades, { 'status': 1 }); //expire 된 거 보여주기
            console.log('maching중인 list : ',this.myMatcingList)
        } else {
            this.myTrades = [];
            this.myMatcingList = [];
        }
    }
}
</script>

<style>
#select-buyer{
    background: green;
    margin-left: 2%;
    margin-right: 2%;
}
</style>
