<template>
    <div id="sell-my-book">
        <div v-if="isLogged">
            <b-form @submit="createTrade">
                <b-form-group label="판매자 연락처 정보(필수)" description="구매자가 연락이 쉬운 연락처로 선택 해 주세요!">
                    <div class="row-align">
                        <b-form-radio-group class="row-item" v-model="selected" :options="contactOptions" required>
                        </b-form-radio-group>
                        <p class="row-item" v-if="selected=='email'">user.id</p>
                        <p class="row-item" v-if="selected=='phone'">user.phone</p>
                    </div>
                </b-form-group>
                <hr>
                <b-form-group label="기본정보(필수)"
                                description="검색을 통해 정확한 책 정보를 알 수 있습니다!">
                    <div class="row-align">
                        <b-form-input class="row-item w-10" type="text" placeholder="제목" readonly
                                v-model="form.title">
                        </b-form-input>
                        <b-form-input class="row-item w-10" type="text" placeholder="저자" readonly
                                    v-model="form.author">
                        </b-form-input>
                        <b-form-input class="row-item w-10" type="number" placeholder="판" readonly
                                    v-model="form.edition">
                        </b-form-input>
                        <button class="round-btn blue row-item" @click="openSearchModal">찾기</button>
                    </div>
                </b-form-group>
                <hr>
                <b-form-group label="팔고 싶은 책 정보(필수)">
                    <vue-upload-multiple-image
                        @upload-success="uploadImageSuccess"
                        @before-remove="beforeRemove"
                        :data-images="form.img_url"
                        primaryText=""
                        markIsPrimaryText=""
                        dragText=""
                        browseText="">
                    </vue-upload-multiple-image>
                    <div class="mt-3">Selected file: {{form.img_url && form.img_url.name}}</div>
                    <div class="row-align">
                        <b-input-group class="row-item" prepend="책 상태">
                            <b-form-input required type="number" placeholder="0(사용흔적 많음)~5(거의 새 것)" 
                                            v-model="form.state"></b-form-input>
                        </b-input-group>
                        <b-input-group class="row-item" prepend="가격" append="원">
                            <b-form-input  required type="number" v-model="form.price"></b-form-input>
                        </b-input-group>
                    </div>
                </b-form-group>
                <hr>
                <b-form-group label="책 상태 입력(선택사항)"
                                description="자세하고 정확한 책 상태 설명이 책 장터에 더욱 도움이 됩니다!">
                    <div class="row-align">
                        <b-input-group class="row-item" prepend="TAG">
                            <b-form-input type="text" placeholder="교수님, 수업, 학과 등" 
                                            v-model="form.tag"></b-form-input>
                        </b-input-group>
                    </div>
                    <b-input-group class="row-100" prepend="Comment">
                        <b-form-textarea :rows="2" :max-rows="2" placeholder="구매자에게 알리고 싶은 정보를 입력 해 주세요!" 
                                    v-model="form.comment"></b-form-textarea >
                    </b-input-group>
                </b-form-group>
                <hr>
                <button style="width: 100%; height: 50px;" class="round-btn" type="submit">내 책 장터 열기</button>
            </b-form>
        </div>
        <div v-if="!isLogged"> 
            <h1>로그인해야함!</h1>
        </div>
        <!-- modal -->
        <b-modal no-close-on-backdrop hide-footer @hidden="headerclose"
            ref="searchBook" title="찾는 책을 검색해 보세요.">
            <div v-if="step==0">
                <div class="row-align">
                    <b-form-input class="row-item" v-model="searchText" placeholder="제목 또는 저자를 검색해보세요!"></b-form-input>
                    <button class="round-btn blue row-item" @click="onSearchBook">검색</button>  
                </div>
            </div>
            <div v-if="step==1">
                <p>검색 결과 입니다. 원하는 책을 선택하세요.</p>
                <button style="width: 100%;" class="round-btn blue" @click="userDirectWrite">직접 입력하기</button>
            </div>
            <div v-if="step==2">
                <b-form @submit="completeBookInfo">
                    <b-form-group label="직접 책 정보를 입력하세요" description="">
                        <div class="row-align">
                            <b-form-input class="row-item" type="text" placeholder="제목" required
                                    v-model="form.title">
                            </b-form-input>
                            <b-form-input class="row-item" type="text" placeholder="저자" required
                                        v-model="form.author">
                            </b-form-input>
                            <b-form-input class="row-item" type="number" placeholder="판" required
                                        v-model="form.edition">
                            </b-form-input>
                            <button class="round-btn blue row-item" type="submit">완료</button>
                        </div>
                    </b-form-group>
                </b-form>
            </div>
        </b-modal>
    </div>
</template>

<script>
import VueUploadMultipleImage from 'vue-upload-multiple-image'

export default {
    name: 'sell-my-book',
    components:{
        VueUploadMultipleImage
    },
    data: function(){
        return{
            form:{
                title: '',
                author: '',
                edition: '',
                seller_id: '',
                seller_contact: '',
                img_url:[],
                tag: '',
                comment: '',
                state: '',
                buyers: [],
                price: 0,
                status: 0,
                time_stamp: ''
            },
            step: 0, // 책 기본 정보 검색 , 0: 초기 검색, 1: 검색 성공, 2: 검색 실패(직접 입력)
            searchText: '',
            selected:'email',
            contactOptions:[
                {text: '이메일', value:'email'},
                {text: '핸드폰', value:'phone'}
            ]
        }
    },
    computed: {
        isLogged: function(){
            return this.$store.state.isLogged;
        }
    },
    created: function(){
        this.clear();
    },
    methods:{
        clear: function(){
            this.clearSearch();
        },
        clearSearch: function(){
            this.step = 0;
            this.searchText = '';
        },
        openSearchModal: function(){
            this.$refs.searchBook.show();
        },
        onSearchBook: function(){
            this.step = 1;
            // book api 호출 
        },
        userDirectWrite: function(){
            this.step = 2;
        },
        completeBookInfo: function(event){
            this.clearSearch();
            this.$refs.searchBook.hide();
            event.preventDefault();
        },
        headerclose : function(){
            this.clearSearch();
        },
        createTrade: function(event){
            // 판매자 연락처 check를 통해 
            console.log("FORM: ",this.form);
            event.preventDefault();
        },
        uploadImageSuccess(formData, index, fileList) {
            console.log('UPLOAD', formData, index, fileList)
            // Upload image api
            // axios.post('http://your-url-upload', { data: formData }).then(response => {
            //   console.log(response)
            // })
        },
        beforeRemove (index, done, fileList) {
            console.log('index', index, fileList)
            var r = confirm("remove image")
            if (r == true) {
                done()
            }
        }
    }
}
</script>


<style>
#sell-my-book{
    background: white;
    margin: 5%;
    padding: 1%;
    overflow: hidden;
    border-radius: 5px;
    border: 1px solid grey;
}
.round-btn{
    text-align: center;
    background: #E74C3C;
    color: white;
    border-radius: 5px;
    border: 0px solid #E74C3C;
}
.round-btn:hover{
    background: #CB4335;
}
.round-btn.blue{
    background: #1B4F72;
    bottom: 0px;
}
.round-btn.blue:hover{
    background: rgb(20, 59, 85);
}
.row-align{
    display: inline-block;
}
.row-item{
    margin: 5px;
}
.row-item.w-10{
    width: 20%;
}
.row-100{
    margin: 5px;
    width: calc(100% - 10px);
}
</style>

