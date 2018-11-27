<template>
    <div id="main" class="mx-auto">
        <div v-for="i in 10" :key="i">
            <button class="card-container" @click="cardClick">
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
        cardClick: function(){
            console.log("CARD CLICK!")
        }
    }
}
</script>


<style>
#main{
    background: cyan;
}
.card-container{
    background: gray;
    border: 0;
    outline: 0;
    width: 350px;
    height: 200px;
    margin: 20px;
}
</style>
