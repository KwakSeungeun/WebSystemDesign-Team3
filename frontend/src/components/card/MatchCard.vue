<template>
    <div id="match-card" class="row-align">
        <!-- 책 정보 -->
        <div class="row-item" style="background: yellow; width: 20%;">
            <p>
                책 제목 : {{match.title}}<br>
                저자 : {{match.author}} <br>
                거래 등록일  : {{match.time_stamp}} <!--한 번 보기-->
            </p>
        </div> 
        <!-- buyer 정보 -->
        <div class="row-item" style="background: cyan; width: 100%;">
            <div v-for="buyer in match.buyers" :key="buyer._id">
                <div class="buyer-card row-align">
                    <p class="row-item">
                        제시한 가격 : {{buyer.buyer_price}}<br>
                        제시한 장소 : {{buyer.buyer_location}}
                    </p>
                    <button class="round-btn blue row-item">MATCH!</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "match-card",
    props: ['match'],
    created: function(){
        console.log("받아온 match : ",this.match);
    }
}
</script>


<style>
#match-card{
    background: rgb(175, 175, 175);
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
</style>
