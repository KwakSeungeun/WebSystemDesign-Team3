<template>
    <div id="card">
        <div class="image">
            <b-img src="https://picsum.photos/1024/400/?image=41" fluid alt="Responsive image"/>
        </div>
        <hr>
        <div class="info-container">
            <p>
                Title : 제목 / Edition : 판 
                <br>
                Author: 작가
                <br>
                price: 10,000원
                <br>
                State : 1~5점으로 상태
                <br>
                tag : ~~교수님, ~~강의
            </p>
        </div>
    </div>
</template>

<style>
#card{
    margin-left: 5%;
    margin-right: 5%; 
    height: 100%;
    background: white;
    border: 0;
    border-radius: 10px;
    padding: 10px 5px 10px 5px;
}
.image{
    background: yellow;
    height: calc(60% - 20px);
}
.info-container{
    margin-top: 10px;
    background: burlywood;
    height: calc(40% - 20px)
}
</style>
