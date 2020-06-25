const express = require('express');
const router = express.Router();

router.get('/' , (req , res , next) =>{
    res.status(200).json({
        'message' : 'handles get requests to products'
    })
});

router.post('/' , (req , res , next) =>{
    const product = req.body;
    
    res.status(200).json({
        'message' : 'handles post requests to products',
        product

    })
});

router.patch('/:productId' , (req , res , next) =>{
    productId = req.params.productId;
    res.status(100).json({
        message : 'product updated',
        productID
    })
})
router.get('/:productId' , (req, res , next) =>{
    productId = req.params.productId;
    res.status(200).json({
        message : 'product',
        productId,
    })
});
router.delete('/:productId' , (req , res ,next) =>{
    productId = req.params.productId;
    res.status(200).json({
        message : 'deleted product',
        productId
    })
} )

module.exports = router;