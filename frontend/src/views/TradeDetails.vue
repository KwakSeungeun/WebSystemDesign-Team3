<template>
    <div id="details">
        <b-button class="round-btn float-btn" @click="openModal">중고 거래장터 참여하기</b-button>
        <div class="contents">
            
            <div class="info">
                책 제목 : {{trade.title}} <br>
                저자 : {{trade.author}} <br>
                판: {{trade.edition}}<br>
                책 상태 : <star-rating v-model="trade.state" :show-rating=false :read-only=true
                            v-bind:increment="1"
                            v-bind:max-rating="5"
                            v-bind:rounded-corners=true
                            inactive-color="#808080"
                            active-color="#E74C3C"
                            v-bind:star-size="50"></star-rating> 
                <div v-for="(tag,index) in tagsList" :key="index">
                    <p><b>#</b>{{tag}}&nbsp;&nbsp;&nbsp;</p>
                </div>
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
import StarRating from 'vue-star-rating'

export default {
    name: 'trade-details',
    components:{
        StarRating
    },
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
        },
        tagsList: function(){
            return _.split(this.trade.tag,',');
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
            let User = this.$store.state.user;
            if(!this.buyer.price || !this.buyer.location){
                return;
            }
            let selectedContact = '';
            if(this.selected=='eamil') selectedContact = this.$store.state.user.email;
            else selectedContact = this.$store.state.user.phone;

            let createBuyerObj = {
                trade_id: this.trade._id,
                buyer_id: User._id,
                location: this.buyer.location,
                price: this.buyer.price,
                buyer_contact: selectedContact 
            }
            console.log("create buyer object : \n", createBuyerObj);
            this.$http.post(`${this.$config.serverUri}trade/suggest_price`,createBuyerObj)
            .then((res)=>{
                console.log("가격제시 성공",res);
                alert("판매자에게 제시한 가격 정보가 갔습니다!");
            }).catch(err=>{
                console.log("에러\n",err);
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
    margin: 0% 2% 0% 2%;
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
    padding: 50px;
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
