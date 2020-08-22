const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require("../models/order");
const Product = require("../models/product");
router.get('/',(req , res , next) =>{
    Order.find()
    .select('product quantity _id')
    .populate("product" , "_id name price")
    .exec()
    .then( docs =>{
        if( docs.length == 0){
            res.status(404).json({
                message : "No orders available. Add orders using below url",
                schema : {
                    product : "Product ID",
                    quantity : "Number"
                },
                req : "POST",
                url : "http://localhost:3000/orders"
            });
        }else{
            res.status(200).json({
                count : docs.length,
                orders : docs.map( doc =>{
                    return{ 
                        id : doc._id,
                        product : doc.product,
                        quantity : doc.quantity
                    };
                })
            })
        }
    })
    .catch(err =>{
        res.status(500).json({
            message : err.message
        })
    })
});

router.post('/',(req , res , next) =>{
    Product.findById(req.body.product)
    .exec()
    .then(product =>{
        if( product == null ){
            res.status(404).json({
                message : "product not found",
            });
        }else{
            const order = new Order({
                _id : mongoose.Types.ObjectId(),
                product : req.body.product,
                quantity : req.body.quantity,
                
            });
            order.save()
            .then( result =>{
                res.status(200).json({
                    message : "Order saved",
                    createdOrder : {
                        id : result._id,
                        product : result.product,
                        quantity : result.quantity
                    },
                    request :{
                        type : "GET",
                        url : "http://localhost:3000/orders"
                    }
                });
            })
            .catch( err =>{
                console.log(err);
                res.status(500).json({
                    message : err.message
                })
            })
        }
    }).catch( err =>{
        res.status(500).json({
            message : err.message
        })
    })
    
});

router.get('/:orderId' , (req , res , next) =>{
    Order.findById(req.params.orderId)
    .exec()
    .then( result =>{
        if ( !result){
            res.status(404).json({
                message : "Order not found",
            });
        }else{
            res.status(200).json({
                id : result._id,
                product : result.product,
                quantity : result.quantity
            });
        }
    })
    .catch( err =>{
        res.status(500).json({
            message : err.message,
        })
    })
});

router.delete('/:orderId' , (req , res , next) =>{
    Order.deleteOne({ _id : req.params.orderId})
    .exec()
    .then( result =>{
        res.status(201).json({
            message : "order deleted",
            request : {
                type : "POST",
                url : "http://localhost:3000/orders" 
            }
        })
    })
    .catch( err =>{
        res.status(500).json({
            message : err.message
        })
    })
});
module.exports = router;
