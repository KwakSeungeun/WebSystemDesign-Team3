const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require('../../models/users');
const config = require('../../config');
const mongoose = require('mongoose');

const db = mongoose.connection;
mongoose.connect(config.mongodbUri, { useNewUrlParser: true });

// login api
router.post('/',function(req,res,next){
  const {email, pw} = req.body;
  const secret = req.app.get('jwt-secret');
  
  // check exist user
  const check = function(user){
    if(!user){
        throw new Error('login failed');
    } else {
      if(user.auth==false){              // auth 확인 (이메일 인증 여부)
        throw new Error('Need check auth'); 
      }

      if(user.verify(pw)){
        const p = new Promise((resolve,reject)=>{
          jwt.sign({
            _id: user._id,
            publish_day: Date.now()
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
      } else {
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
