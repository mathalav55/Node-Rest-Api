const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// user sign up
router.post('/signup' , ( req , res , next) =>{
    User.find({ email : req.body.email})
    .then((result)=>{
        if(result.length >=1){
            return res.status(409).json({
                message : 'email exits!'
            });
        }else{
            bcrypt.hash( req.body.password , 10 , (err , hash)=>{
                if( err){
                    return res.status(500).json({
                        message : err.message
                    })
                }else{
                    const user = User({
                        _id : mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash,
                    });
                    user.save()
                    .then((result) =>{
                        console.log(result);
                        res.status(200).json({
                            message : 'User created!'
                        })
                    })
                    .catch( (err) =>{
                        res.status(500).json({
                            message : err.message,
                        })
                    });
                }
            });
        }
    })
    
});
//user log in
router.post('/login' , (req , res , next) =>{
    User.find({ email : req.body.email}).exec()
    .then( user =>{
        if( user < 1){
            return res.status(401).json({
                message : 'Auth failed!'
            })
        }
        bcrypt.compare( req.body.password , user[0].password , (err , result) =>{
            if(err){
                return res.status(401).json({
                    message : 'Auth Failed'
                });
            }
            else if(result){
                const token = jwt.sign(
                    {
                        email : user[0].email,
                        id : user[0]._id,
                    },
                    "secret key",
                    {
                        expiresIn : '1h'
                    }
                );
                return res.status(200).json({
                    message : 'Auth Successfull',
                    token : token
                });
            }else{
                return res.status(401).json({
                    message : 'Auth Failed'
                });  
            }

        });
    })
    .catch( err =>{
        console.log(err.message);
        res.status(500).json({
            message : err.message
        });
    });
});

//deleting users
router.delete( '/:userId' , (req , res , next) =>{
    const id = req.params.userId;
    User.deleteOne( { _id : id}).exec()
    .then( (result) =>{
        console.log(result);
        res.status(201).json({
            message : 'user deleted'
        });
    })
    .catch( (err) =>{
        res.status(500).json({
            message : err.message
        });
    });
});
module.exports = router;
