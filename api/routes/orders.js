const express = require('express');
const router = express.Router();

router.get('/',(req , res , next) =>{
    res.status(200).json({
        "message" : "It handles GET requests to Orders"
    });
});

router.post('/',(req , res , next) =>{
    res.status(200).json({
        "message" : "It handles POST requests to Orders"
    });
});

router.get('/:orderId' , (req , res , next) =>{
    const orderId = req.params.productId;
    res.status(200).json({
        message : 'id recieved (GET)',
        orderId,
    });
});

router.delete('/:productId' , (req , res , next) =>{
    const orderId = req.params.productId;
    res.status(200).json({
        message : 'id recieved (DELETE)',
        orderId
    });
});
module.exports = router;
