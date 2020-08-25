const express = require('express');
const app = express();
const orderRoute = require('./api/routes/orders');
const productRoute = require('./api/routes/products');
const userRoutes = require( './api/routes/users');
const boyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

/*
//handling CORS errors
app.use((req , res , next) =>{
    res.header('Access-Control-Allow-Origin' , '*');
    res.header('Acess-Control-Allow-Header' , 'Origin-X-Requested , Content-Type , Authorization');
    if( req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods' , 'GET , POST , DELETE , PATCH , PUT');
        return res.status(200).json({});
    }
});
*/

//connecting to database
mongoose.connect('mongodb://localhost:27017/node_db' , 
{
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(()=>{
    console.log('connection successful');
})
.catch((err) =>{
    console.log(err.message);
})
//applying middlewares
app.use(morgan('dev'));
app.use(boyParser.urlencoded({ extended : true}));
app.use(boyParser.json());
app.use('/orders' , orderRoute);
app.use('/products' , productRoute);
app.use('/users' , userRoutes);
app.use('/uploads' ,express.static('uploads'));
//catching errors
app.use('/' , (req , res, next) =>{
    const err = new Error('not found');
    err.status = 404;
    next(err);
});

app.use((err , req , res , next) =>{
    res.status(err.status || 500);
    res.json({
        message : err.message,
    });
});

module.exports = app;