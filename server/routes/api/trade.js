var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');

const fs = require('fs');
const async = require('async');

var path = require('path');

var Trade = require(path.resolve(__dirname, "../../models/trade"));

const config = require('../../config');

mongoose.connect(config.mongodbUri, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var db = mongoose.connection;

var router = express.Router();

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: false
}));


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
                img_url: tmp, // 이미지 주소, 정확히는 file name
                tag: req.body.tag, //교수님 이름, 과목 등 태그
                comment: req.body.comment, // 판매자가 남기고 싶은 말
                state: req.body.state, // 책의 보존 상태
                price: req.body.price, // 판매자가 설정한 가격
                buyers: [] // 최초 생성이니 빈 array
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
    const ObjectId = mongoose.Types.ObjectId;
    Trade.find({_id: ObjectId(req.body.trade_id)}).then(function(result) {
        if(result.length == 0) {
            res.status(404).send({success: "there_is_no_trade_info"});
            return error;
        }
        else {
            console.log(result);
            return Trade.update({_id: ObjectId(req.body.trade_id)}, { $push : { buyers: {
                        buyer_id: req.body.buyer_id,
                        price: req.body.price,
                        location: req.body.location,
                        buyer_contact: req.body.buyer_contact
                    }
                }
            });
        }
    }).then(function(result) {
        console.log(result);
        res.send({success: "success"});
    }).catch(function(err) {
        console.log(err);
        res.status(500).send({success: "fail"});
    });
});

module.exports = router;