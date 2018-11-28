var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');

const fs = require('fs');
const async = require('async');

var path = require('path');

var Trade = require(path.resolve(__dirname, "../../models/trade"));
var Match = require(path.resolve(__dirname, "../../models/match"));

const config = require('../../config');

mongoose.connect(config.mongodbUri, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var db = mongoose.connection;

var router = express.Router();

const bodyParser = require('body-parser');

const auth = require('../middleware/auth');

router.use(auth); // trade 하는 모든 과정은 반드시 로그인 확인 여부가 필요하므로 middleware 를 가져다 씀

router.use(bodyParser.urlencoded({
    extended: false
}));

router.use(function(req, res, next) { // 나중에 빈 문자열 혹은 각종 unvalid 한 데이터를 검사할 middleware. 몽고디비에 접근하는거 조차 막아버리면 퍼포먼스 + DDOS 공격을 어느정도 방어할 수 있다.
    next();
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../../public/Image'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});

var upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }).array('images', 5); // 개수제한 5, 크기제한 10MB
                                                              // images 라는 key 값에 append 해서 보내줄 것(front)

router.post('/upload_trade', function(req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            console.log("error! " + path.resolve(__dirname, '../../public/Image'));
            return res.status(500).send({success:"fail"});
        }
        else {
            // form-data 형식으로 보내기 때문에 middle-ware 로 처리가 불가능함, 나중에 if문 노가다 해야함

            db.on('error', console.error);

            let tmp = [];

            for(let i = 0; i < req.files.length; i++) {
                tmp.push(req.files[i].filename);
            }


            var trade_info = new Trade({
                title: req.body.title, // 책 제목
                author: req.body.author, // 책 저자
                edition: req.body.edition, // 책 판본
                seller_id: req.body.seller_id, // _id가 토큰에 들어있다고 가정한다면 그냥 id 쓰면 될듯
                seller_contact: req.body.seller_contact,
                img_url: tmp, // 이미지 주소, 정확히는 file name
                tag: req.body.tag, //교수님 이름, 과목 등 태그
                comment: req.body.comment, // 판매자가 남기고 싶은 말
                state: req.body.state, // 책의 보존 상태
                price: req.body.price, // 판매자가 설정한 가격
                buyers: [], // 최초 생성이니 빈 array
                time_stamp: Date.now()
            });

            trade_info.save(function (err) {
                if (err) {
                    async.each(tmp, function (i, callback) {
                        fs.unlink(path.resolve(__dirname, "../../public/Image") + '/' + tmp[i], function(err) {
                            if(err) {
                                console.log(tmp + " can't be deleted");
                                callback(error);
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

router.get('/my_trade_list/:seller_id', function(req, res, next) {
    db.on('error', console.error);

    const ObjectId = mongoose.Types.ObjectId;

    Trade.find({"seller_id": ObjectId(req.params.seller_id)}, { "seller_id": 0 }, function(err, result){
        if(err) {
            res.status(500).send({success: "fail"});
        }
        else {
            res.send({success: "success", trade_list: result});
        }
    });
});

router.post('/delete', function(req, res, next) {
    db.on('error', console.error);

    // login 검증은 무조건 필요

    const ObjectId = mongoose.Types.ObjectId;

    Trade.deleteOne({_id: ObjectId(req.body._id), seller_id: ObjectId(req.body.seller_id)}, function(err) {
        if(err) {
            res.status(500).send({success: "fail"});
        }
        else {
            res.send({success: "success"});
        }
    });
});

router.post('/suggest_price', function(req, res, next) {
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
        else {
            return Trade.update({_id: ObjectId(req.body.trade_id)}, { $pull : { buyers: {
                        buyer_id: req.body.buyer_id
                    }
                }
            });
        }
    }).then(function(result) {
        return Trade.update({_id: ObjectId(req.body.trade_id)}, { $push : { buyers: {
                    buyer_id: req.body.buyer_id,
                    price: req.body.price,
                    location: req.body.location,
                    buyer_contact: req.body.buyer_contact
                }
            }
        });
    }).then(function(result) {
        res.send({success: "success"});
    }).catch(function(err) {
        console.log(err);
        if(!flag403 && !flag404) res.status(500).send({success: "fail"});
    });
});

router.post('/match_buyer', function(req, res, next) {
    let flag400 = false;
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
            res.status(404).send({success: "there_is_no_trade_info"});
            flag404 = true;
            throw new Error('404 error');
        }
        else {
            if(result[0].seller_id != req.body.seller_id) {
                res.status(400).send({success:"seller_id_diffrents"});
                flag400 = true;
                throw new Error('400 error');
            }

            if(result[0].buyers.find(function(elem) {
                return elem.buyer_id == req.body.buyer_id;
            }) == undefined) {
                res.status(404).send({success:"there_is_no_buyer"});
                flag404 = true;
                throw new Error('404 error');
            }

            return new Match({
                trade_id:req.body.trade_id,
                seller_id:req.body.seller_id,
                buyer_id:req.body.buyer_id,
            }).save();
        }
    }).then(function(result) {
        res.send({success: "success"});
    }).catch(function(err) {
        console.log(err);
        if(!flag400 && !flag403 && !flag404) res.status(500).send({success: "fail"});
    });
});

module.exports = router;