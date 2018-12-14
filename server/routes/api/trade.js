const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const ObjectId = mongoose.Types.ObjectId;

const fs = require('fs');
const async = require('async');

const path = require('path');

const Users = require(path.resolve(__dirname, "../../models/users"));
const Trade = require(path.resolve(__dirname, "../../models/trade"));
const Match = require(path.resolve(__dirname, "../../models/match"));

const config = require('../../config');


mongoose.connect(config.mongodbUri, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;
const router = express.Router();
const bodyParser = require('body-parser');
const auth = require('../middleware/auth');
const _ = require('lodash');

router.use(bodyParser.urlencoded({
    extended: false
}));

router.use(function(req, res, next) { // 나중에 빈 문자열 혹은 각종 unvalid 한 데이터를 검사할 middleware. 몽고디비에 접근하는거 조차 막아버리면 퍼포먼스 + DDOS 공격을 어느정도 방어할 수 있다.
    next();
});

router.get('/trade_list', function(req, res, next) {
    db.on('error', console.error);

    Trade.find({}, { "seller_id": 0 }, function(err, result){
        if(err) {
            res.status(500).send({success: "fail"});
        }
        else {
            res.send({success: "success", trade_list: result});
        }
    });
});

router.get('/buyers_length/:trade_id', function(req, res, next) {
    const ObjectId = mongoose.Types.ObjectId;
    let flag = false;
    Trade.findOne({_id: ObjectId(req.params.trade_id)}).then(result=>{
        if(result.buyers == undefined) {
            flag = true;
            res.status(404).send("not found");
            throw new Error("404 Error");
        }
        res.send({buyers_length: result.buyers.length});
    }).catch(err => {
        console.log(err);
        if(!flag) res.status(500).send("server error");
    });
});




router.use(auth); // trade 하는 모든 과정은 반드시 로그인 확인 여부가 필요하므로 middleware 를 가져다 씀
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../../public/Image'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});

var upload = multer({ storage: storage }).array('images', 5); // 개수제한 5, 크기제한 10MB// images 라는 key 값에 append 해서 보내줄 것(front)
function validate(req){
    if(req.body.title==null || req.body.title==undefined)
        return false;
    else if(req.body.author==null || req.body.author==undefined)
        return false;
    else if(req.body.edition==null || req.body.edition==undefined || req.body.edition <=0)
        return false;
    else if(req.body.seller_id==null || req.body.seller_id==undefined)
        return false;
    else if(req.body.seller_contact==null || req.body.seller_contact==undefined)
        return false;
    // else if(req.body.tag==null || req.body.tag==undefined)
    //     return false;
    // else if(req.body.comment==null || req.body.comment==undefined)
    //     return false;
    else if(req.body.state==null || req.body.state==undefined)
        return false;
    else if(req.body.price==null || req.body.price==undefined || req.body.price <0)
        return false;
}
router.post('/upload_trade', function(req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            console.log("error! " + path.resolve(__dirname, '../../public/Image'));
            return res.status(500).send({success:"fail"});
        }
        else {
            db.on('error', console.error);
            let tmp = [];
            for(let i = 0; i < req.files.length; i++) {
                tmp.push(req.files[i].filename);
            }
            // if(!validate(req)) res.status(400).send("form data error in form validate process");
            var trade_info = new Trade({
                title: req.body.title, // 책 제목
                author: req.body.author, // 책 저자
                edition: req.body.edition, // 책 판본
                seller_id: req.decoded._id, // _id가 토큰에 들어있다고 가정한다면 그냥 id 쓰면 될듯
                seller_contact: req.body.seller_contact,
                img_url: tmp, // 이미지 주소, 정확히는 file name
                tag: req.body.tag, //교수님 이름, 과목 등 태그
                comment: req.body.comment, // 판매자가 남기고 싶은 말
                state: req.body.state, // 책의 보존 상태
                price: req.body.price, // 판매자가 설정한 가격
                buyers: [], // 최초 생성이니 빈 array
                status: 0,
                time_stamp: Date.now(),
                location: req.body.location
            });

            trade_info.save(function (err) {
                if (err) {
                    async.each(tmp, function (i, callback) {
                        fs.unlink(path.resolve(__dirname, "../../public/Image") + '/' + i, function(err) {
                            if(err) {
                                console.log(tmp + " can't be deleted");
                                callback(new Error("can't delete"));
                            }
                            else {
                                callback(null);
                            }
                        });
                    }, function(err) {
                        if(err) console.log(err);
                        return res.status(500).send({success: "database_fail"});
                    });

                }
                else {
                    return res.send({success:"success"});
                }
            });
        }
    });
});

router.get('/my_trade_list', function(req, res, next) {
    db.on('error', console.error);

    const ObjectId = mongoose.Types.ObjectId;

    Trade.find({"seller_id": ObjectId(req.decoded._id)}, { "seller_id": 0 }, function(err, result){
        if(err) {
            res.status(500).send({success: "fail"});
        }
        else {
            res.send({success: "success", trade_list: result});
        }
    });
});
router.use('/delete',function(req,res,next){
    if(req.body.trade_id==null || req.body.trade_id==undefined)
        res.status(400).send("trade_id error");
    else next();
});

