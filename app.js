const express = require('express');
const app = express();
const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/orders');
const morgan = require('morgan');
const bodyParser = require('body-parser');

//applying middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//access control headers
app.use((req , res , next) =>{
    res.header('Access-Control-Allow-Origin' , '*');
    res.header(
        'Access-Control.Allow.Headers',
        'Origin , X-Requested-With , Content-Type , Accept , Authorization'
    );

    if(req.method === 'OPTIONS'){
        res.header('Allow-Access-Control-Methods' , 'PUT , POST , PATCH , DELETE , GET');
        return res.status(200).json({});
    }
});
//end point routers
app.use('/product' , productRoutes);
app.use('/order' , orderRoutes);

//error handlers
app.use((req , res , next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error , req, res , next) =>{
    res.status(error.status || 500);
    res.json({
        message : error.message,
    });
});


module.exports = app;