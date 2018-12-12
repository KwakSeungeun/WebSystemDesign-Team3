<template>
    <div id="select-buyer">
        <div v-if="isLogged">
            <div v-for="matching in myMatcingList" :key="matching._id">
                <match-card v-bind:match="matching"></match-card>
            </div>
            <div v-if="myMatcingList.length==0">
                <div class="outline">
                    <h4>등록된 책 장터가 없습니다.<br> 책을 장터에 등록해 쓰지 않는 책을 팔아보세요!</h4>
                    <router-link to="/sell">책 등록하기</router-link>
                </div>
            </div>
        </div>
        <div v-else class="outline">
            <h4>로그인 시 이용하실 수 있는 서비스 입니다.</h4>
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
        if(this.$session.exists()){
            let User = this.$store.state.user;
            await this.$http.get(`${this.$config.serverUri}trade/my_trade_list`)
            .then(res=>{
                this.myTrades = res.data.trade_list;
            })
            .catch(err=>{
                console.log("Call my trade error\n",err.response);
            });
            console.log(this.myTrades);
            let tmpArr = [];
            tmpArr = tmpArr.concat(_.filter(this.myTrades, { 'status': 1 })); //expire 된 거 보여주기
            tmpArr = tmpArr.concat(_.filter(this.myTrades, { 'status': 0 })); //거래중인 거 보여주기
            this.myMatcingList = tmpArr;
            console.log(this.myMatcingList);

            console.log(this.myTrades);
            this.myMatcingList = _.orderBy(this.myMatcingList, ['time_stamp'], ['desc']);
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
.outline{
    margin: 20% 10% 20% 10%;
    border-radius: 10px;
    padding: 20px;
    border: 2px solid gray;
    text-align: center;
}
</style>
