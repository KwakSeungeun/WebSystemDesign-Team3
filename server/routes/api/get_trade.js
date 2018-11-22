var express = require('express');
var mongoose = require('mongoose');

var path = require('path');

var Auction = require(path.resolve(__dirname, "../../models/auctions"));

const config = require('../../config');

mongoose.connect(config.mongodbUri, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var db = mongoose.connection;

var router = express.Router();

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: false
}));

router.get('/', function(req, res, next) {
    db.on('error', console.error);

    Auction.find({}, function(err, result){
        if(err) {
            res.status(500).send({success: "fail"});
        }
        else {
            res.send({success: "success", trade_list: result});
        }
    });
});

router.get('/my_auction_list/:mail', function(req, res, next) {
    db.on('error', console.error);

    var auction_info = new Auction({
        book_id: res.body.book_id,
        seller_id: res.body.seller_id, // 이메일로 해도 상관없을듯 하다. 구매자한테는 seller_id 만 쏙 빼서 날리면 되니
        img_url: res.body.img_url, //front 단에서, list로 넘겨주도록 하자.
        tag: res.body.tag, //교수님 이름, 과목 등 태그
        comment: res.body.comment, // 판매자가 남기고 싶은 말
        state: res.body.state, // 책의 보존 상태
        buyers: [] // 최초 생성이니 빈 array
    });

    Auction.find({}).select({ "_id": 1, "book_id" : 1, "seller_id": 0, "img_url": 1, "tag": 1, "comment": 1, "state": 1, "buyers": 1}).exec(function(err, result){
        if(err) {
            res.status(500).send({success: "fail"});
        }
        else {
            res.send({success: "success", trade_list: result});
        }
    });
});

module.exports = router;