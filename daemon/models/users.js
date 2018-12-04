// Create user schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const crypto = require('crypto');
const config = require('../config');

var alarmSchema = new Schema({
  trade_id: String,
  contents: String, //알림 내용
  read: Boolean // 알람 읽음 여부
});

var userSchema = new Schema({
  name: String,
  email: String,
  pw: String,
  phone: String,
  preference: String, // 선호하는 판매장소
  email_token: String, // 이메일 인증 토큰
  auth: Boolean, // 허가 여부
  alarms: [alarmSchema], // 사용자가 진행중인 거래의 상태에 따른 알람
  trade_id: [String]
});

// find one user by using username
userSchema.statics.findOneByEmail = function(email) {
  return this.findOne({
      email
  }).exec()
}

// verify the password of the User documment
userSchema.methods.verify = function(pw) {
  return this.pw === pw;
}

module.exports = mongoose.model('user',userSchema);