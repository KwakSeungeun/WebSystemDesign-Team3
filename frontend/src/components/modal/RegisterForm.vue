<template>
    <div>
        <b-form @submit="onRegister" class="m-1">
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">이메일</label>
                <b-form-input v-model="form.email" type="text" required
                        placeholder="ex) bookTrade@ajou.ac.kr"></b-form-input>
            </div>
            <hr>
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">비밀번호</label>
                <b-form-input v-model="inputPw" type="password" required
                    placeholder="8자 이상 입력하세요"></b-form-input>
            </div>
            <hr>
            <div class="d-flex flex-row">
                <label class="pt-2">비밀번호확인</label>
                <b-form-input v-model="pwCheckText" type="password" required ref="pwCheckRef"
                    placeholder="비밀번호를 다시 한 번 입력해주세요"></b-form-input>
            </div>
            <div class="mb-3" v-if="pwCheckText">
                <p v-if="pwCheckText!=inputPw" style="color: red;">비밀번호가 다릅니다</p>
                <p v-if="pwCheckText==inputPw" style="color: green;">비밀번호가 일치합니다</p>
            </div>
            <hr>
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">이름</label>
                <b-form-input v-model="form.name" type="text" required class="mr-1"
                    placeholder=""></b-form-input>
                <label class="pt-2">전화번호</label>
                <b-form-input v-model="form.phone" type="text" required
                    placeholder="ex)01012345678"></b-form-input>                    
            </div>
            <hr>
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">선호장소</label>
                <div v-for="(item, index) in form.preference" :key="index">
                    <b-form-input class="ml-1" type="text" placeholder="${index}순위"></b-form-input>
                </div>
            </div>
            <hr>
            <b-button class="float-right" type="submit" variant="primary">회원가입</b-button>
        </b-form>
    </div>
</template>

<script>
import sha512 from 'sha512'
import crypto from 'crypto'
import _ from 'lodash'

export default {
    data:()=>({
        pwCheckText: '',
        inputPw: '',
        form:{
            email: '',
            pw: '',
            name: '',
            phone: '',
            preference: ['','',''],
        }
    }),
    mounted(){
        this.clear()
    },
    methods:{
        onRegister(event){
            if(this.pwCheckText!=this.inputPw){
                this.$refs.pwCheckRef.focus();
                return;
            }
            // console.log('크립토',crypto.createHash('sha512').update(`${this.form.pw}`).digest('base64'));
            // this.form.pw = sha512(this.form.pw);
            this.form.pw=crypto.createHash('sha512').update(`${this.inputPw}`).digest('base64')
            console.log('회원가입 할때',this.form.pw)
            this.$EventBus.$emit('register',this.form);
            event.preventDefault(); //prevent reload page
        },
        clear(){
            _.forEach(this.form,(value,key)=>{
                this.form[key] = '';
            });
            this.pwCheckText = '';
        }
    },
}
</script>

<style>
label{
    width: 26%;
}
</style>
