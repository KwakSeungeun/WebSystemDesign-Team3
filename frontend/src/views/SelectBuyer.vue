<template>
    <div id="select-buyer">
        <div v-if="isLogged">
            <div v-for="matching in myMatcingList" :key="matching._id">
                <match-card v-bind:match="matching"></match-card>
                <button  v-b-modal.closeTrade class="rount-btn">장터 종료하기</button>
            </div>
        </div>
        <div v-else>
            <h1>로그인 시 이용 가능한 서비스 입니다.</h1>
        </div>
        <b-modal id="closeTrade" ref="closeTrade" title="장터 종료하기" hide-footer centerd>
            <p>지금 장터를 종료하면 이 책을 선택한 다른 사용자들과의 거래가 불가능 합니다.</p>
            <div class="row-align">
                <button @click="closeModal" style="width: 50%;" class="rount-btn blue">취소</button>
                <button @click="closeTrade" style="width: 50%;" class="rount-btn">장터 종료하기</button>
            </div>
        </b-modal>
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
        closeModal: function(){
            this.$refs.closeTrade.hide();
        },
        closeTrade: function(){
            // this.$axios.post(`${this.$config.serverUri}trade/close`)
            // .then(res=>{

            // })
            // .catch(err=>{

            // });
        }
    },
    created: async function(){
        if(this.$session.exists()){
            let User = this.$store.state.user;
            await this.$http.get(`${this.$config.serverUri}trade/my_trade_list/${User._id}`)
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