router.post('/delete', function(req, res, next) {
    db.on('error', console.error);

    // login 검증은 무조건 필요

    const ObjectId = mongoose.Types.ObjectId;

    Trade.deleteOne({_id: ObjectId(req.body.trade_id), seller_id: ObjectId(req.decoded._id)}, function(err) {
        if(err) {
            res.status(403).send({success: "fail"});
        }
        else {
            res.send({success: "success"});
        }
    });
});

router.use('/suggest_price',function(req,res,next){
    if(req.body.trade_id==null || req.body.trade_id==undefined)
        res.status(400).send("trade_id error");
    else if(req.body.price == null || req.body.price <= 0)
        res.status(400).send("sell price error");
    else if(req.body.location == null || req.body.location ==undefined)
        res.status(400).send("location error");
    else if(req.body.buyer_id == null || req.body.buyer_id == undefined)
        res.status(400).send("buyer id error");
    else if(req.body.buyer_contact == null || req.body.buyer_contact == undefined)
        res.status(400).send("buyer_contact error");
    else next();
});

router.post('/suggest_price', function(req, res, next) {
    let tmp;
    let flag403 = false;
    let flag404 = false;
    const ObjectId = mongoose.Types.ObjectId;

    Match.find({trade_id: req.body.trade_id}).then(function(result) {
        if(result.length > 0) {
            res.status(403).send({success: "there_is_already_matched"});
            flag403 = true;
            throw new Error('403 error');
        }
        return Trade.find({_id: ObjectId(req.body.trade_id)});
    }).then(function(result) {
        if(result.length == 0) {
            flag404 = true;
            res.status(404).send({success: "there_is_no_trade_info"});
            throw new Error('404 error');
        }
        else if(result[0].seller_id == req.decoded._id) {
            res.status(403).send({success: "seller_can_not_request_own_trade"});
            flag403 = true;
            throw new Error('403 error');
        }
        else {
            if(result[0].status == 1) {
                res.status(403).send({success: "expired"});
                flag403 = true;
                throw new Error('403 error');
            }
            if(result[0].status == 2) {
                res.status(403).send({success: "there_is_already_end_success"});
                flag403 = true;
                throw new Error('403 error');
            }
            if(result[0].status == 3) {
                res.status(403).send({success: "there_is_already_end_trade"});
                flag403 = true;
                throw new Error('403 error');
            }

            tmp = result[0].seller_id;
            return Trade.update({_id: ObjectId(req.body.trade_id)}, { $pull : { buyers: {
                        buyer_id: req.decoded._id
                    }
                }
            });
        }
    }).then(function(result) {
        return Trade.update({_id: ObjectId(req.body.trade_id)}, { $push : { buyers: {
                    buyer_id: req.decoded._id,
                    price: req.body.price,
                    location: req.body.location,
                    buyer_contact: req.body.buyer_contact
                }
            }
        });
    }).then(function(result) {
        return Users.update({_id: req.decoded._id}, { $push: { trade_id: req.body.trade_id }});
    }).then(function(result) {
        Users.update({_id: ObjectId(tmp)}, {$push: { alarms: {
                    trade_id: req.body.trade_id,
                    contents: "누군가가 새로운 가격을 제시했습니다!",
                    read: false
                }
            }
        }).then(function(result) {
            console.log(result);
            res.send({success: "success"});
        }).catch(function(err) {
            console.log(err);
            res.send({success: "success"});
        });
    }).catch(function(err) {
        console.log(err);
        if(!flag403 && !flag404) res.status(500).send({success: "fail"});
    });
});
router.use('/match_buyer', function(req,res,next){
    if(req.body.trade_id==null || req.body.trade_id==undefined)
        res.status(400).send("trade_id error");
    else if(req.body.buyer_id==null || req.body.buyer_id==undefined)
        res.status(400).send("buyer_id error");
    else next();
});
router.post('/match_buyer', function(req, res, next) {
    let flag400 = false;
    let flag403 = false;
    let flag404 = false;
    let tmp;
    const ObjectId = mongoose.Types.ObjectId;
    Match.find({trade_id: req.body.trade_id}).then(function(result) {
        if(result.length > 0) {
            res.status(403).send({success: "there_is_already_matched"});
            flag403 = true;
            throw new Error('403 error');
        }
        return Trade.find({_id: ObjectId(req.body.trade_id)});
    }).then(function(result) {
        if(result.length == 0) {
            res.status(404).send({success: "there_is_no_trade_info"});
            flag404 = true;
            throw new Error('404 error');
        }
        else {
            if(result[0].seller_id != req.decoded._id) {
                res.status(400).send({success:"seller_id_diffrents"});
                flag400 = true;
                throw new Error('400 error');
            }
            // if(result[0].status == 1) {
            //     res.status(403).send({success: "expired"});
            //     flag403 = true;
            //     throw new Error('403 error');
            // }
            if(result[0].status == 2) {
                res.status(403).send({success: "there_is_already_end_success"});
                flag403 = true;
                throw new Error('403 error');
            }
            if(result[0].status == 3) {
                res.status(403).send({success: "there_is_already_end_trade"});
                flag403 = true;
                throw new Error('403 error');
            }

            // if(result[0].buyers.find(function(elem) {
            //     return elem.buyer_id == req.body.buyer_id;
            // }) == undefined) {
            //     res.status(404).send({success:"there_is_no_buyer"});
            //     flag404 = true;
            //     throw new Error('404 error');
            // }

            tmp = result[0].buyers;

            return new Match({
                trade_id:req.body.trade_id,
                seller_id:req.decoded._id,
                buyer_id:req.body.buyer_id,
            }).save();
        }
    }).then(function(result) {
        return Trade.update({_id: ObjectId(req.body.trade_id)}, {$set: {status: 2}});
    }).then(function(result) {
        async.each(tmp, function(i, callback) {
            if(i.buyer_id == ObjectId(req.body.buyer_id)) {
                Users.update({_id: ObjectId(i.buyer_id)}, {$push: { alarms: {
                            trade_id: req.body.trade_id,
                            contents: "매칭이 성사되었습니다!",
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
            }
            else {
                Users.update({_id: ObjectId(i.buyer_id)}, {$push: { alarms: {
                            trade_id: req.body.trade_id,
                            contents: "매칭이 종료되었습니다. 판매자가 다른 거래자를 선택했습니다.",
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
            }
        }, function(err) {
            if(err) console.log(err);
            Users.update({_id: ObjectId(req.decoded._id)}, {$push: { alarms: {
                        trade_id: req.body.trade_id,
                        contents: "매칭이 성사되었습니다!",
                        read: false
                    }
                }
            }).then(function(result) {
                console.log(result);
                res.send({success: "success"});
            }).catch(function(err) {
                console.log(err);
                res.send({success: "success"});
            });
        });
    }).catch(function(err) {
        console.log(err);
        if(!flag400 && !flag403 && !flag404) res.status(500).send({success: "fail"});
    });
});

router.get('/matched/:id/:who', function(req, res, next) {
    const ObjectId = mongoose.Types.ObjectId;

    let flag403 = false;
    let flag404 = false;
    let tmpid;
    let tmpcontact;
    Match.find({trade_id: req.params.id}).then(function(result) {
        if(result.length == 0) {
            flag404 = true;
            res.status(404).send("not found");
            throw new Error("404 error");
        }
        if(req.params.who == '0') {
            if(result[0].seller_id != req.decoded._id) {
                flag403 = true;
                res.status(403).send("bad request");
                throw new Error("403 error");
            }

            tmpid = result[0].buyer_id;
        }
        else {
            if(result[0].buyer_id != req.decoded._id) {
                flag403 = true;
                res.status(403).send("bad request");
                throw new Error("403 error");
            }

            tmpid = result[0].seller_id;
        }

        return Trade.find({_id: ObjectId(req.params.id)});
    }).then(function(result) {
        if(result.length == 0) {
            flag404 = true;
            res.status(404).send("not found");
            throw new Error("404 error");
        }

        if(req.params.who == '0') {
            let obj = result[0].buyers.find(function(x) {
                return x.buyer_id == tmpid;
            });
            if(obj == undefined) {
                flag404 = true;
                res.status(404).send("not found");
                throw new Error("404 error");
            }

            tmpcontact = obj.buyer_contact;
        }
        else {
            tmpcontact = result[0].seller_contact;
        }

        return Users.find({_id: ObjectId(tmpid)});
    }).then(function(result) {
        if(result.length == 0) {
            flag404 = true;
            res.status(404).send("not found");
            throw new Error("404 error");
        }

        if(tmpcontact == 0) {
            res.send(result[0].email);
        }
        else {
            res.send(result[0].phone);
        }
    }).catch(function(err) {
        console.log(err);
        if(!flag404) res.status(500).send("server error");
    });
});

// close trade
router.post('/close',function(req,res){
    let flag = false;
    Trade.findById(req.body.trade_id).then(function(trade) {
        if(!trade) {
            flag = true;
            res.status(404).json({ error: 'trade not found' });
            throw new Error('trade not found');
        }

        trade.status = 3; // 실패로 상태 변경
        return trade.save();
    }).then(()=>{
        let pushAlarms = {
            trade_id: req.body.trade_id,
            contents: "판매자가 책 장터를 종료했습니다. 다른 장터에서 책을 구해보세요!",
            read: false
        };
        let updateBuyers = [];
        _.forEach(req.body.buyers, (value, index)=>{
            updateBuyers.push(ObjectId(value.buyer_id));
        });
        Users.updateMany(
            { _id : {$in : updateBuyers}},
            {$push : {"alarms" : pushAlarms}}
        ).then(result=>{
            res.json({success: 'trade updated and push alarms'});
        }).catch(err=>{
            res.status(500).json({error: 'failed to push alarms'});
            flag = true;
            throw new Error("failed to push alarms");
        })
    }).catch(function(err) {
        console.log(err);
        if(!flag) res.status(500).json({error: 'database failure'});
    });
});



module.exports = router;