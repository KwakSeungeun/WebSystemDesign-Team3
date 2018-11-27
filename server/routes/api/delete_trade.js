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

router.post('/', function(req, res, next) {
    db.on('error', console.error);

    Auction.deleteOne({_id: req.body._id}, function(err) {
        if(err) {
            res.status(500).send({success: "fail"});
        }
        else {
            res.send({success: "success"});
        }
    });
});

module.exports = router;