const express = require('express');
const router = express.Router();

router.get('/' , (req , res , next) =>{
    res.status(200).json({
        'message' : 'handles get requests to ordrers'
    })
});

router.post('/' , (req , res , next) =>{
    res.status(200).json({
        'message' : 'handles post requests to ordrers'
    })
});

router.get('/:productId' , (req , res, next) =>{
    res.status(200).json({
        message : 'collected order',
        productId
    });
});
router.delete('/:productId' , (req , res, next) =>{
    productId = req.params.productId;
    res.status(200).json({
        message : 'deleted order',
        productId   
    });
});
module.exports = router;