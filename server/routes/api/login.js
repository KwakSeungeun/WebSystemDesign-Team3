const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require('../../models/users');
const config = require('./config');
const mongoose = require('mongoose');

const db = mongoose.connection;
mongoose.connect(config.mongodbUri, { useNewUrlParser: true });

router.post('/',function(req,res,next){
  const {email, pw} = req.body;
  const secret = req.app.get('jwt-secret');
  console.log("secrete : ",secret);
  
  // check exist user
  const check = function(user){
    if(!user){  //유저 존재 안함
      throw new Error('login failed');
    } else {
      if(user.verify(pw)){ //비밀번호 맞음
        const p = new Promise((resolve,reject)=>{
          jwt.sign({
            email: user.email
          },
          secret,
          {
            expiresIn: '7d',
          },
          (err, token) => {
            if (err) reject(err);
            resolve(token);
          }
        )
        });
        return p;
      } else { //비밀번호 틀림
        throw new Error('login failed');
      }
    }
  };

  // return token
  const respond = function(token){
    res.json({
      message: 'logged in successfully',
      token
    });
  };

  // Error handling
  const onError = function(error){
    res.status(403).json({
        message: error.message
    })
  };

  User.findOneByEmail(email)
  .then(check)
  .then(respond)
  .catch(onError);
});

module.exports = router;
