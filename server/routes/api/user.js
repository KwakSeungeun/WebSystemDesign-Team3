const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const config = require('../../config');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');


const db = mongoose.connection;
mongoose.connect(config.mongodbUri, { useNewUrlParser: true });

router.use(auth);

router.get('/alarms', function(req, res, next) {
    const objectId = mongoose.Types.ObjectId;
    User.find({_id: objectId(req.decoded._id)}).then(function(result) {
        res.send({success: "success", alarms: result[0].alarms});
    }).catch(function(err) {
        console.log(err.data);
        res.status(403).send({success: "error"});
    });
});

router.post('/alarms/read', function(req, res, next) {
    if(req.body.read) {
        res.send("already read");
    }
    else {
        const objectId = mongoose.Types.ObjectId;
        User.updateOne({_id: objectId(req.decoded._id), "alarms._id":objectId(req.body._id)}, {$set: {"alarms.$.read": true}}).then(function (result) {
            res.send("success");
        }).catch(function (err) {
            res.status(500).send("fail");
        });
    }
});

router.post('/alarms/delete', function(req, res, next) {
    const objectId = mongoose.Types.ObjectId;
    User.update({_id: objectId(req.decoded._id)}, {$pull: {alarms: {_id: objectId(req.body._id)}}}).then(function(result) {
        console.log(result);
        res.send("success");
    }).catch(function (err) {
        res.status(500).send("fail");
    });
});

router.get('/', (req,res)=>{
    let flag = false;
    const objectId = mongoose.Types.ObjectId;
    User.find({_id: objectId(req.decoded._id)}).then(function(result) {
        if(result.length == 0) {
            flag = true;
            res.status(404).send("there is no user");
            throw Error("404 error");
        }
        user = result[0];
        let _id = user._id
        let trade_id = user.trade_id
        let name = user.name
        let email = user.email
        let phone = user.phone
        let preference = user.preference
        res.send({_id: _id, trade_id: trade_id, name: name, email: email, phone: phone, preference: preference});
    }).catch(function(err) {
        console.log(err);
        if(!flag) res.status(500).send("server error");
    });
})

router.put('/update',(req,res)=>{
    //console.log('들어왔당')
    //console.log(req.body)

    const objectId = mongoose.Types.ObjectId;
    let flag = false;

    User.find({_id:objectId(req.decoded._id)}).then(result=>{
        if(result.length == 0) {
            flag = true;
            res.status(404).send("there is no user");
            throw new Error("404 error");
        }

        if(result[0].pw != req.body.b_pw) {
            flag = true;
            res.status(403).send("password_error");
            throw new Error("403 error");
        }

        let user;
        if(req.body.a_pw != ''){
            user = {
                name: req.body.name,
                pw: req.body.a_pw,
                phone: req.body.phone,
                preference:req.body.preference
            };
        }
        else {
            user = {
                name: req.body.name,
                phone: req.body.phone,
                preference:req.body.preference
            };
        }

        User.update({_id: objectId(req.decoded._id)}, {$set: user}).then(result => {
            console.log(result);
            res.send("success");
        }).catch(err => {
            console.log(err);
            res.status(500).send("server_error");
        })
    }).catch(err => {
        console.log(err);
        if(!flag) res.status(500).send("server_error");
    });
})


module.exports = router;