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
      <!--구매자 경우에는 책 정보랑 판매자 -->
      <table class="table">
        <thead>
          <tr v-if="selected==0">
            <th scope="col">책 제목</th>
            <th scope="col">구매자가 제시한 장소</th>
            <th scope="col">구매자가 제시한 가격</th>
            <th scope="col">구매자 연락 수단</th>
          </tr>
          <tr v-if="selected==1">
            <th scope="col">책 제목</th>
            <th scope="col">판매자가 제시한 장소</th>
            <th scope="col">판매자가 제시한 가격</th>
            <th scope="col">판매자 연락 수단</th>
          </tr>
        </thead>
        <tbody v-if="selected==0">  
          <tr v-for="(list,index) in computedList" :key="index">
            <td>{{list.title}}</td>
            <td>{{getBuyers[index].location}}</td>
            <td >{{getBuyers[index].price}}</td>
            <td>{{getBuyers[index].buyer_contact}}</td>
          </tr>
        </tbody>
        <tbody v-else-if="selected==1">
          <tr v-for="(list,index) in computedList" :key="index">
            <td>{{list.title}}</td>
            <td>{{list.location}}</td>
            <td>{{list.price}}</td>
            <td v-if="list.seller_contact==0">{{getSellers[index].phone}}1</td>
            <td v-else>{{getSellers[index].email}}2</td>
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
      getSellers:[],
      buyer_trades: [],
      getBuyers:[],
      selected: 0,
      options: [{ text: "판매자", value: 0 }, { text: "구매자", value: 1 }]
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
    computedUser() {
      if (this.selected == 0) {
        return this.buyers;
      } else {
        return this.sellers;
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
        `${this.$config.serverUri}match/buyer`,  //내가 바이어  -> 셀러 구하는 것
        {
          buyer_id: user._id
        }
      );
      console.log(tmpBuyer.data)
      this.seller_trades=tmpBuyer.data.trade
      this.getSellers=tmpBuyer.data.seller



      var tmpSeller = await this.$http.post(
        `${this.$config.serverUri}match/seller`,  //내가 바이어  -> 셀러 구하는 것
        {
          seller_id: user._id
        }
      );
      console.log('셀러',tmpSeller.data)
      this.buyer_trades=tmpSeller.data.trade
      this.getBuyers=tmpSeller.data.buyer


    

      // console.log('템바',tmpBuyer.data)
      // _.forEach(tmpBuyer.data.trade,(value,index)=>{
      //   this.seller_trades.push(_.filter(this.$store.state.trades,{_id:value}))
      //   console.log('구매자 발루',value)
      // })

      // _.forEach(tmpBuyer.data.user,async (value,index)=>{
      //   console.log('구매자 유저!!',await this.$http.post(`${this.$config.serverUri}user/getInfo`,{id:value}))
      //   var temp=await this.$http.post(`${this.$config.serverUri}user/getInfo`,{id:value})
      //   this.sellers.push(temp.data)
      // })
      
      //셀러 입장s
      // console.log("셀러 유저", user);
      // var tmpSeller = await this.$http.post(
      //   `${this.$config.serverUri}match/seller`,
      //   {
      //     seller_id: user._id
      //   }
      // );
      // var tmpSeller = this.$store.state.user;


      // let totalbuyers = [];
      // _.forEach(myTrades,(value,index)=>{
      //   totalbuyers.push(value.buyers);
      // })
      
      // _.forEach(tmpSeller.data.trade,(value,index)=>{
      //   this.buyer_trades.push(_.filter(this.$store.state.trades,{_id:value}))
      //   console.log('판매자 발루',value)
      // })
      // _.forEach(tmpSeller.data.user,async (value,index)=>{
      //   console.log('판매자 유저',await this.$http.post(`${this.$config.serverUri}user/getInfo`,{id:value}))
      //   var temp=await this.$http.post(`${this.$config.serverUri}user/getInfo`,{id:value})
      //   this.buyers.push(temp.data)
      // })

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

