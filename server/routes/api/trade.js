var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');

const fs = require('fs');
const async = require('async');

var path = require('path');

var Trade = require(path.resolve(__dirname, "../../models/trades"));

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

var upload = multer({ storage: storage }).array('images', 5); // 개수제한 5, ******나중에 크기제한 10MB도 넣을것*****
                                                              // images 라는 key 값에 append 해서 보내줄 것(front)

router.post('/upload_trade', function(req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            console.log("error! " + path.resolve(__dirname, '../../public/Image'));
            return res.status(500).send({success:"fail"}); // 실패시 옥션 업로드 자체를 막아버릴 것(front)
        }
        else {
            db.on('error', console.error);

            let tmp = [];

            for(let i = 0; i < req.files.length; i++) {
                tmp.push(req.files[i].filename);
            }

            var trade_info = new Trade({
                book_id: req.body.book_id, // 나중에 수정
                seller_id: req.body.seller_id, // 이메일로 해도 상관없을듯 하다. 구매자한테는 seller_id 만 쏙 빼서 날리면 되니
                img_url: tmp, // 이미지 주소, 정확히는 file name
                tag: req.body.tag, //교수님 이름, 과목 등 태그
                comment: req.body.comment, // 판매자가 남기고 싶은 말
                state: req.body.state, // 책의 보존 상태
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

module.exports = router;