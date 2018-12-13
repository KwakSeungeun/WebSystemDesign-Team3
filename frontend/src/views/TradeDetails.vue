<template>
    <div id="details">
        <b-button class="round-btn float-btn" @click="openModal" v-if="trade.status==0">중고 거래장터 참여하기</b-button>
        <div class="top">
            <b v-if="checkSelf" style="color: #E74C3C; margin-top: 10px; margin-bottom: 10px;">자신이 등록한 중고 장터 입니다!</b><br>
            <b v-if="trade.status==0" style="font-size: 24px; margin-right: 20px;">
                장터 마감까지 <span style="color: #E74C3C">{{dueDate}}</span> 일 남았습니다!</b>
            <b v-if="trade.status==0">현재 <span style="color: #E74C3C">{{buyers_length}}</span>명 장터에 참여중!</b>
            <b v-if="trade.status==1||trade.status==2||trade.status==3" style="font-size: 24px; margin-right: 20px;">
                마감된 장터 입니다.</b>
            <b v-if="trade.status==1||trade.status==2||trade.status==3">총 <span style="color: #E74C3C">{{trade.buyers.length}}</span>명 장터에 참여 했음</b>
            <br><br>
            <div class="row-align">
                <div style="margin-right: 5%;">판매자 희망가격 : <b>{{price}}원</b></div>
                책 상태 
                <star-rating v-model="trade.state" :show-rating=false :read-only=true
                    v-bind:max-rating="5" v-bind:rounded-corners=true inactive-color="#808080" active-color="#E74C3C"
                    v-bind:star-size="30" style="height: 18px;"></star-rating>
        </div>
        <hr>
        </div>
        <div class="contents">
            <div class="images">
                <Photoswipe auto class="border mb-3">
                <p style="font-size: 20px;">이미지를 클릭하시면 확대해 볼 수 있습니다.</p>
                    <b-img v-for="(src, index) in imageUrlList" :key="index" 
                        :src="src"
                        class="border image-width"
                        fluid alt="Responsive image"/>
                </Photoswipe>
            </div>
            <div class="info">
                <b>장터 종료일</b> : {{expireDate}}<br>
                <br>
                <b>제목</b> : {{trade.title}} <br>
                <b>저자</b> : {{trade.author}} <br>
                <b>판</b> : {{trade.edition}}판<br>
                <br>
                <b>TAG</b><br>
                <div class="row-align" style="margin-bottom: 20px;">
                    <div v-for="(tag,index) in tagsList" :key="index" class="tag-container row-item">
                        <div class="hidden-overflow-text">#{{tag}}</div>
                    </div>
                </div>
                <b>COMMENT</b><br>
                <div class="border">
                    <span v-if="!this.trade.comment">...</span>
                    {{trade.comment}}
                </div>
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
        <b-modal hide-footer ref="errModal" centered>
            <p>{{errMsg}}</p>
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
            buyer:{
                price:'',
                location: '',
            },
            selected:'email',
            contactOptions:[
                {text: '이메일', value:'email'},
                {text: '핸드폰', value:'phone'}
            ],
            checkSelf: false,
            errMsg: '',
            buyers_length: 0
        }
    },
    computed: {
        isLogged: function(){
            return this.$store.state.isLogged;
        },
        preference: function() {
            if(this.$store.state.isLogged) return this.$store.state.user.preference;
            else return '';
        },
        tagsList: function(){
            return _.split(this.trade.tag,',');
        },
        expireDate: function(){
            return this.$moment(this.trade.time_stamp).add(7, 'days').format('YYYY-MM-DD');
        },
        dueDate: function(){
            return this.$moment(this.expireDate).diff(new Date(), 'days')+1;
        },
        price: function(){
            let toArrayPrice = _.split(this.trade.price, '',this.trade.price.length);
            let result = ''
            _.forEach(toArrayPrice, (value, key)=>{
                if((toArrayPrice.length-key)%3 == 0) result += `,${value}`;
                else result += value;
            });
            return result;
        },
        imageUrlList: function(){
            let result = []
            _.forEach(this.trade.img_url, (value, key)=>{
                result[key] = this.$config.image + value;
            });
            return result;
        },
        tradeList: function() {
            return this.$store.state.trades;
        },
        trade_id: function() {
            return this.$route.params.id;
        },
        trade: function() {
            return _.find(this.tradeList, {'_id': this.trade_id});
        }
    },
    methods:{   
        updateFilter: function(filterName) {
            this.galleryFilter = filterName;
        },
        openErrModal: function(){
            this.errMsg = '본인의 장터에는 자신이 참가 할 수 없습니다!'
            this.$refs.errModal.show();
        },
        openModal: async function(){
            if (this.checkSelf){
                this.openErrModal();
                return;
            } else {
                this.checkSelf = false;
            }
            if(!this.isLogged){
                this.$refs.notLoggedModal.show();
                return;
            } else {
                // clear
                this.buyer = { price:'', location: this.preference };
                this.selected = 'email'
                this.$refs.buyModal.show();
            }
            let err = null;
            // await this.$http.get(`${this.$config.serverUri}trade/my_trade_list`)
            // .then(res=>{
            //     _.forEach(res.data.trade_list, (value, index)=>{
            //         if(value._id === this.trade._id){
            //             this.checkSelf = true;
            //             return;
            //         }
            //     });
            // })
            // .catch(err=>{
            //     console.log("call my trade error\n",err);
            // });   
            // if(err){
            //     alert("서버에 에러가 생겼습니다. 다시 시도해 주세요!")
            //     return;
            // }    
        },
        tradeSubmit: function(){
            let User = this.$store.state.user;
            if(!this.buyer.price || !this.buyer.location){
                return;
            }

            let selectedContact = '';
            if(this.selected == 'email') selectedContact = 0;
            else selectedContact = 1;

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

                this.$http.get(`${this.$config.serverUri}trade/buyers_length/` + this.trade_id).then(res => {
                    this.buyers_length = parseInt(res.data.buyers_length);
                }).catch(err=>{
                    this.buyers_length = 0;
                    alert('구매자들을 불러오는데 실패했습니다!');
                });
            }).catch(err=>{
                if(err.response.data != undefined) {
                    if (err.response.data.success == "there_is_already_end_trade") alert('이미 종료된 장터입니다..');
                    if (err.response.data.success == "there_is_already_end_success") alert('이미 매칭이 성사된 장터입니다..');
                    if (err.response.data.success == "expired") alert('이미 매칭이 성사된 장터입니다..');
                }
                else alert('가격 제시에 실패했습니다.')
            });
            this.$refs.buyModal.hide();
        }
    },
    created: async function(){
        let User = this.$store.state.user;
        this.checkSelf = false
        let err = null;
        await this.$http.get(`${this.$config.serverUri}trade/my_trade_list`)
            .then(res=>{
                _.forEach(res.data.trade_list, (value, index)=>{
                    if(value._id === this.trade._id){
                        this.checkSelf = true;
                    return;
                } else this.checkSelf = false;
            });
        })
        .catch(err=>{
            console.log("call my trade error\n",err);
        });   
        if(err){
            alert("서버에 에러가 생겼습니다. 다시 시도해 주세요!")
            return;
        }

        this.$http.get(`${this.$config.serverUri}trade/buyers_length/` + this.trade_id).then(res => {
            this.buyers_length = parseInt(res.data.buyers_length);
        }).catch(err=>{
            this.buyers_length = 0;
            alert('구매자들을 불러오는데 실패했습니다!');
        });
    }
}
</script>

<style>
#details{
    /* background: blue; */
    margin: 0% 2% 70px 2%;
}
.round-btn.float-btn{
    position: absolute;
    padding: 20px;
    font-size: 20px;
    bottom: 20px;
    right: 50px;
}
.top {
    padding: 10px;
    font-size: 20px;
}
.contents{
    display: flex;
    flex-direction: row;
}
.images{
    /* background: bisque; */
    flex: 2;
}
.info{
    color: black;
    padding: 10px;
    flex: 1;
}
.row-align{
    display: flex;
    flex-direction: row;
}
.border{
    border: 2px solid #808080;
    border-radius: 5px;
    padding: 5px;
}
.image-width{
    margin: 15px;
}

/* smart phone */
 @media only screen and (max-width : 320px){
     .image-width{
        width: calc(100% - 30px);
    }
 }
/* pad and desktop */
 @media only screen and (min-device-width : 768px){
     .image-width{
        width: calc(100%/3 - 30px);
    }
}
 
</style>
