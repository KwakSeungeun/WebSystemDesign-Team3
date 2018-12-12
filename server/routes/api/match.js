const express = require('express');
const router = express.Router();
const Match = require('../../models/match');
const User = require('../../models/users');
const Trade = require('../../models/trade');
const _ = require('lodash')
const mongoose= require('mongoose')
const ObjectId = mongoose.Types.ObjectId;


router.post('/buyer',async (req,res)=>{
    console.log(req.body)
    let buyer = req.body.buyer_id
    let matchList=await Match.find({buyer_id:buyer})
    console.log('매치리스트',matchList)
    var result = [];
    let tempBook=[]
    let bookName=[]
     _.forEach(matchList,(value, index)=>{
        result.push(ObjectId(value.seller_id))
        tempBook.push(ObjectId(value.trade_id))
    });
        
    console.log('바이어 result는 나와야하는데....',result)
    console.log('바이어 tempBook는 나와야하는데....',tempBook)

    // // console.log("나옴")
    // let tempList=await User.find({"_id":{$in:result}})
    // let tempBooklist=await Trade.find({"_id":{$in:tempBook}})
    // _.forEach(tempBooklist,(value,index)=>{
    //     bookName.push(value.title)
    // })
    res.json({
        user: result,
        trade : tempBook
    })
})

router.post('/seller',async (req,res)=>{
    console.log(req.body)
    let seller = req.body.seller_id
    let matchList=await Match.find({seller_id:seller})
    console.log('매치리스트',matchList)
    let result = [];
    let tempBook=[]
    let bookName=[]
    _.forEach(matchList, (value, index)=>{
        result.push(ObjectId(value.buyer_id))
        tempBook.push(ObjectId(value.trade_id))
    });
    let tempList=await User.find({"_id":{$in:result}})
    let tempBooklist=await Trade.find({"_id":{$in:tempBook}})
    _.forEach(tempBooklist,(value,index)=>{
        bookName.push(value.title)
    })
    res.json({
        user : tempList,
        book : bookName
    })
})

module.exports = router;
