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
      selected: 4,
      options: [
        { text: "전체보기", value: 4 },
        { text: "장터중", value: 0 },
        { text: "장터성공", value: 2 },
        { text: "장터실패", value: 3 }
      ]
    };
  },
  components: {
    BookCard
  },
  computed: {
    computedList() {
        if(this.selected==4){
            return this.Trades
        }else{
            return _.filter(this.Trades, { 'status':this.selected });
        }
    },
    isLogged: function(){
      return this.$store.state.isLogged;
    }
  },
  created() {
    this.Trades = this.$store.state.trades;
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

