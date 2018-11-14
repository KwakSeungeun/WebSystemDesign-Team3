var express = require('express');
var crypto = require('crypto');
var sha256 = require('sha256');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var path = require('path');

var user = require(path.resolve(__dirname, "../models/user_model"));

mongoose.connect('mongodb://localhost:27017');
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
    if(ValidateEmail(req.body.email) == false) {
        res.send({success: "email_valid_fail"});
    }
    else {
        db.on('error', console.error);

        var etoken = crypto.randomBytes(32).toString('hex');
        etoken = req.body.email + etoken;
        etoken = sha256(etoken);

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_mail@gmail.com',
                pass: 'your_password'
            }
        });

        var mailOptions = {
            from: 'AjouBookAuction <no-reply@gmail.com>',
            to: req.body.email,
            subject: '아주 북 옥션 이메일 인증입니다.',
            text: 'http://localhost:3000/register/authorization/' + etoken
        };

        var user_obj = new user({
            name: "", // req.body.name
            email: req.body.email,
            pw: req.body.pw,
            phone: "", // req.body.phone
            preference: "", // req.body.preference
            email_token: etoken,
            auth: false,
            alarms: [ ] // empty array
        });


        user.find({email: req.body.email}, function(err, result) {
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
                    res.send({success: "already"});
                }
                else {
                    var query = {email: req.body.email};
                    var newvalues = {$set: {email_token: etoken, pw: req.body.pw}};
                    user.update(query, newvalues, function (err) {
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

    user.find({email_token: etoken}, function(err, result) {
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
                    user.update(query, newvalues, function (err) {
                        if (err) res.status(500).send("database_fail");
                        else res.send("인증 성공!");
                    });
                }
            }
        }
    });
});

module.exports = router;
