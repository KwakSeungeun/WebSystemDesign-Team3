<template>
    <div>
        <b-form @submit="onRegister" class="m-1">
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">이메일</label>
                <b-form-input v-model="email" disabled type="text" required style="width: 60%; flex: 3"></b-form-input>
            </div>
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">이름</label>
                <b-form-input v-model="form.name" type="text" required style="width: 60%; flex: 3"></b-form-input>
            </div>
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">전화번호</label>
                <b-form-input v-model="form.phone" type="text" required style="width: 60%; flex: 3"></b-form-input>
            </div>
            <hr>
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">선호 장소(선택)</label>
                <b-form-input v-model="form.preference" type="text" style="width: 60%; flex: 3"></b-form-input>
            </div>

            <div class="d-flex flex-row mb-3">
                <label class="pt-2">기존 비밀번호</label>
                <b-form-input v-model="previous_Pw" type="password" style="width: 60%; flex: 3" required></b-form-input>
            </div>

            <div class="d-flex flex-row mb-3">
                <label class="pt-2">새비밀번호</label>
                <b-form-input v-model="new_Pw" type="password" style="width: 60%; flex: 3"></b-form-input>
            </div>
            <div class="d-flex flex-row mb-3">
                <label class="pt-2">비밀번호확인</label>
                <b-form-input v-model="pwCheckText" type="password" ref="pwCheckRef" style="width: 60%; flex: 3"
                              placeholder="비밀번호를 다시 한 번 입력해주세요"></b-form-input>
            </div>
            <div class="mb-3" v-if="pwCheckText">
                <p v-if="pwCheckText!=new_Pw" style="color: #E74C3C;">비밀번호가 다릅니다</p>
                <p v-if="pwCheckText==new_Pw" style="color: #3399ff;">비밀번호가 일치합니다</p>
            </div>
            <b-button class="float-right" type="submit" variant="primary">회원정보 수정하기</b-button>
        </b-form>
    </div>
</template>

<script>
    var crypto = require('crypto');
    export default {
        name: "UserInfo",
        data() {
            return {
                form:{
                    name: '',
                    phone: '',
                    preference: '',
                    b_pw: '',
                    a_pw: ''
                },
                email: '',
                previous_Pw:'',
                new_Pw: '',
                pwCheckText: ''
            }
        },
        methods:{
            onRegister(event){
                console.log("pwcheck process1");
                if(this.pwCheckText!=this.new_Pw){
                    alert('입력한 비밀번호를 확인해주세요!');
                }
                else {
                    console.log("pwcheck process2");

                    if(this.new_Pw != '') this.form.a_pw = crypto.createHash('sha512').update(`${this.new_Pw}`).digest('base64');
                    else this.form.a_pw = '';

                    this.form.b_pw = crypto.createHash('sha512').update(`${this.previous_Pw}`).digest('base64');
                    console.log("pwcheck put1");

                    this.$http.put(`${this.$config.serverUri}user/update`, this.form).then((res) => {
                        console.log("업데이트 성공", res);
                        this.$store.commit('setUserUpdate', this.form)
                        this.$localStorage.set('loginUser', JSON.stringify(this.$store.state.user));
                        alert("정보 업데이트 성공");
                    }).catch(err => {
                        if (err.response.data == 'password_error') {
                            alert('기존 패스워드와 다릅니다!');
                        }
                        else {
                            alert('정보 수정에 실패했습니다. 다시 시도해주세요.');
                        }
                    });
                    event.preventDefault();
                }
            },
            update(){
                console.log("get method process");

                this.new_Pw = '';
                this.previous_Pw = '';
                this.pwCheckText = '';

                this.$http.get(`${this.$config.serverUri}user`)
                    .then(res=>{
                        console.log("get method inside process");
                        this.email = res.data.email;
                        this.form.name = res.data.name;
                        this.form.phone = res.data.phone;
                        this.form.preference=res.data.preference;
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            }
        },
        created() {
            this.$EventBus.$on('user_info_update', this.update);
        }
    }
</script>

<style scoped>

</style>