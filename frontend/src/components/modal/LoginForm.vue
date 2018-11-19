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
                      v-model="form.pw"
                      required
                      placeholder="패스워드를 입력하세요">
        </b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  data : ()=>({
    form: {
        email: '',
        pw: '',
    }
  }),
  methods: {
    onLogin(evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    }
  }
}
</script>

<!-- b-form-1.vue -->