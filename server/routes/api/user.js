const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const config = require('../../config');
const mongoose = require('mongoose');


const db = mongoose.connection;
mongoose.connect(config.mongodbUri, { useNewUrlParser: true });


router.get('/:email',async (req,res)=>{
    let uemail=req.params.email
    let user=await User.findOneByEmail(uemail)
    let _id=user._id
    let trade_id=user.trade_id
    let name=user.name
    let email=user.email
    let phone=user.phone
    let preference=user.preference
    let alarms=user.alarms
    res.send({_id,trade_id,name,email,phone,preference,alarms})
})


router.put('/update',(req,res)=>{
    console.log('들어왔당')
    console.log(req.body)

    User.findOne({email:req.body.email},(err,user)=>{
        if(err){
            return res.status(500).json({message:"cannot find email"})
        }else{
            console.log(user)
            user.pw=req.body.pw,
            user.phone=req.body.phone,
            user.preference=req.body.preference, // 선호하는 판매장소
        
            user.save(err=>{
                console.log('여기당')
                if(err){
                    res.status(500).json({message:"update failed"})
                }
                else{
                    res.json({message:"userInfo updated"})
                }
            })
        }

    })
})


module.exports = router;