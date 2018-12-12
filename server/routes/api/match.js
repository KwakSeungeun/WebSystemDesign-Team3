const express = require('express');
const router = express.Router();
const Match = require('../../models/match');
const User = require('../../models/users');
const Trade = require('../../models/trade');
const _ = require('lodash')
const mongoose= require('mongoose')
const async = require('async')

const auth = require("../middleware/auth");

router.use(auth);

router.get('/buyer',(req,res)=>{
    let send_info = [];
    const objectId = mongoose.Types.ObjectId;
    Match.find({buyer_id: req.decoded._id}).then(result=>{
        async.each(result, function(info, callback) {
            let obj = { trade_id: info.trade_id, location: '', price: 0, title: '' };
            Trade.find({_id: objectId(info.trade_id)}).then(result=>{
                if(result.length == 0) {
                    callback(new Error("500 error"));
                }
                else {
                    obj.title = result[0].title;
                    obj.price = result[0].price;
                    obj.location = result[0].location;
                    send_info.push(obj);
                    callback(null);
                }
            }).catch(err=>{
               console.log(err);
               callback(new Error("500 error"));
            });
        }, function(err) {
            if(err) res.status(500).send("server error");
            res.send(send_info);
        });
    });
});

router.get('/seller',async (req,res)=>{
    let send_info = [];
    const objectId = mongoose.Types.ObjectId;
    Match.find({seller_id: req.decoded._id}).then(result=>{
        async.each(result, function(info, callback) {
            let obj = { trade_id: info.trade_id, location: '', price: 0, title: '' };
            Trade.find({_id: objectId(info.trade_id)}).then(result=>{
                if(result.length == 0) {
                    callback(new Error("500 error"));
                }
                else {
                    for (let i = 0; i < result[0].buyers.length; i++) {
                        if (result[0].buyers[i].buyer_id == info.buyer_id) {
                            obj.title = result[0].title;
                            obj.price = result[0].buyers[i].price;
                            obj.location = result[0].buyers[i].location;
                            break;
                        }
                    }

                    if (obj.contact == 2) callback(new Error("500 Error"));
                    else {
                        send_info.push(obj);
                        callback(null);
                    }
                }
            }).catch(err=>{
                console.log(err);
                callback(new Error("500 error"));
            });
        }, function(err) {
            if(err) res.status(500).send("server error");
            res.send(send_info);
        });
    });
});

module.exports = router;
