<template>
    <div id="side-nav">
        <b-nav vertical >
            <b-button-group size="sm" class="mx-auto">
                <b-btn v-b-modal.loginModal>로그인</b-btn>
                <b-btn v-b-modal.registerModal>회원가입</b-btn>
            </b-button-group>
            <hr>
            <b-nav-item active>메인화면</b-nav-item>
        </b-nav>       
    </div>
</template>

<script>
export default {
    name: "side-nav",
    components:{
        
    },
    data: () => ({

    }),
    methods: {
    },
}
</script>

<style>
#side-nav{
    background: rgb(255, 227, 192);
    height: 100%;
}

.mx-auto{
    margin-top: 20px;
}
</style>

