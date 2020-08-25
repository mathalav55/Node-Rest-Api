const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Prodcut = require('../models/product');



const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      const now = new Date().toISOString();
      const date = now.replace(/:/g, '-');
      cb(null ,  date + file.originalname);
    }
  });
  
const fileFilter = ( req , file , cb) =>{
    if( file.mimetype === 'image/jpg' || file.mimetype === ' image/png'){
        cb ( null , true);
    }else{
        cb ( null , false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
   // fileFilter : fileFilter
});

//route to get product list,
router.get('/' , (req , res , next) =>{
    Prodcut.find()
    .exec()
    .then((docs)=>{
        var response;
        if( docs.length == 0){
            response =  {
                message : "No products available. Add products using below url",
                schema : {
                    name : "String",
                    price : "Number"
                },
                req : "POST",
                url : "http://localhost:3000/products"
            }
        }else{
            response = {
                count : docs.length,
                prodcuts : docs.map(doc =>{
                    return {
                        _id : doc._id,
                        name : doc.name,
                        price : doc.price,
                        productImage : req.file.path,
                        request : {
                            type : 'GET',
                            url : 'http://localhost:3000/products/' + doc._id,
                        }
                    };
                }),
                
            };
        }   
        res.status(200).json(response);
    })
    .catch((err) =>{
        console.log(err);
    })
});


//route to post a new product
router.post('/' ,upload.single('productImage') ,  (req , res , next) =>{
    console.log(req.file);
    const product = Prodcut({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage : req.file.path,
    });

    product.save()
    .then((result) =>{
        const response = {
            name : result.name,
            price : result.price,
            productImage : result.productImage,
            request : {
                type : 'GET',
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
                productImage : result.productImage,
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
