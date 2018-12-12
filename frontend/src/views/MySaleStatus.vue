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
            <td>{{list.location}}</td>
            <td >{{list.price}}</td>
            <td><b-button @click="openBuyerContactModal(list, 0)">보기</b-button></td>
          </tr>
        </tbody>
        <tbody v-else-if="selected==1">
          <tr v-for="(list,index) in computedList" :key="index">
            <td>{{list.title}}</td>
            <td>{{list.location}}</td>
            <td>{{list.price}}</td>
            <td><b-button @click="openSellerContactModal(list, 1)">보기</b-button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!isLogged" class="outline">
      <h4>로그인 시 이용하실 수 있는 서비스 입니다.</h4>
    </div>

    <b-modal
            no-close-on-backdrop
            centered
            ref="sellerContactModal"
            size="md"
            title="판매자 연락처 정보"
            hide-footer
            id="sellerContactModal">
      <p>{{contact_info}}</p>
    </b-modal>

    <b-modal
            no-close-on-backdrop
            centered
            ref="buyerContactModal"
            size="md"
            title="구매자 연락처 정보"
            hide-footer
            id="buyerContactModal">
      <p>{{contact_info}}</p>
    </b-modal>

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
      selected: 0,
      contact_info: '',
      options: [{ text: "판매자", value: 0 }, { text: "구매자", value: 1 }]
    };
  },
  components: {
    MatchCard
  },
  computed: {
    computedList() {
      if (this.selected == 0) {
        return this.seller_trades;
      } else {
        return this.buyer_trades;
      }
    },
    isLogged: function() {
      return this.$store.state.isLogged;
    }
  },
  methods: {
    openSellerContactModal: function(v, who){
        console.log(v);
      this.$http.get(`${this.$config.serverUri}trade/matched/` + v.trade_id + '/' + who).then(res => {
          this.contact_info = res.data;
      }).catch(err => {
          this.contact_info = "";
      });
      this.$refs.sellerContactModal.show();
    },
    openBuyerContactModal: function(v, who){
        console.log(v);
      this.$http.get(`${this.$config.serverUri}trade/matched/` + v.trade_id + '/' + who).then(res => {
        this.contact_info = res.data;
      }).catch(err => {
        this.contact_info = "";
      });
      this.$refs.buyerContactModal.show();
    }
  },
  async created() {
    if (this.$store.state.isLogged) {
        this.$http.get(`${this.$config.serverUri}match/seller`).then(res => {
            this.seller_trades = res.data;
            console.log(res.data);
        }).catch(err => {
            alert('내 판매 목록을 불러오는데 실패했습니다.. 새로고침 해주세요.');
        });

        this.$http.get(`${this.$config.serverUri}match/buyer`).then(res => {
            this.buyer_trades = res.data;
            console.log(res.data);
        }).catch(err => {
           alert('내 구매 목록을 불러오는데 실패했습니다.. 새로고침 해주세요.')
        });
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

