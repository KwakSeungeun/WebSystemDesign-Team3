// Create user schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var alarmSchema = new Schema({
  auction_id: String,
  contents: String, //알림 내용
  read: Boolean // 알람 읽음 여부
});
var userSchema = new Schema({
  name: String,
  email: String,
  pw: String,
  phone: String,
  preference: String, // 선호하는 판매장소
  auth: String, // ?
  alarms: [alarmSchema] // 사용자가 진행중인 거래의 상태에 따른 알람
});

module.exports = mongoose.model('user',userSchema);