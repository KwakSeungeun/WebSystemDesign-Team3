const express = require('express');
const router = express.Router();
const Match = require('../../models/match');
const User = require('../../models/users');
const _ = require('lodash')
const mongoose= require('mongoose')
const ObjectId = mongoose.Types.ObjectId;


router.post('/buyer',async (req,res)=>{
    console.log(req)
    let buyer = req.body.buyer_id
    let matchList=await Match.find({buyer_id:buyer})
    console.log('매치리스트',matchList)
    let result = [];
    _.forEach(matchList, (value, index)=>{
        result.push(ObjectId(value.seller_id))
    });
    console.log('리저트',result)
    let tempList=await User.find({"_id":{$in:result}})
    res.send(tempList)
})

router.post('/seller',async (req,res)=>{
    console.log(req)
    let seller = req.body.seller_id
    let matchList=await Match.find({seller_id:seller})
    console.log('매치리스트',matchList)
    let result = [];
    _.forEach(matchList, (value, index)=>{
        result.push(ObjectId(value.buyer_id))
    });
    console.log('리저트',result)
    let tempList=await User.find({"_id":{$in:result}})
    res.send(tempList)})




module.exports = router;
