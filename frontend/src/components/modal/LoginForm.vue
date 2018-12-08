<template>
  <div>
    <b-form @submit="onLogin">
      <b-form-group label="EMAIL: "
                    description="아주Gmail로 로그인이 가능합니다">
        <b-form-input type="text"
                      v-model="form.email"
                      required
                      placeholder="ex) bookTrade@ajou.ac.kr">
        </b-form-input>
      </b-form-group>
      <b-form-group label="PASSWORD:">
        <b-form-input type="password"
                      v-model="inputPw"
                      required
                      placeholder="패스워드를 입력하세요">
        </b-form-input>
      </b-form-group>
      <b-button class="float-right" type="submit" variant="primary">로그인</b-button>
    </b-form>
  </div>
</template>

<script>
import sha512 from'sha512'
import _ from 'lodash'
import crypto from 'crypto'

export default {
  data : ()=>({
    inputPw: '',
    form: {
        email: '',
        pw: '',
    }
  }),
  methods: {
    onLogin(event) {
      // this.form.pw = sha512(this.form.pw);
      this.form.pw=crypto.createHash('sha512').update(`${this.inputPw}`).digest('base64')
      this.$EventBus.$emit('login',this.form);
      event.preventDefault(); //prevent reload page
    },
    clear(){
      _.forEach(this.form,(value,key)=>{
        this.form[key] = '';
      });
    }
  },
  created(){
    this.clear();
  },
  mounted(){
    this.clear();
  }
}
</script>
