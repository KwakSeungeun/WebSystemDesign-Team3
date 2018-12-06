<template>
    <div id="details">
        <b-button class="round-btn float-btn" @click="openModal">중고 거래장터 참여하기</b-button>
        <div class="contents">
            <div class="info">
                책 제목 : {{trade.title}} <br>
                저자 : {{trade.author}} <br>
                판: {{trade.edition}}<br>
                책 상태: {{trade.state}}<br> <!--별로 표시하기 -->
                가격 : {{trade.price}}원<br>
                태그: #{{trade.tag}}<br>
                판매자의 글:{{trade.comment}}<br> 
                남은 판매 기간: !!계산하기<br> <!--momment.js 쓰면 쉽게 할 수 있음-->
            </div>
        </div>
        <b-modal no-close-on-backdrop hide-footer centered ref="buyModal" title="거래 참여하기">
            <p>원하는 가격과 장소를 입력해 주세요!</p>
            <div class="row-align">
                <b-form-input required style="flex:1" type="number" placeholder="가격" v-model="buyer.price"></b-form-input>
                <p>원</p>
                <b-form-input required style="flex:1; margin-left: 10px;" 
                    type="text" placeholder="장소" v-model="buyer.location"></b-form-input>
            </div>
            <hr>
            <b-form-group label="원하는 연락방법을 선택해 주세요">
                <b-form-radio-group v-model="selected"
                                    :options="contactOptions"
                                    name="contact">
                </b-form-radio-group>
            </b-form-group>
            <p>회원님의 아주메일 또는 핸드폰번호로 거래에 등록됩니다!<br>
            연락처는 판매자가 거래를 원할 경우에만 공개 됩니다.</p>
            <hr>
            <b-btn class="round-btn" style="float: right;" @click="tradeSubmit">등록하기</b-btn>
        </b-modal>
        <b-modal hide-footer ref="notLoggedModal" centered>
            <p>로그인시 이용가능한 서비스 입니다.</p>
        </b-modal>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    name: 'trade-details',
    data: function(){
        return{
            trade_id: this.$route.params.id,
            tradeList: this.$store.state.trades,
            trade: {},
            buyer:{
                price:'',
                location: '',
            },
            selected:'email',
            contactOptions:[
                {text: '이메일', value:'email'},
                {text: '핸드폰', value:'phone'}
            ]
        }
    },
    computed: {
        isLogged: function(){
        return this.$store.state.isLogged;
        }
    },
    methods:{
        openModal: function(){
            if(!this.isLogged){
                this.$refs.notLoggedModal.show();
                return;
            } else {
                // clear
                this.buyer = { price:'', location: '' };
                this.selected = 'email'
                this.$refs.buyModal.show();
            }
        },
        tradeSubmit: function(){
            if(!this.buyer.price || !this.buyer.location){
                return;
            }
            let createBuyerObj = {
                trade_id: this.trade._id,
                buyer_id: "", //로그인 되어 있는 정보 이용 vuex에 user에 저장 해둠
                location: this.location,
                buyer_contact: ""  // selected되어 있는 것에 따라 
            }
            
            this.$http.post(`${this.$config.serverUri}trade/suggest_price`,createBuyerObj)
            .then((res)=>{
                console.log("가격제시 성공",res);
            }).catch(err=>{
                console.log("에러\n",err.response);
            });
            this.$refs.buyModal.hide();
        }
    },
    created: function(){
        this.trade = _.find(this.tradeList, {'_id': this.trade_id});
    }
}
</script>

<style>
#details{
    background: brown;
    margin-left: 2%;
    margin-right: 2%;
    overflow: hidden;
}
.round-btn{
    text-align: center;
    background: #E74C3C;
    color: white;
    border-radius: 5px;
    border: 0px solid #E74C3C;
}
.round-btn.float-btn{
    position: absolute;
    top: 250px;
    right: 50px;
}
.round-btn:hover{
    background: #CB4335;
}
.contents{
    background: yellowgreen;
    width: 100%;
    height: 100%;

}
.info{
    color: black;
    font-size: 24px;
}
.row-align{
    display: flex;
    flex-direction: row;
}
</style>
