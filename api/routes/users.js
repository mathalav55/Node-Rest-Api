const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/user');
const bcrypt = require('bcrypt');

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
