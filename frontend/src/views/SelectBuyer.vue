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
    methods:{
    },
    created: async function(){
        this.$EventBus.$on("successMatching", () => {
            this.myMatcingList = _.filter(this.myTrades, { 'status': 1 }); //expire 된 거 보여주기
        });

        if(this.$session.exists()){
            let User = this.$store.state.user;
            await this.$http.get(`${this.$config.serverUri}trade/my_trade_list`)
            .then(res=>{
                this.myTrades = res.data.trade_list;
                console.log('결과:',this.myTrades);
            })
            .catch(err=>{
                console.log("Call my trade error\n",err.response);
            });
            this.myMatcingList = _.filter(this.myTrades, { 'status': 1 }); //expire 된 거 보여주기
            this.myMatcingList = _.orderBy(this.myMatcingList, ['time_stamp'], ['desc']);
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
    margin-left: 2%;
    margin-right: 2%;
}
</style>
