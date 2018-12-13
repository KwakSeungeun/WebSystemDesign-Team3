var mongoose = require('mongoose');

const fs = require('fs');
const async = require('async');

var path = require('path');

var Trade = require(path.resolve(__dirname, "./models/trade"));
var User = require(path.resolve(__dirname, "./models/users"));

const config = require('./config');

mongoose.connect(config.mongodbUri, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error);

funct = function() {
    const ObjectId = mongoose.Types.ObjectId;

    return new Promise((resolve, reject) => {
        setTimeout(function () {
            Trade.find({}).then(function(result) {
                async.each(result, function (i, callback) {
                    if(i.status != 0) callback(null);
                    else if(i.time_stamp != undefined) {
                        if(Date.now() - i.time_stamp >= 604800000) {
                            console.log(i._id);
                            Trade.update({_id: ObjectId(i._id.toString())}, {$set: {status: 1}}).then(function(result) { // 나중에 update로 고치기
                                console.log(result);
                                User.update({_id: ObjectId(i.seller_id)}, {$push: { alarms: {
                                            trade_id: i._id,
                                            contents: "매칭 시간이 종료되었습니다!",
                                            read: false
                                        }
                                    }
                                }).then(function(result) {
                                    console.log(result);

                                    async.each(i.buyers, function(j, callback) {
                                        User.update({_id: ObjectId(j.buyer_id)}, {$push: { alarms: {
                                                    trade_id: i._id,
                                                    contents: "매칭 시간이 종료되었습니다!",
                                                    read: false
                                                }
                                            }
                                        }).then(function(result) {
                                            console.log(result);
                                            callback(null);
                                        }).catch(function(err) {
                                            console.log(err);
                                            callback(null);
                                        });
                                    }, function(err) {
                                        if (err) console.log(err);
                                        callback(null);
                                    });
                                }).catch(function(err) {
                                    console.log(err);
                                    callback(null);
                                });
                            }).catch(function(err) {
                                console.log(err);
                                callback(null);
                            });
                        }
                        else callback(null);
                    }
                    else callback(null);
                }, function(err) {
                    if(err) {
                        console.log(err);
                        resolve(err);
                    }
                    else resolve("success");
                });
            }).catch(function(err) {
                console.log(err);
                return resolve(err);
            });
        }, 86400000);
    });
}

async function main() {
    while(1) {
        await funct();
    }
}

main();