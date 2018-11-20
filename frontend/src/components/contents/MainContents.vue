<template>
    <div id="main">
        <h1 v-for="i in 20">{{i}}.Main Test</h1>
    </div>
</template>

<style>
#main{
    background: cyan;
    height: 90vh;
    overflow-y: scroll;
}
</style>
