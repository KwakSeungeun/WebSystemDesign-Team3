<template>
    <div id="main">
        <div v-for="i in 10" :key="i" class="list-container">
            <button class="card-container" @click="cardClick(i)">
                <book-card></book-card>
            </button>
        </div>
    </div>
</template>

<script>
import BookCard from '../card/BookCard'

export default {
    components: {
        BookCard
    },
    methods:{
        cardClick: function(trade){
            console.log("CARD CLICK!",trade)
        }
    }
}
</script>


<style>
#main{
    background: white;
    width: 100%;
}
.list-container{
    background: yellow;
    margin-left: 5%;
    margin-right: 5%;
}
/* smart phone */
 @media only screen and (max-width : 320px){
     .card-container{
        background: gray;
        border: 0;
        outline: 0;
        margin: auto;
        width: calc(100% - 40px);
        height: 400px;
        margin: 10px;
    }
 }
/* pad */
 @media only screen and (min-device-width : 768px) and (max-device-width : 1024px){
     .card-container{
        background: gray;
        border: 0;
        outline: 0;
        margin: auto;
        width: calc(100%/2 - 40px);
        height: 400px;
        margin: 10px;
    }
 }
/* desktop */
 @media only screen and (min-width : 1224px){
     .card-container{
        background: gray;
        border: 0;
        outline: 0;
        margin: auto;
        width: calc(100%/3 - 40px);
        height: 400px;
        margin: 10px;
    }
 }
</style>
