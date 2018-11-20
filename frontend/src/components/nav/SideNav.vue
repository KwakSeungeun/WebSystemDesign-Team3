<template>
    <div id="side-nav">
        <b-nav vertical>
            <b-nav-item>
                <b-button-group>
                    <b-btn v-b-modal.loginModal>로그인</b-btn>
                    <b-btn v-b-modal.registerModal>회원가입</b-btn>
                </b-button-group>
            </b-nav-item>
            <b-nav-item active>메인화면</b-nav-item>
            <b-nav-item>test2</b-nav-item>
            <b-nav-item>test3</b-nav-item>
        </b-nav>
        <b-modal no-close-on-backdrop centered ref="loginRef"
                size="lg" title="로그인" hide-footer id="loginModal">
            <login-form></login-form>
        </b-modal>
        <b-modal no-close-on-backdrop centered
                size="lg" title="회원가입" hide-footer id="registerModal">
            <register-form></register-form>
        </b-modal>
    </div>
</template>

<script>
import LoginForm from '../modal/LoginForm'
import RegisterForm from '../modal/RegisterForm'

export default {
    name: "side-nav",
    components:{
        LoginForm,
        RegisterForm
    },
    data: () => ({

    }),
    methods: {
    },
    created(){
        this.$EventBus.$on('login',(data)=>{
            //data is login info
            //here is connect login api
            this.$refs.loginRef.hide() //if success login
            console.log("DATA :",data);
        });
    }
}
</script>

<style>
#side-nav{
    background: burlywood;
}
</style>

