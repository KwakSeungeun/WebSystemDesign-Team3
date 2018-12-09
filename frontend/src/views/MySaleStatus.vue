<template>
  <div class="pl-10" id="whole">
    <div v-if="isLogged">
      <b-form-radio-group
        id="radios1"
        v-model="selected"
        :options="options"
        name="radioOpenions"
        class="wid-50"
      ></b-form-radio-group>
      <div class="mt-3">
      </div>
        <!--구매자 경우에는 책 정보랑 판매자 정보 날짜 -->
        {{computedList}}
        <!--판매자 경우에는 책 정보랑 구매자 정보 날짜 -->
    </div>
    <div v-else-if="!isLogged" class="outline">
      <h4>로그인 시 이용하실 수 있는 서비스 입니다.</h4>
    </div>
  </div>
</template>

<script>
import MatchCard from "../components/card/MatchCard";
import _ from "lodash";
//전체 0 1 2 3

export default {
  data() {
    return {
      Trades: [],
      seller_trades:[],
      buyer_trades:[],
      selected: 0,
      options: [
        { text: "구매자", value: 0 },
        { text: "판매자", value: 1 },
      ]
    };
  },
  components: {
    MatchCard
  },
  computed: {
    computedList() {
        if(this.selected==0){
            return this.buyer_trades
        }else{
            return this.seller_trades
        }
    },
    isLogged: function(){
      return this.$store.state.isLogged;
    }
  },
  async created() {
    let user = this.$store.state.user;
    if(user){
      console.log('유저',user)
      let tmpBuyer=await this.$http.post(`${this.$config.serverUri}match/buyer`,{
        buyer_id:user._id
      })
      this.buyer_trades=tmpBuyer.data

      let tmpSeller=await this.$http.post(`${this.$config.serverUri}match/seller`,{
        seller_id:user._id
      })
      this.seller_trades=tmpBuyer.data


    }
  }
};
</script>




<style>
#my-sale-status {
  background: mediumslateblue;
}
#whole {
  margin-left: 2%;
  margin-right: 2%;
}
</style>

