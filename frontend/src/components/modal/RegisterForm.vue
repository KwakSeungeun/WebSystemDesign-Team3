<template>
    <div>
        <b-form @submit="onRegister" class="m-1">
            <p><b>필수 입력사항 입니다.</b></p>
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">이메일(필수)</label>
                <b-form-input v-model="form.email" type="text" required style="width: 60%; flex: 3" 
                        placeholder="ex) bookTrade@ajou.ac.kr"></b-form-input>
            </div>
            <p v-if="errMsg" style="color: #E74C3C;">{{errMsg}}</p>
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">비밀번호</label>
                <b-form-input v-model="inputPw" type="password" required style="width: 60%; flex: 3" 
                    placeholder="8자 이상 입력하세요"></b-form-input>
            </div>
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">비밀번호확인</label>
                <b-form-input v-model="pwCheckText" type="password" required ref="pwCheckRef" style="width: 60%; flex: 3" 
                    placeholder="비밀번호를 다시 한 번 입력해주세요"></b-form-input>
            </div>
            <div class="mb-3" v-if="pwCheckText">
                <p v-if="pwCheckText!=inputPw" style="color: #E74C3C;">비밀번호가 다릅니다</p>
                <p v-if="pwCheckText==inputPw" style="color: #3399ff;">비밀번호가 일치합니다</p>
            </div>
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">이름</label>
                <b-form-input v-model="form.name" type="text" required class="mr-2" style="width: 40%;" 
                    placeholder="실명"></b-form-input>
                <label class="pt-2 mr-2">전화번호</label>
                <b-form-input v-model="form.phone" type="text" required 
                    placeholder="ex)01012345678"></b-form-input>                    
            </div>
            <hr>
            <p><b>선택 입력사항 입니다.</b></p>
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">선호장소</label>
                <b-form-input v-model="form.preference"
                    class="ml-1" type="text" placeholder="거래 선호 장소를 입력하세요!" style="width: 60%; flex: 3" ></b-form-input>
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
    props:['errMsg'],
    data:()=>({
        pwCheckText: '',
        inputPw: '',
        form:{
            email: '',
            pw: '',
            name: '',
            phone: '',
            preference:'',
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
            this.form.pw=crypto.createHash('sha512').update(`${this.inputPw}`).digest('base64')
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
