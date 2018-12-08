<template>
    <div id="card">
        <div class="image">
            <b-img src="http://localhost:3000/Image/"  fluid-grow alt="Responsive image"/>
        </div>
        <hr>
        <div class="info-container">
            <star-rating v-model="trade.state" :show-rating=false :read-only=true
                            v-bind:increment="1"
                            v-bind:max-rating="5"
                            v-bind:rounded-corners=true
                            inactive-color="#808080"
                            active-color="#E74C3C"
                            v-bind:star-size="30"></star-rating> 
            <p class="p-2">
                Title : {{trade.title}}<br>
                Edition : {{trade.edition}}<br>
                Author: {{trade.author}}<br>
                price: {{price}}원<br> <!-- computed 사용해서 ,찍어서 보여주기 -->
            </p>
            <p>TAG : </p>
            <div class="row-align" >
                <div v-for="(tag,index) in tagsList" :key="index">
                    <p><b>#</b>{{tag}}&nbsp;&nbsp;&nbsp;</p>
                </div>
            </div>
            <p>Updated : {{date}}</p>
        </div>
    </div>
</template>

<script>
import StarRating from 'vue-star-rating'
import _ from 'lodash'

export default {
    props:['trade'],
    name: 'book-card',
    computed: {
        imageUrl: function(){
            return this.$config.imageUrl;
        },
        date: function(){
            return _.split(this.trade.time_stamp, 'T', 1).toString();
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
        tagsList: function(){
            return _.split(this.trade.tag,',');
        }
    },
    components:{
        StarRating
    }
}
</script>


<style>
#card{
    margin-left: 5%;
    margin-right: 5%; 
    height: 100%;
    background: #1B4F72;
    border-radius: 10px;
    padding: 10px 5px 10px 5px;
    color: #EBF5FB;
}
.image{
    height: calc(60% - 20px);
    background: #EBF5FB
}
.info-container{
    margin-top: 10px;
    height: calc(40% - 20px);
    text-overflow: ellipsis;
}
p{
    text-align: left;
}
</style>
