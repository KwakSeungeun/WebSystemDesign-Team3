<template>
    <div id="match-card" class="row-align">
        <!-- 책 정보 -->
        <div class="row-item" style="width: 20%;  padding: 20px;">
            <p>
                책 제목 : {{match.title}}<br><br>
                저자 : {{match.author}} <br><br>
                거래 등록일  : {{updateDate}} <!--한 번 보기-->
            </p>
        </div> 
        <!-- buyer 정보 -->
        <div class="row-item" style="width: 100%; position: relative">
            <div v-if="match.buyers.length == 0">
                <div class="buyer-card " style="height: 100%;">
                    <p style="text-align: center;">
                        거래를 요청한 구매자가 없습니다 ㅠㅠ
                    </p>
                </div>
            </div>
            <div v-for="buyer in match.buyers" :key="buyer._id">
                <div class="buyer-card row-align">
                    <p class="row-item" style="width: 85%;">
                        제시한 가격 : {{buyer.price}}<br>
                        제시한 장소 : {{buyer.location}}
                    </p>
                    <button @click="matchBuyer(buyer._id)" class="round-btn blue row-item" style="width: 15%;">MATCH</button>
                </div>
            </div>
            <button  v-b-modal.closeTrade class="round-btn float-right bottom-align">장터 종료하기</button>
        </div>
        <b-modal id="closeTrade" ref="closeTrade" title="장터 종료하기" hide-footer centerd>
            <p>지금 장터를 종료하면 이 책을 선택한 다른 사용자들과의 거래가 불가능 합니다.</p>
            <div class="row-align">
                <button @click="closeModal" style="width: 50%;" class="round-btn blue">취소</button>
                <button @click="closeTrade" style="width: 50%;" class="round-btn">장터 종료하기</button>
            </div>
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
        closeModal: function(){
            this.$refs.closeTrade.hide();
        },
        closeTrade: function(){
            // this.$axios.post(`${this.$config.serverUri}trade/close`)
            // .then(res=>{

            // })
            // .catch(err=>{

            // });
        },
        matchBuyer: function(buyer_id){
            let sendObj = {
                trade_id : this.match._id,
                buyer_id : buyer_id
            };
            this.$http.post(`${this.$config.serverUri}trade/match_buyer`,sendObj)
            .then(res=>{
                console.log("성공\n", res)
                this.$EventBus.$emit('successMatching');
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
}
.buyer-card{
    margin: 5px;
    padding: 1px;
    border-radius: 10px;
    border: 1px solid grey;
}
.bottom-align{
    width: 100%; margin-top:10px; padding:5px;
    position: absolute;
    bottom: 0;
}
</style>
