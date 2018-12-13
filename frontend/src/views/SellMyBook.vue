<template>
    <div>
        <div v-if="isLogged"  id="sell-my-book">
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
                        <b-form-input ref="titleInput" class="row-item w-10" type="text" placeholder="제목" readonly required
                                v-model="form.title">
                        </b-form-input>
                        <b-form-input ref="authorInput" class="row-item w-10" type="text" placeholder="저자" readonly required
                                    v-model="form.author">
                        </b-form-input>
                        <b-form-input ref="editionInput" class="row-item w-10" type="number" placeholder="판"
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
                        @edit-image="editImage"
                        :data-images="form.img_url"
                        primaryText=""
                        markIsPrimaryText=""
                        dragText=""
                        browseText="">
                    </vue-upload-multiple-image>
                    <!-- <div class="mt-3 mb-3">Selected file: {{form.img_url && form.img_url.name}}</div> -->
                    <div class="row-align">         
                        <b-input-group class="row-item" style="width: 5%;" prepend="상태" required></b-input-group> 
                        <star-rating v-model="form.state" :show-rating=false
                            v-bind:increment="1"
                            v-bind:max-rating="5"
                            v-bind:rounded-corners=true
                            inactive-color="#808080"
                            active-color="#E74C3C"
                            v-bind:star-size="50"></star-rating> 
                    </div>
                        <b-input-group class="row-item" prepend="가격" append="원">
                            <b-form-input ref="priceInput" required type="number" v-model="form.price"></b-form-input>
                        </b-input-group>
                    </b-form-group>
                <hr>
                <b-form-group label="책 상태 입력(선택사항)"
                                description="자세하고 정확한 책 상태 설명이 책 장터에 더욱 도움이 됩니다!">
                    <div class="row-align">
                        <b-input-group class="row-item" prepend="TAG" style="width: 40%;">
                            <b-form-input type="text" placeholder="교수님, 수업, 학과 등" 
                                            v-model="tagInput"></b-form-input>
                            <button @click="addTags" class="round-btn blue" style="width: 10%;" type="button">추가</button>
                        </b-input-group>
                    </div>
                    <div class="row-align" style="margin-bottom: 20px;">
                        <div style="overflow: hidden;" v-for="(tag,index) in tags" :key="index" class="tag-container row-item">
                            <div class="hidden-overflow-text">{{tag}}</div>
                            <button class="no-bg-btn float-right" type="button" @click="removeTags(index)">
                                <i class="fa fa-close"></i>
                            </button>
                        </div>
                    </div>
                    <b-input-group class="row-100" prepend="선호 장소">
                        <b-form-input required type="text" v-model="form.location"></b-form-input>
                    </b-input-group>
                    <b-input-group class="row-100" prepend="Comment">
                        <b-form-textarea :rows="2" :max-rows="2" placeholder="구매자에게 알리고 싶은 정보를 입력 해 주세요!" 
                                    v-model="form.comment"></b-form-textarea >
                    </b-input-group>
                </b-form-group>
                <hr>
                <button style="width: 100%; height: 50px;" class="round-btn" type="submit">내 책 장터 열기</button>
            </b-form>
        </div>
        <div v-if="!isLogged" class="outline"> 
            <h4>로그인 시 이용하실 수 있는 서비스 입니다.</h4>
        </div>
        <!-- modal -->
        <b-modal no-close-on-backdrop hide-footer @hidden="headerclose" size="lg"
            ref="searchBook" title="찾는 책을 검색해 보세요.">
            <div v-if="step==0">
                <div class="row-align">
                    <b-form-input class="row-item" v-model="searchText" placeholder="제목 또는 저자를 검색해보세요!"></b-form-input>
                    <button class="round-btn blue row-item" @click="onSearchBook">검색</button>  
                </div>
            </div>
            <div v-if="step==1">
                <p>검색 결과 입니다. 원하는 책을 선택하세요.</p>
                <div v-for="bookItem in bookItems" :key="bookItem.id">
                    <div class="card w-75 card-margins">
                        <div class="card-body">
                            <h5 class="card-title">{{bookItem.title}}</h5>
                            <p class="card-text">{{bookItem.author}}</p>
                            <a href="#" class="btn btn-primary" @click="onSellectBook(bookItem)">선택</a>
                        </div>
                    </div>
                </div>
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
        <b-modal no-close-on-backdrop hide-footer>

        </b-modal>
    </div>
</template>

<script>
import VueUploadMultipleImage from 'vue-upload-multiple-image'
import StarRating from 'vue-star-rating'
import _ from 'lodash'

