<template>
    <div id="details">
        <h1>asldkjfa</h1>
        <h1>asldkjfa</h1>
        <h1>asldkjfa</h1>
        <h1>asldkjfa</h1>
        <h1>asldkjfa</h1>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    name: 'trade-details',
    data: function(){
        return{
            trade_id: this.$route.params.id,
        }
    },
    created: function(){
        // _.find(this.$store.trades)
        console.log("Trade!",this.$store.trades)
    }
}
</script>

<style>
#details{
    background: brown;
    margin-left: 2%;
    margin-right: 2%;
}
</style>
