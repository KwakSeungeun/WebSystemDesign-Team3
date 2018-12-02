<template>
    <div id="card">
        <div class="image">
            <b-img src="https://picsum.photos/1024/400/?image=41" fluid alt="Responsive image"/>
        </div>
        <hr>
        <div class="info-container">
            <p>
                Title : {{trade.title}}<br>
                Edition : {{trade.edition}}<br>
                Author: {{trade.author}}<br>
                price: {{trade.price}}원<br> <!-- computed 사용해서 ,찍어서 보여주기 -->
                State : {{trade.state}}<br> <!--별 그래픽으로 보여주기-->
                tag : {{trade.tag}} <!-- computed 사용해서 좀 더 보기 좋게 만들기 -->
            </p>
        </div>
    </div>
</template>

<script>
export default {
    props:['trade'],
    name: 'book-card',
    components:{
        
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
</style>
