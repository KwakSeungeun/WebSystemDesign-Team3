var mongoose = require('mongoose');

const fs = require('fs');
const async = require('async');

var path = require('path');

var Trade = require(path.resolve(__dirname, "./models/trade"));
var User = require(path.resolve(__dirname, "./models/user"));

const config = require('./config');

mongoose.connect(config.mongodbUri, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error);

funct = function() {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            Trade.find({}).then(function(result) {
                async.each(result, function (i, callback) {
                    if(i.time_stamp != undefined) {
                        if(Date.now() - i.time_stamp >= 604800000) {
                            Trade.deleteOne({_id: i._id}).then(function(result) {
                                console.log(result);
                                callback(null);
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
        }, 3000);
    });
}

async function main() {
    while(1) {
        await funct();
        console.log("world");
    }
}

main();