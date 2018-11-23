<template>
    <div id="main">
        <h1 v-for="i in 20" :key="i">{{i}}.Main Test</h1>
    </div>
</template>

<style>
#main{
    background: cyan;
}
</style>
