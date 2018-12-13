<template>
    <div id="match-card" class="row-align">
        <!-- 책 정보 -->
        <div class="row-item" style="width: 50%;  padding: 30px;">
            <p>
                <b>책 제목</b><br> {{match.title}}<br><br>
                <b>저자</b><br>{{match.author}} <br><br>
                <b>거래 등록일</b><br>{{updateDate}} <!--한 번 보기-->
            </p>
        </div> 
        <!-- buyer 정보 -->
        <div class="row-item buyer-list">
            <div v-if="match.buyers.length == 0" >
                <div class="buyer-card " style="height: 100%;">
                    <p style="text-align: center;">
                        거래를 요청한 구매자가 없습니다 ㅠㅠ
                    </p>
                </div>
            </div>
            <div v-for="buyer in match.buyers" :key="buyer._id" style="margin-bottom: 10px;">
                <div class="buyer-card row-align">
                    <p class="row-item" style="width: 85%;">
                        제시한 가격 : {{buyer.price}}<br>
                        제시한 장소 : {{buyer.location}}
                    </p>
                    <button @click="matchBuyer(buyer.buyer_id)" class="round-btn blue row-item" style="width: 15%;">MATCH</button>
                </div>
            </div>
            <button @click="openModal" class="round-btn float-right bottom-align">장터 종료하기</button>
        </div>
        <b-modal id="closeTrade" ref="closeTradeRef" title="장터 종료하기" hide-footer centerd>
            <p>지금 장터를 종료하면 이 책을 선택한 다른 사용자들과의 거래가 불가능 합니다.</p>
            <div class="row-align">
                <button @click="closeModal" style="width: 50%; margin: 5px;" class="round-btn blue">취소</button>
                <button @click="closeTrade" style="width: 50%; margin: 5px;" class="round-btn">장터 종료하기</button>
            </div>
        </b-modal>
        <b-modal id="successModal" ref="successModal" title="판" hide-footer centerd>
            <p>지금 장터를 종료하면 이 책을 선택한 다른 사용자들과의 거래가 불가능 합니다.</p>
        </b-modal>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    name: "match-card",
    props: ['match'],
    computed:{
        updateDate: function(){
            return _.split(this.match.time_stamp, 'T', 1).toString();
        }  
    },
    created: function(){

    }, 
    methods: {
        openModal: function(){
            this.$refs.closeTradeRef.show();
        },
        closeModal: function(){
            this.$refs.closeTradeRef.hide();
        },
        closeTrade: function(){
            console.log('buyers : ',this.match.buyers);
            let sendObj = {
                trade_id : this.match._id,
                buyers : this.match.buyers
            }
            this.$http.post(`${this.$config.serverUri}trade/close`,sendObj)
            .then(res=>{
                alert("장터를 종료했습니다.")
                this.$router.replace('select/buyer')
            })
            .catch(err=>{
                console.log("err\n",err);
                alert("서버에 문제가 생겨 장터를 종료하지 못했습니다.")
            }); 
            this.$refs.closeTradeRef.hide(); 
        },
        matchBuyer: function(buyer_id){
            let sendObj = {
                trade_id : this.match._id,
                buyer_id : buyer_id
            };
            this.$http.post(`${this.$config.serverUri}trade/match_buyer`,sendObj)
            .then(res=>{
                alert("성공적으로 매칭이 완료되었습니다!\n내 장터 현황에서 구매자의 연락처를 확인해 보세요!")
                this.$router.replace('/mysale');
            })
            .catch(err=>{
                console.log('err\n',err.response);
                alert("서버에 문제가 생겨 구매자 연결에 실패했습니다.")
            });
        }
    }
}
</script>


<style>
#match-card{
    background: rgb(216, 216, 216);
    margin: 2%;
    border-radius: 10px;
    border: 1px solid gray;
    height: auto;
}
.buyer-card{
    margin: 5px;
    padding: 1px;
    border-radius: 10px;
    border: 1px solid grey;
}
.bottom-align{
    width: 100%; 
    padding:8px;
    position: absolute;
    bottom: 0;
}
.buyer-list{
    width: 100%; 
    position: relative;
    /* overflow-y: scroll; */
}
</style>
