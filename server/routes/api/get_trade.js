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