// Create auction schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var buyerSchema = new Schema({
    buyer_id: String,
    price: Number, //구매자가 원하는 가격
    location: String //구매자가 원하는 희망 장소
});
var auctionSchema = new Schema({
    book_id: String,
    seller_id: String, //판매자
    img_url: [String], //책 이미지
    tag: String, //교수님 이름, 과목 등 태그
    comment: String, // 판매자가 남기고 싶은 말
    state: Number, // 책의 보존 상태
    buyers:[buyerSchema] //구매자들
});

module.exports = mongoose.model('auction',auctionSchema);