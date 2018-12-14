var express = require('express');
var crypto = require('crypto');
var sha512 = require('sha512');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var path = require('path');
var User = require(path.resolve(__dirname, "../../models/users"));
const config = require('../../config');

mongoose.connect(config.mongodbUri, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var db = mongoose.connection;

var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: false
}));

function ValidateEmail(mail)  {
    if(/^\w+([\.-]?\w+)*@ajou\.ac\.kr/.test(mail)) {
        return true;
    }
    return false;
}
router.post('/', function(req, res, next) {
    console.log('들어옴',req.body)
    if(ValidateEmail(req.body.email) == false) {
        res.status(403).send({success: "email_valid_fail"});
    }
    else {
        db.on('error', console.error);

        var etoken = crypto.randomBytes(32).toString('hex');
        etoken = req.body.email + etoken;
        etoken = crypto.createHash('sha512').update(etoken).digest('hex');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sbctest2018@gmail.com',
                pass: 'tjqudcks1,'
            }
        });

        var mailOptions = {
            from: 'AjouBookTrade <no-reply@gmail.com>',
            to: req.body.email,
            subject: '아주 북 트레이드 이메일 인증입니다.',
            text: `${config.serverUrl}/auth/register/authorization/`+ etoken
        };

        var user_obj = new User({
            name: req.body.name,
            email: req.body.email,
            pw: req.body.pw,
            phone: req.body.phone,
            preference: req.body.preference,
            email_token: etoken,
            auth: false,
            alarms: [ ], // empty array
            trade_id: []
        });


        User.find({email: req.body.email}, function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({success: "database_fail"});
            }
            else if (result.length == 0) {
                user_obj.save(function (err) {
                    if (err) res.status(500).send({success: "database_fail"});
                    else {
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                                res.status(500).send({success: "email_fail"});
                            } else {
                                res.send({success: "create"});
                            }
                        });
                    }
                });
            }
            else {
                if (result[0].auth) {
                    res.status(400).send({success: "already"});
                }
                else {
                    var query = {email: req.body.email};
                    var newvalues = {$set: {email_token: etoken, pw: req.body.pw}};
                    User.update(query, newvalues, function (err) {
                        if (err) res.status(500).send({success: "database_fail"});
                        else {
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    console.log(error);
                                    res.status(500).send({success: "email_fail"});
                                } else {
                                    res.send({success: "update"});
                                }
                            });
                        }
                    });
                }
            }
        });
    }
});

router.get('/authorization/:authToken', function(req, res, next) {
    db.on('error', console.error);

    var etoken = req.params.authToken;

    User.find({email_token: etoken}, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("database error");
        }
        else {
            if (result.length == 0) {
                if (err) res.status(500).send("database error");
                else res.status(404).send("token invalid");
            }
            else {
                if (result[0].auth) {
                    res.send("already assign");
                }
                else {
                    var query = {email_token: etoken};
                    var newvalues = {$set: {email_token: "", auth: true}};
                    User.update(query, newvalues, function (err) {
                        if (err) res.status(500).send("database_fail");
                        else res.send("인증 성공!");
                    });
                }
            }
        }
    });
});

module.exports = router;
