const express = require('express');
const router = express.Router();
const Match = require('../../models/match');
const User = require('../../models/users');
const Trade = require('../../models/trade');
const _ = require('lodash')
const mongoose= require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const async = require('async')

router.post('/buyer',async (req,res)=>{
    let buyer = req.body.buyer_id
    let matchList=await Match.find({buyer_id:buyer}) //내가 바이어
    console.log('매치리스트',matchList)
    var sellerId = [];
    let tempBookId=[]
    let totalSeller=[]
    let totalTrade=[]
     _.forEach(matchList,(value, index)=>{
        sellerId.push(ObjectId(value.seller_id))
        tempBookId.push(ObjectId(value.trade_id))
    });

    console.log('셀러아이디',sellerId)

    let idx = [];
    for(let i = 0; i < sellerId.length; i++) {
        idx.push(i);
    }

    async.each(idx,(i,callback)=>{
        let flag = false;
        // trade_id[i]
        console.log('here',i)
        let tmpUser = {};
        let tmpTrade = {};
        User.find({_id: ObjectId(sellerId[i])}).then(result => {
            if(result.length == 0) {
                flag = true;
                throw new Error("no user");
            }
            tmpUser = result[0];
            console.log('11')
            return Trade.find({_id: ObjectId(tempBookId[i])});
        }).then(result => {
            if(result.length == 0) {
                flag = true;
                throw new Error("no user");
            }
            console.log('22')
            tmpTrade = result[0];
            totalTrade.push(tmpTrade)
            totalSeller.push(tmpUser)
            callback(null);
        }).catch(err => {
            console.log(err);
            callback(null);
        });
    }, err => {
        console.log('여기에 안옴')
        if(err) {
            console.log(err);
            res.status(500).send();
        }
        res.send({
            trade : totalTrade,
            seller : totalSeller
        });
    })

    // // console.log("나옴")
    // let tempList=await User.find({"_id":{$in:result}})
    // let tempBooklist=await Trade.find({"_id":{$in:tempBook}})
    // _.forEach(tempBooklist,(value,index)=>{
    //     bookName.push(value.title)
    // })
})

router.post('/seller',async (req,res)=>{
    let seller = req.body.seller_id
    let matchList=await Match.find({seller_id:seller}) //내가 셀러
    console.log('매치리스트',matchList)
    var buyerId = [];
    let tempBookId=[]
    let totalbuyer=[]
    let totalTrade=[]
     _.forEach(matchList,(value, index)=>{
        buyerId.push(ObjectId(value.buyer_id))
        tempBookId.push(ObjectId(value.trade_id))
    });

    console.log('바이어 아이디',buyerId)

    let idx = [];
    for(let i = 0; i < buyerId.length; i++) {
        idx.push(i);
    }

    async.each(idx,(i,callback)=>{
        let flag = false;
        // trade_id[i]
        console.log('here',i)
        let tmpUser = {};
        let tmpTrade = {};
        User.find({_id: ObjectId(buyerId[i])}).then(result => {
            if(result.length == 0) {
                flag = true;
                throw new Error("no user");
            }
            tmpUser = result[0];
            console.log('11')
            return Trade.find({_id: ObjectId(tempBookId[i])});
        }).then(result => {
            if(result.length == 0) {
                flag = true;
                throw new Error("no user");
            }
            console.log('22')
            tmpTrade = result[0];
            totalTrade.push(tmpTrade)
            totalbuyer.push(tmpUser)
            callback(null);
        }).catch(err => {
            console.log(err);
            callback(null);
        });
    }, err => {
        console.log('여기에 안옴')
        if(err) {
            console.log(err);
            res.status(500).send();
        }
        res.send({
            trade : totalTrade,
            buyer : totalbuyer
        });
    })
})

module.exports = router;
