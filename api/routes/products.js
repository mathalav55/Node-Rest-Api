const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Prodcut = require('../models/product');

//route to get product list
router.get('/' , (req , res , next) =>{
    Prodcut.find()
    .exec()
    .then((docs)=>{
        const response = {
            count : docs.length,
            prodcuts : docs.map(doc =>{
                return {
                    _id : doc._id,
                    name : doc.name,
                    price : doc.price,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/products/' + doc._id,
                    }
                };
            }),
            
        };
        res.status(200).json(response);
    })
    .catch((err) =>{
        console.log(err);
    })
});


//route to post a new product
router.post('/' , (req , res , next) =>{
    const product = Prodcut({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
    });

    product.save()
    .then((result) =>{
        const response = {
            name : result.name,
            price : result.price,
            request : {
                type : 'POST',
                url : 'http://localhost:3000/products/' + result._id,
            }
        };
        res.status(200).json(response);
    })
    .catch((err)=>{
        res.status(500).json({
            message : err.message,
        })
    });
});

//route to get a product detail
router.get('/:productId' , (req , res , next) =>{
    const productId = req.params.productId;
    Prodcut.findById(productId)
    .exec()
    .then((result) =>{
        if( result == null)
            res.status(200).json({
                message : "Product not found"
            });
        else{
            const response = {
                _id : result._id,
                name : result.name,
                price : result.price,
                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/products/' + result._id,
                }
            };
            res.status(200).json(response);
        }
    })
    .catch((err)=>{
        res.status(200).json({
            message : err.message
        });
    });
});

//route to update a product
router.patch('/:productId' , (req , res , next) =>{
    const id = req.params.productId;
    const updateOps = { };
    for( ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Prodcut.update( { _id : id}  , { $set : updateOps})
    .exec()
    .then((result) =>{
        res.status(200).json({
            message : " Product Updated",
            request : {
                type : 'PATCH',
                url  : 'http://localhost:3000/products/' + _id,
            }
        });
    })
    .catch((err) =>{
        console.log(err);
    })
});

//route to delete a product

router.delete('/:productId' , (req , res , next) =>{
    const id = req.params.productId;
    Prodcut.deleteOne({ _id : id})
    .exec()
    .then((result) =>{
        res.status(200).json({
            message : "Deleted Successfully",
            request : {
                type : 'DELETE',
                url : 'http://localhost:3000/products/',
            }
        })
    })
    .catch((err) =>{
        res.status(500).json({
            result
        })
    })
})
module.exports = router;
