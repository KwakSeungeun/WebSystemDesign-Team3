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
      <div class="mt-3"></div>
      <!--구매자 경우에는 책 정보랑 판매자 정보 날짜 -->
      <table class="table">
        <thead>
          <tr>
            <th scope="col">BookName</th>
            <th scope="col">Contact</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="list in computedList" :key="list._id">
            <td>{{list[0].title}}</td>
            <td v-if="list.seller_contact==0">{{list.email}}</td>
            <td v-else>{{list.phone}}</td>
            <td>{{list.time_stamp}}</td>
          </tr>
        </tbody>
      </table>
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
      seller_trades: [],
      sellers:[],
      buyer_trades: [],
      buyers:[],
      selected: 0,
      options: [{ text: "구매자", value: 0 }, { text: "판매자", value: 1 }]
    };
  },
  components: {
    MatchCard
  },
  computed: {
    computedList() {
      if (this.selected == 0) {
        return this.buyer_trades;
      } else {
        return this.seller_trades;
      }
    },
    isLogged: function() {
      return this.$store.state.isLogged;
    }
  },
  async created() {
    let user = this.$store.state.user;
    if (user) {
      //바이어 입장
      console.log("유저", user);
      var tmpBuyer = await this.$http.post(
        `${this.$config.serverUri}match/buyer`,
        {
          buyer_id: user._id
        }
      );
      console.log('템바',tmpBuyer.data)
      
      _.forEach(tmpBuyer.data.trade,(value,index)=>{
        this.seller_trades.push(_.filter(this.$store.state.trades,{_id:value}))
        console.log('발루',value)
      })
      _.forEach(tmpBuyer.data.user,async (value,index)=>{
        console.log('유저!!',await this.$http.post(`${this.$config.serverUri}user/getInfo`,{id:value}))
        var temp=await this.$http.post(`${this.$config.serverUri}user/getInfo`,{id:value})
        this.sellers.push(temp.data)
      })
      

      
      //셀러 입장s
      console.log("유저", user);
      var tmpBuyer = await this.$http.post(
        `${this.$config.serverUri}match/seller`,
        {
          seller_id: user._id
        }
      );
      console.log('템바',tmpBuyer.data)
      
      _.forEach(tmpBuyer.data.trade,(value,index)=>{
        this.buyer_trades.push(_.filter(this.$store.state.trades,{_id:value}))
        console.log('발루',value)
      })
      _.forEach(tmpBuyer.data.user,async (value,index)=>{
        console.log('유저',await this.$http.post(`${this.$config.serverUri}user/getInfo`,{id:value}))
        var temp=await this.$http.post(`${this.$config.serverUri}user/getInfo`,{id:value})
        this.buyers.push(temp.data)
      })

      // let tmpSeller = await this.$http.post(
      //   `${this.$config.serverUri}match/seller`,
      //   {
      //     seller_id: user._id
      //   }
      // );
      // this.seller_trades = tmpSeller.data;

      // for (var i = 0; i < this.seller_trades.user.length; i++) {
      //   this.seller_trades.user[i].book = this.seller_trades.book[i];
      // }
      // console.log("바이어", this.seller_trades.user);
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