export default {
    name: 'sell-my-book',
    components:{
        VueUploadMultipleImage,
        StarRating
    },
    data: function(){
        return{
            form:{
                title: '',
                author: '',
                edition: '',
                seller_id: '',
                seller_contact: 0,
                images:[],
                tag: '',
                comment: '',
                state: 0, //0(상태 나쁨)~5(상태좋음)
                price: 0,
                time_stamp: '',
                location: ''
            },
            step: 0, // 책 기본 정보 검색 , 0: 초기 검색, 1: 검색 성공, 2: 검색 실패(직접 입력)
            searchText: '',
            bookItems: [],
            selected:'email',
            contactOptions:[
                {text: '이메일', value:'email'},
                {text: '핸드폰', value:'phone'}
            ],
            tags: [],
            tagInput : ''
        }
    },
    computed: {
        isLogged: function(){
            return this.$store.state.isLogged;
        },
        preference: function() {
            if(this.$store.state.isLogged) {
                return this.$store.state.user.preference;
            }
            else return '';
        }
    },
    created: function(){
        this.clear();
    },
    methods:{
        addTags: function(){
            if(!this.tagInput){
                alert('태그 내용을 입력 후 추가해 주세요!');
                return;
            }
            if(this.tags.length > 2){
                alert('최대 3개까지 입력할 수 있습니다.');
                return;
            }
            this.tags.push(this.tagInput);
            this.tagInput = '';
        },
        removeTags: function(index){
            console.log('tag 삭제전:',this.tags)
            this.tags.splice(index,1);
            this.tags = this.tags;
            console.log('tag 삭제 후:',this.tags)
        },
        onSellectBook: function(book) {
            this.$refs.searchBook.hide();
            this.form.title = book.title;
            this.form.author = book.author;
        },
        clear: function(){
            _.forEach(this.form, (value, key)=>{
                if(typeof(value)=="string") this.value = '';
                else if(typeof(value)=="number") this.value = 0;
                else this.value = null;
            });
            this.selected='email';
            this.tags = [];
            this.tagInput = '';
            this.form.location = this.preference;
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
            this.$http.post(`${this.$config.serverUri}getBook`, { query: this.searchText}).then(result => {
                this.bookItems = result.data.items;
                for(let i = 0; i < this.bookItems.length; i++) {
                    let tmp = this.bookItems[i].title.split(/<b>|<\/b>/);
                    let xstr = '';
                    for(let j = 0; j < tmp.length; j++) xstr += tmp[j];
                    this.bookItems[i].title = xstr;

                    tmp = this.bookItems[i].author.split(/<b>|<\/b>/);
                    xstr = '';
                    for(let j = 0; j < tmp.length; j++) xstr += tmp[j];
                    this.bookItems[i].author = xstr;
                }
            }).catch(function(err) {
                console.log(err);
                alert("검색에 실패했습니다!");
            });
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
            this.submit_trade();
            event.preventDefault();
        },
        uploadImageSuccess(formData, index, fileList) {
            this.form.images.push(formData.get("file"));
            console.log(this.form.images);
            // Upload image api
            // axios.post('http://your-url-upload', { data: formData }).then(response => {
            //   console.log(response)
            // })
        },
        beforeRemove (index, done, fileList) {
            var r = confirm("remove image")
            if (r == true) {
                this.form.images.splice(index, 1);
                console.log(this.form.images);
                done()
            }
        },
        editImage (formData, index, fileList) {
            this.form.images.splice(index, 1, formData.get('file'));
            console.log(this.form.images);
        },
        submit_trade: async function() {
            if(this.selected == 'email') this.form.seller_contact = 0;
            else this.form.seller_contact = 1;

            console.log("form data 보내기 전 : ",this.tags)
            _.forEach(this.tags,(value, index)=>{
                if(index == this.tags.length-1) this.form.tag += value;
                else this.form.tag += `${value},`;
            });
            console.log('tage들:',this.form.tag);

            console.log('form 데이터 만들기 전:',this.form);

            let formData = new FormData();
            for(let key of Object.keys(this.form)) {
                if(key == "images") {
                    for(let i = 0; i < this.form[key].length; i++) {
                        formData.append(key, this.form[key][i]);
                    }
                }
                else if(key == "state" || key == "price") formData.append(key, this.form[key].toString());
                else formData.append(key, this.form[key]);
            }

            if(!this.form.title){
                this.$refs.titleInput.focus();
            } else if(!this.form.author){
                this.$refs.authorInput.focus();
            } else if(!this.form.edition > 0){
                alert("책의 판 수를 정확히 입력해 주세요!(음수, 0 판 불가!)")
                this.$refs.editionInput.focus();
            } else if(this.form.images.length == 0){
                alert("이미지 등록은 반드시 필요합니다!")
            } else if(this.form.price < 1000 || !this.form.price){
                alert("1000원 이상의 가격으로 등록해 주세요!")
                this.$refs.priceInput.focus();
            }
            else {
                console.log('등록 직전 form : ',this.form)
                this.$http.post(`${this.$config.serverUri}trade/upload_trade`, formData).then(res => {
                    console.log(res.data);
                    alert('등록 되었습니다!');
                    this.$router.replace('/');
                    this.clear();
                }).catch(err => {
                    console.log(err);
                    alert('등록에 실패했습니다..');
                });
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
.tag-container{
    padding: 6px;
    text-align: center;
    width: 150px;
    background: rgb(204, 204, 204);
    border-radius: 3px;
    display: flex;
    flex-direction: row;
}
.card-margins {
    margin-bottom: 4px;
    margin-top: 4px;
    display: inline-block;
    vertical-align: top;
}
.no-bg-btn{
    background-color: transparent;
    border: none;
    color: black;
    font-size: 14px;
}
.hidden-overflow-text{
    text-overflow: ellipsis;
    overflow: hidden; 
    flex:2;
}
</style>

