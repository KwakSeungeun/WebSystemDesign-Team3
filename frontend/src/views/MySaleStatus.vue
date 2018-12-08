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
      <div class="list-container">
        <button v-for="trade in computedList" :key="trade.id" class="card-container">
          <book-card :trade="trade"></book-card>
        </button>
      </div>
    </div>
    <div v-else-if="!isLogged">
      <h1>로그인 필요</h1>
    </div>
  </div>
</template>

<script>
import BookCard from "../components/card/BookCard";
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
    BookCard
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


      let buyer=_.filter(this.Trades,function(trd){
        for(var i=0;i<trd.buyers.length;i++){
          console.log(trd.buyers[i].buyer_id)
          if(trd.buyers[i].buyer_id==user._id)
          {
            return true
          }  
          else{
            return false
          }
        }
      })
      this.buyer_trades=buyer
      console.log('바이어!!buyer',buyer)
      console.log('트레이드!!',this.Trades)
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

