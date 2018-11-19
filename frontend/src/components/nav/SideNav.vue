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
        <b-modal @hide="onClose" no-close-on-backdrop centered
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
        onClose: ()=>{
            alert('회원가입을 중지했습니다');
        },
        hideModal:()=>{
            this.$refs.loginRef.hide()
        }
    }
}
</script>

<style>
#side-nav{
    background: burlywood;
}
</style>

